"use client";

import { useState } from "react";
import Link from "next/link";
import ActionButton from "./ActionButton";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusTimeline from "./OrderStatusTimeline";
import {
  calculateOrderTotal,
  formatRupiah,
  getNextOrderStep,
  type Order,
} from "@/lib/orderData";

export default function OrderDetailView({
  order: initialOrder,
}: {
  order: Order;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = getNextOrderStep(order);

  const subtotal = order.quantity * order.unitPrice;
  const total = calculateOrderTotal(order);

  async function updateOrderStatus(nextStatus: Order["status"]) {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal mengubah status pesanan.");
      }

      setOrder((current) => ({
        ...current,
        status: nextStatus,
      }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal mengubah status pesanan.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <div>
        <Link
          href="/umkm/pesanan"
          className="text-sm font-semibold text-[#3991FA] hover:underline"
        >
          ← Kembali ke Pesanan
        </Link>

        <h1
          className="mt-2 text-2xl font-bold text-[#292828] sm:text-[28px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Pesanan #{order.id}
        </h1>
      </div>

      {/* CUSTOMER */}
      <section className="rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-[#7A7876]">
          Customer
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoRow label="Nama Customer" value={order.customerName} />
          <InfoRow label="Nomor Pesanan" value={`#${order.id}`} />
          <InfoRow label="Jumlah Produk" value={`${order.quantity} item`} />
        </div>
      </section>

      {/* STATUS */}
      <section className="rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase text-[#7A7876]">
            Status Pesanan
          </h2>

          <OrderStatusBadge status={order.status} />
        </div>

        <OrderStatusTimeline order={order} />

        {order.status === "menunggu" && (
          <p className="mt-4 text-sm text-[#7A7876]">
            Pesanan ini akan diproses setelah Kongsi mencapai target pembeli.
          </p>
        )}

        {order.status === "dibatalkan" && (
          <p className="mt-4 text-sm text-[#7A7876]">
            Kongsi tidak mencapai target. Pesanan dibatalkan dan dana
            dikembalikan ke pembeli.
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-[#E14B4B]/10 p-3 text-sm text-[#E14B4B]">
            {error}
          </div>
        )}

        {nextStep && order.status !== "dibatalkan" && (
          <ActionButton
            className="mt-4"
            disabled={updating}
            onClick={() => updateOrderStatus(nextStep.nextStatus)}
          >
            {updating ? "Menyimpan..." : nextStep.actionLabel}
          </ActionButton>
        )}
      </section>

      {/* DETAIL */}
      <section className="rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-[#7A7876]">
          Detail Pesanan
        </h2>

        <div className="flex flex-col divide-y divide-[#F1EFEF] text-sm">
          <div className="flex justify-between py-2.5">
            <span className="text-[#292828]">{order.productName}</span>

            <span className="text-[#7A7876]">x{order.quantity}</span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-[#7A7876]">Harga</span>
            <span className="text-[#292828]">
              {formatRupiah(order.unitPrice)}
            </span>
          </div>

          <div className="flex justify-between py-2.5">
            <span className="text-[#7A7876]">Subtotal</span>
            <span className="text-[#292828]">{formatRupiah(subtotal)}</span>
          </div>

          {order.fulfillment === "delivery" && (
            <div className="flex justify-between py-2.5">
              <span className="text-[#7A7876]">Biaya Pengiriman</span>

              <span className="text-[#292828]">
                {formatRupiah(order.deliveryFee ?? 0)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2.5 font-bold text-[#292828]">
            <span>Total</span>

            <span style={{ fontFamily: "var(--font-heading)" }}>
              {formatRupiah(total)}
            </span>
          </div>
        </div>
      </section>

      {/* PEMENUHAN */}
      <section className="rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase text-[#7A7876]">
          Pemenuhan
        </h2>

        {order.fulfillment === "pickup" ? (
          <div className="flex items-start gap-2 text-sm text-[#292828]">
            <span aria-hidden>📍</span>

            <div>
              <p className="font-semibold">{order.pickupLocation}</p>

              <p className="text-[#7A7876]">{order.pickupHours}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-sm text-[#292828]">
            <span aria-hidden>🚚</span>
            <div>
              <p className="font-semibold">Alamat pengiriman customer</p>
              <p className="text-[#7A7876]">
                {order.deliveryAddress ?? "Alamat belum tersedia"}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#7A7876]">{label}</p>

      <p className="mt-0.5 text-sm font-semibold text-[#292828]">{value}</p>
    </div>
  );
}
