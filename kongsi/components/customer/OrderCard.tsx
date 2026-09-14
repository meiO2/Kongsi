import Link from "next/link";
import type { Order } from "@/lib/customerData";
import ProgressBar from "./ProgressBar";

const STATUS_STYLES: Record<Order["status"], string> = {
  berlangsung: "bg-[#3991FA]/10 text-[#3991FA]",
  sukses: "bg-[#1FA971]/10 text-[#1FA971]",
  gagal: "bg-[#E14B4B]/10 text-[#E14B4B]",
  selesai: "bg-[#7A7876]/10 text-[#7A7876]",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[#E4E1DF] bg-white p-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cover bg-center bg-[#F1EFEF] text-3xl"
        style={order.imageUrl ? { backgroundImage: `url(${order.imageUrl})` } : undefined}
      >
        {!order.imageUrl && <span aria-hidden>{order.imageEmoji}</span>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="truncate text-[15px] font-semibold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {order.dealName}
            </h3>
            <p className="text-xs text-[#7A7876]">{order.seller}</p>
          </div>
          <span
            className={[
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_STYLES[order.status],
            ].join(" ")}
          >
            {order.statusLabel}
          </span>
        </div>

        {order.status === "berlangsung" && (
          <div className="flex flex-col gap-1.5">
            <ProgressBar current={order.currentParticipants} target={order.targetParticipants} />
            <div className="flex items-center justify-between text-xs text-[#7A7876]">
              <span>
                {order.currentParticipants}/{order.targetParticipants} orang sudah ikut
              </span>
              <span className="font-semibold text-[#7A6300]">{order.helperLabel}</span>
            </div>
          </div>
        )}

        {order.status !== "berlangsung" && (
          <p
            className={[
              "text-sm font-semibold",
              order.status === "sukses" ? "text-[#1FA971]" : "text-[#7A7876]",
            ].join(" ")}
          >
            {order.helperLabel}
          </p>
        )}

        {order.status === "selesai" && (
          <Link
            href={`/rating/${order.id}`}
            className="mt-1 flex w-fit items-center justify-center rounded-xl border border-[#3991FA]/30 px-4 py-2 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
          >
            {order.hasReview ? "Lihat Ulasan" : "Beri Rating"}
          </Link>
        )}
      </div>
    </div>
  );
}
