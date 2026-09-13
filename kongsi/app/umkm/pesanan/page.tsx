"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/umkm/OrderTable";
import OrderCard from "@/components/umkm/OrderCard";
import {
  ORDER_FILTERS,
  type Order,
  type OrderStatus,
} from "@/lib/orderMockData";

export default function PesananPage() {
  const [filter, setFilter] = useState<OrderStatus | "semua">("semua");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders?scope=umkm");
        const result = (await response.json()) as
          | Array<Record<string, string | number | null>>
          | { error?: string };
        if (!response.ok || !Array.isArray(result)) {
          throw new Error(
            "error" in result ? result.error : "Pesanan gagal dimuat.",
          );
        }
        setOrders(
          result.map((order) => ({
            id: String(order.order_number),
            kongsiId: String(order.group_deal_id),
            customerName: String(order.customer_name ?? "Customer"),
            productName: String(order.product_name),
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
            status: order.status as OrderStatus,
          })),
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

  const filteredOrders =
    filter === "semua"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 pb-16 pt-8 sm:px-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#292828] sm:text-[28px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Pesanan
        </h1>
        <p className="mt-1 text-[15px] text-[#7A7876]">
          Kelola pesanan yang masuk ke tokomu.
        </p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {ORDER_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={[
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === item.value
                ? "border-[#3991FA] bg-[#3991FA]/[0.06] text-[#3991FA]"
                : "border-[#E4E1DF] bg-white text-[#292828] hover:border-[#3991FA]/40",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
          <p className="text-sm text-[#7A7876]">Memuat pesanan...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#E14B4B]/30 bg-[#E14B4B]/10 py-14 text-center">
          <p className="text-sm text-[#E14B4B]">{error}</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          <OrderTable orders={filteredOrders} />
          <div className="flex flex-col gap-3 sm:hidden">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
          <p className="text-sm text-[#7A7876]">
            Belum ada pesanan di kategori ini.
          </p>
        </div>
      )}
    </main>
  );
}
