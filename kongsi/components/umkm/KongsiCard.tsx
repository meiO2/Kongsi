import Link from "next/link";
import type { KongsiDeal } from "@/lib/kongsiData";
import { formatRupiah } from "@/lib/kongsiData";
import KongsiProgress from "./KongsiProgress";
import KongsiStatusBadge from "./KongsiStatusBadge";

const RESULT_NOTE: Record<KongsiDeal["status"], string | null> = {
  berlangsung: null,
  sukses: "🎉 Target tercapai — pesanan siap diproses",
  selesai: "Semua pesanan telah selesai diproses",
  "tidak-berhasil": "Target tidak tercapai — dana dikembalikan ke pembeli",
};

export default function KongsiCard({ deal }: { deal: KongsiDeal }) {
  const isAlmostThere =
    deal.status === "berlangsung" &&
    deal.currentParticipants >= deal.targetParticipants - 2;
  const resultNote = RESULT_NOTE[deal.status];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cover bg-center bg-[#F1EFEF] text-3xl"
          style={
            deal.imageUrl
              ? { backgroundImage: `url(${deal.imageUrl})` }
              : undefined
          }
        >
          {!deal.imageUrl && <span aria-hidden>{deal.imageEmoji}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="truncate text-[15px] font-semibold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {deal.name}
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#7A7876] line-through">
              {formatRupiah(deal.normalPrice)}
            </span>
            <span
              className="text-[15px] font-bold text-[#3991FA]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatRupiah(deal.kongsiPrice)}
            </span>
          </div>
          <KongsiStatusBadge status={deal.status} />
        </div>
      </div>

      <KongsiProgress
        current={deal.currentParticipants}
        target={deal.targetParticipants}
        timeLeft={deal.status === "berlangsung" ? deal.timeLeft : undefined}
        deadlineAt={deal.status === "berlangsung" ? deal.deadlineAt : undefined}
      />

      {isAlmostThere && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#FFCF00]/20 px-2.5 py-1 text-xs font-semibold text-[#7A6300]">
          🔥 Tinggal {deal.targetParticipants - deal.currentParticipants}{" "}
          pembeli lagi!
        </span>
      )}

      {resultNote && <p className="text-xs text-[#7A7876]">{resultNote}</p>}

      <Link
        href={`/umkm/kongsi/${deal.id}`}
        className="mt-1 flex w-full items-center justify-center rounded-xl bg-[#3991FA] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
      >
        Kelola Kongsi
      </Link>
    </div>
  );
}
