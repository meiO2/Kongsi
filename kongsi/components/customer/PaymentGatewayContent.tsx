"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { formatRupiah } from "@/lib/customerData";
import { CheckCircleIcon, ClockIcon } from "@/components/customer/icons";

type SnapCallbacks = {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: SnapCallbacks) => void;
    };
  }
}

export default function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<"pending" | "success" | "failed">(
    "pending",
  );
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const order = searchParams.get("order") ?? "KS001";
  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const total = Number(searchParams.get("total") ?? 0);

  useEffect(() => {
    if (!orderId || result === "success") return;
    let active = true;
    const checkPayment = async () => {
      const response = await fetch(
        `/api/payment?orderId=${encodeURIComponent(orderId)}`,
      );
      if (!response.ok || !active) return;
      const body = (await response.json()) as {
        payment_status?: string;
        participation_id?: string;
      };
      if (body.payment_status === "paid" && body.participation_id) {
        setResult("success");
        setProcessing(false);
      }
    };
    const interval = window.setInterval(checkPayment, 3000);
    checkPayment();
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [orderId, result]);

  async function startPayment() {
    if (!orderId || !paymentMethod) {
      setError("Data pembayaran tidak lengkap.");
      setResult("failed");
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethod }),
      });
      const body = (await response.json()) as {
        error?: string;
        token?: string;
        redirectUrl?: string;
      };
      if (!response.ok || !body.token) {
        throw new Error(body.error ?? "Transaksi Midtrans gagal dibuat.");
      }

      if (window.snap) {
        window.snap.pay(body.token, {
          onSuccess: async () => {
            setError("Pembayaran berhasil. Mengonfirmasi pesanan...");
            await fetch(`/api/payment?orderId=${encodeURIComponent(orderId)}`);
          },
          onPending: () => {
            setProcessing(false);
            setError("Pembayaran masih menunggu konfirmasi Midtrans.");
          },
          onError: () => {
            setProcessing(false);
            setError("Pembayaran gagal diproses oleh Midtrans.");
            setResult("failed");
          },
        });
      } else if (body.redirectUrl) {
        window.location.href = body.redirectUrl;
      } else {
        throw new Error("Snap Midtrans belum siap.");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Transaksi Midtrans gagal dibuat.",
      );
      setResult("failed");
      setProcessing(false);
    }
  }

  if (result === "success") {
    return (
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-4 pb-20 pt-16 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1FA971]/10 text-[#1FA971]">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <h1
          className="text-xl font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Pembayaran Berhasil
        </h1>
        <p className="text-sm text-[#7A7876]">
          Pesanan #{order} sebesar {formatRupiah(total)} telah dikonfirmasi.
        </p>
        <button
          type="button"
          onClick={() => router.push("/customer/orders")}
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
        >
          Lihat Pesanan
        </button>
      </div>
    );
  }

  if (result === "failed") {
    return (
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-4 pb-20 pt-16 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E14B4B]/10 text-[#E14B4B]">
          <ClockIcon className="h-8 w-8" />
        </div>
        <h1
          className="text-xl font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Pembayaran Gagal
        </h1>
        <p className="text-sm text-[#7A7876]">
          {error ??
            `Terjadi kendala saat memproses pembayaran untuk pesanan #${order}.`}
        </p>
        <button
          type="button"
          onClick={() => setResult("pending")}
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6 px-4 pb-20 pt-12 sm:px-6">
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1
          className="text-xl font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Payment Gateway
        </h1>
        <p className="text-sm text-[#7A7876]">
          Pembayaran diproses aman melalui Midtrans.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#7A7876]">Order</span>
          <span className="font-semibold text-[#292828]">#{order}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#7A7876]">Total</span>
          <span
            className="text-lg font-bold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {formatRupiah(total)}
          </span>
        </div>
        <p className="border-t border-[#F1EFEF] pt-3 text-xs text-[#7A7876]">
          Kamu akan diarahkan ke halaman pembayaran Midtrans.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={startPayment}
            disabled={processing}
            className="flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
          >
            {processing
              ? "Menghubungkan ke Midtrans..."
              : "Bayar dengan Midtrans"}
          </button>
        </div>
        {error && <p className="text-sm text-[#E14B4B]">{error}</p>}
      </div>
    </div>
  );
}
