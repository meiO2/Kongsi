import Link from "next/link";
import { calculateOrderTotal, formatRupiah, type Order } from "@/lib/orderMockData";
import OrderStatusBadge from "./OrderStatusBadge";

const FULFILLMENT_LABEL: Record<Order["fulfillment"], string> = {
  pickup: "Pickup",
  delivery: "Delivery",
};

export default function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[#E4E1DF] bg-white sm:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#E4E1DF] bg-[#F7F7F6] text-xs font-semibold uppercase text-[#7A7876]">
            <th className="px-4 py-3">Nomor Pesanan</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Produk</th>
            <th className="px-4 py-3">Jumlah</th>
            <th className="px-4 py-3">Total Pembayaran</th>
            <th className="px-4 py-3">Pemenuhan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[#F1EFEF] last:border-0">
              <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#292828]">
                #{order.id}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-[#292828]">{order.customerName}</td>
              <td className="px-4 py-3.5 text-[#292828]">{order.productName}</td>
              <td className="px-4 py-3.5 text-[#292828]">{order.quantity}</td>
              <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#292828]">
                {formatRupiah(calculateOrderTotal(order))}
              </td>
              <td className="px-4 py-3.5 text-[#292828]">{FULFILLMENT_LABEL[order.fulfillment]}</td>
              <td className="px-4 py-3.5">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/umkm/pesanan/${order.id}`}
                  className="whitespace-nowrap text-sm font-semibold text-[#3991FA] hover:underline"
                >
                  Lihat Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
