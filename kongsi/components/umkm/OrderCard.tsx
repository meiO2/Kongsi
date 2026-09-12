import Link from "next/link";
import { calculateOrderTotal, formatRupiah, type Order } from "@/lib/orderMockData";
import OrderStatusBadge from "./OrderStatusBadge";

const FULFILLMENT_LABEL: Record<Order["fulfillment"], string> = {
  pickup: "Pickup",
  delivery: "Delivery",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-4 sm:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#292828]">#{order.id}</p>
          <p className="text-sm text-[#7A7876]">{order.customerName}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-1 border-t border-[#F1EFEF] pt-3 text-sm">
        <div className="flex justify-between text-[#292828]">
          <span>{order.productName}</span>
          <span>x{order.quantity}</span>
        </div>
        <div className="flex justify-between text-[#7A7876]">
          <span>{FULFILLMENT_LABEL[order.fulfillment]}</span>
          <span className="font-semibold text-[#292828]">
            {formatRupiah(calculateOrderTotal(order))}
          </span>
        </div>
      </div>

      <Link
        href={`/umkm/pesanan/${order.id}`}
        className="mt-1 flex w-full items-center justify-center rounded-xl border border-[#3991FA]/30 py-2.5 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
      >
        Lihat Detail
      </Link>
    </div>
  );
}
