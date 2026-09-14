"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatRupiah,
  type GroupDeal,
  type Seller,
} from "@/lib/customerData";
import FulfillmentPicker, { type FulfillmentChoice } from "./FulfillmentPicker";
import PaymentMethodSelector, {
  type PaymentMethod,
} from "./PaymentMethodSelector";
import { MinusIcon, PlusIcon } from "./icons";

function generateOrderNumber(dealId: string): string {
  let hash = 0;
  for (let i = 0; i < dealId.length; i++) {
    hash = (hash * 31 + dealId.charCodeAt(i)) % 900;
  }
  return `KS${String(100 + Math.abs(hash)).padStart(3, "0")}`;
}

export default function CheckoutView({
  deal,
  seller,
}: {
  deal: GroupDeal;
  seller?: Seller;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<FulfillmentChoice>(
    deal.fulfillment === "delivery" ? "delivery" : "pickup",
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bothAvailable = deal.fulfillment === "pickup-delivery";
  const deliveryFee = fulfillment === "delivery" ? (deal.deliveryFee ?? 0) : 0;
  const subtotal = deal.kongsiPrice * quantity;
  const total = subtotal + deliveryFee;
  const orderNumber = useMemo(() => generateOrderNumber(deal.id), [deal.id]);

  const canPay = paymentMethod !== null;

  const handlePay = async () => {
    if (!canPay) return;
    setSubmitting(true);
    setError(null);

    try {
      let deliveryAddress: string | null = null;
      if (fulfillment === "delivery") {
        const profileResponse = await fetch("/api/profile");
        const profile = (await profileResponse.json()) as {
          addresses?: Array<{ detail?: string; is_primary?: boolean }>;
          error?: string;
        };
        if (!profileResponse.ok) throw new Error(profile.error ?? "Profil gagal dimuat.");
        const addresses = profile.addresses ?? [];
        const selectedAddress =
          addresses.find((address) => address.is_primary) ?? addresses[0];
        deliveryAddress = selectedAddress?.detail?.trim() || null;
        if (!deliveryAddress) {
          throw new Error(
            "Tambahkan alamat utama di profil sebelum memilih delivery.",
          );
        }
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupDealId: deal.id,
          quantity,
          fulfillment,
          deliveryAddress,
        }),
      });
      const result = (await response.json()) as {
        id?: string;
        order_number?: string;
        error?: string;
      };
      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "Pesanan gagal dibuat.");
      }

      const params = new URLSearchParams({
        order: result.order_number ?? orderNumber,
        orderId: result.id,
        total: String(total),
        paymentMethod,
      });
      router.push(`/payment?${params.toString()}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Pesanan gagal dibuat.",
      );
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-col gap-6 px-4 pb-28 pt-8 sm:px-6">
      <Link
        href={`/kongsi/${deal.id}`}
        className="w-fit text-sm font-semibold text-[#3991FA] hover:underline"
      >
        ← Kembali ke Kongsi
      </Link>

      <h1
        className="text-2xl font-bold text-[#292828]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Checkout
      </h1>

      {/* Ringkasan Pesanan */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase text-[#7A7876]">
          Ringkasan Pesanan
        </h2>

        <div className="flex gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F1EFEF] text-3xl">
            <span aria-hidden>{deal.imageEmoji}</span>
          </div>
          <div>
            <p
              className="text-[15px] font-semibold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {deal.name}
            </p>
            <p className="text-sm text-[#7A7876]">
              {seller?.name ?? deal.seller}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#F1EFEF] pt-4">
          <span className="text-sm text-[#7A7876]">Harga Kongsi</span>
          <span className="text-sm font-semibold text-[#292828]">
            {formatRupiah(deal.kongsiPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7A7876]">Jumlah</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E1DF] text-[#292828] transition-colors hover:border-[#3991FA]/40 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kurangi jumlah"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-4 text-center text-sm font-semibold text-[#292828]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E1DF] text-[#292828] transition-colors hover:border-[#3991FA]/40"
              aria-label="Tambah jumlah"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#F1EFEF] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#7A7876]">Subtotal</span>
            <span className="text-[#292828]">{formatRupiah(subtotal)}</span>
          </div>
          {fulfillment === "delivery" && (
            <div className="flex items-center justify-between">
              <span className="text-[#7A7876]">Biaya Pengiriman</span>
              <span className="text-[#292828]">
                {formatRupiah(deliveryFee)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 text-base font-bold text-[#292828]">
            <span>Total</span>
            <span style={{ fontFamily: "var(--font-heading)" }}>
              {formatRupiah(total)}
            </span>
          </div>
        </div>
      </section>

      {/* Fulfillment */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase text-[#7A7876]">
          Pemenuhan Pesanan
        </h2>
        {bothAvailable ? (
          <FulfillmentPicker
            value={fulfillment}
            onChange={setFulfillment}
            pickupLocation={deal.pickupLocation}
            pickupHours={deal.pickupHours}
            deliveryFee={deal.deliveryFee}
          />
        ) : deal.fulfillment === "pickup" ? (
          <div className="flex items-start gap-2.5 rounded-2xl border border-[#E4E1DF] p-4">
            <span aria-hidden className="text-lg">
              📍
            </span>
            <div>
              <p className="text-sm font-semibold text-[#292828]">
                Ambil di tempat
              </p>
              <p className="mt-0.5 text-sm text-[#7A7876]">
                {deal.pickupLocation}
              </p>
              <p className="text-sm text-[#7A7876]">{deal.pickupHours}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-2xl border border-[#E4E1DF] p-4">
            <span aria-hidden className="text-lg">
              🚚
            </span>
            <div>
              <p className="text-sm font-semibold text-[#292828]">Pengiriman</p>
              <p className="mt-0.5 text-sm text-[#7A7876]">
                Biaya pengiriman {formatRupiah(deal.deliveryFee ?? 0)}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Payment method */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase text-[#7A7876]">
          Metode Pembayaran
        </h2>
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </section>

      {/* CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-[#E4E1DF] bg-white p-4 sm:static sm:border-0 sm:bg-transparent sm:p-0">
        {error && <p className="mb-3 text-sm text-[#E14B4B]">{error}</p>}
        <div className="mx-auto flex w-full max-w-[680px] items-center justify-between gap-4 sm:hidden">
          <span className="text-sm font-semibold text-[#7A7876]">Total</span>
          <span
            className="text-lg font-bold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {formatRupiah(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePay}
          disabled={!canPay || submitting}
          className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0"
        >
          {submitting ? "Membuat Pesanan..." : "Bayar Sekarang"}
        </button>
      </div>
    </main>
  );
}
