"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/customer/OrderCard";
import { type Order, type OrderStatus } from "@/lib/customerData";

const TABS: { value: OrderStatus; label: string }[] = [
  { value: "berlangsung", label: "Sedang Berlangsung" },
  { value: "sukses", label: "Sukses" },
  { value: "gagal", label: "Gagal" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("berlangsung");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        const result = (await response.json()) as
          | Array<Record<string, string | number | null>>
          | { error?: string };
        if (!response.ok || !Array.isArray(result)) {
          throw new Error(
            "error" in result ? result.error : "Pesanan gagal dimuat.",
          );
        }
        setOrders(
          result.map((order) => {
            const currentParticipants = Number(order.participants_after ?? 0);
            const targetParticipants = Number(order.target_participants ?? 1);
            const fulfillmentStatus = String(order.status);
            const paymentStatus = String(order.payment_status);
            const status =
              ["failed", "refund-pending", "refunded"].includes(paymentStatus) || fulfillmentStatus === "dibatalkan"
                ? "gagal"
                : fulfillmentStatus === "selesai"
                  ? "selesai"
                  : currentParticipants >= targetParticipants ||
                      !["menunggu", "null", "undefined"].includes(fulfillmentStatus)
                    ? "sukses"
                    : "berlangsung";
            return {
              id: String(order.id),
              orderNumber: String(order.order_number),
              dealId: String(order.group_deal_id),
              sellerId: String(order.owner_id),
              dealName: String(order.product_name),
              seller: String(order.seller_name ?? "UMKM lokal"),
              currentParticipants,
              targetParticipants,
              status,
              statusLabel:
                status === "selesai"
                  ? "Selesai"
                  : status === "gagal"
                    ? "Pembayaran dikembalikan"
                    : status === "sukses"
                      ? "Pesanan sedang diproses"
                      : "Menunggu Kongsi Berhasil",
              helperLabel:
                status === "selesai"
                  ? "Pesanan sudah diterima"
                  : status === "gagal"
                    ? "Target tidak tercapai"
                    : status === "sukses"
                      ? "Target tercapai 🎉"
                      : `Tinggal ${Math.max(0, targetParticipants - currentParticipants)} orang lagi!`,
              imageEmoji: "🛍️",
              imageUrl: order.image_url ? String(order.image_url) : undefined,
              hasReview: Boolean(order.has_review),
              quantity: Number(order.quantity),
              unitPrice: Number(order.unit_price),
              fulfillment: order.fulfillment as "pickup" | "delivery",
              pickupLocation: order.pickup_location
                ? String(order.pickup_location)
                : undefined,
              pickupHours: order.pickup_hours
                ? String(order.pickup_hours)
                : undefined,
              deliveryFee: Number(order.delivery_fee ?? 0),
            };
          }),
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Pesanan gagal dimuat.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <h1
        className="text-2xl font-bold text-[#292828]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Pesanan
      </h1>

      {/* Status tabs */}
      <div className="flex rounded-2xl bg-[#F1EFEF] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={[
              "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
              activeTab === tab.value
                ? "bg-white text-[#3991FA] shadow-[0_1px_4px_rgba(41,40,40,0.08)]"
                : "text-[#7A7876] hover:text-[#292828]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order list */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-[#7A7876]">Memuat pesanan...</p>
        ) : error ? (
          <p className="text-sm text-[#E14B4B]">{error}</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
            <p className="text-sm text-[#7A7876]">
              Belum ada pesanan di kategori ini.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
