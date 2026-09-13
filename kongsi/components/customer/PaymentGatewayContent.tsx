"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRupiah } from "@/lib/customerMockData";
import { CheckCircleIcon, ClockIcon } from "@/components/customer/icons";

export default function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<"pending" | "success" | "failed">("pending");

  const order = searchParams.get("order") ?? "KS001";
  const total = Number(searchParams.get("total") ?? 0);

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
          Terjadi kendala saat memproses pembayaran untuk pesanan #{order}.
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
      <div className="flex flex-col items-center gap-2 text-center">
        <h1
          className="text-xl font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Payment Gateway
        </h1>
        <p className="text-sm text-[#7A7876]">
          Halaman ini hanya simulasi — belum terhubung ke payment gateway sungguhan.
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
          Choose your payment method — simulasi status berikut ini:
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setResult("success")}
            className="flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
          >
            Simulasikan Pembayaran Berhasil
          </button>
          <button
            type="button"
            onClick={() => setResult("failed")}
            className="flex w-full items-center justify-center rounded-2xl border border-[#E14B4B]/30 py-3 text-sm font-semibold text-[#E14B4B] transition-colors hover:bg-[#E14B4B]/[0.06]"
          >
            Simulasikan Pembayaran Gagal
          </button>
        </div>
      </div>
    </div>
  );
}
