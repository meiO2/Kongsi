"use client";

import { useState } from "react";
import OrderCard from "@/components/customer/OrderCard";
import { ORDERS, type OrderStatus } from "@/lib/customerMockData";

const TABS: { value: OrderStatus; label: string }[] = [
  { value: "berlangsung", label: "Sedang Berlangsung" },
  { value: "sukses", label: "Sukses" },
  { value: "gagal", label: "Gagal" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("berlangsung");

  const filteredOrders = ORDERS.filter((order) => order.status === activeTab);

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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
            <p className="text-sm text-[#7A7876]">Belum ada pesanan di kategori ini.</p>
          </div>
        )}
      </div>
    </main>
  );
}
