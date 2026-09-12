import type { ActiveKongsi } from "@/lib/umkmMockData";
import { formatRupiah } from "@/lib/umkmMockData";
import { ClockIcon } from "./icons";

export default function ActiveKongsiCard({ kongsi }: { kongsi: ActiveKongsi }) {
  const percent = Math.min(
    100,
    Math.round((kongsi.currentParticipants / kongsi.targetParticipants) * 100)
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-4">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F1EFEF] text-3xl">
          <span aria-hidden>{kongsi.imageEmoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-[15px] font-semibold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {kongsi.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#7A7876] line-through">
              {formatRupiah(kongsi.normalPrice)}
            </span>
            <span className="text-[15px] font-bold text-[#3991FA]" style={{ fontFamily: "var(--font-heading)" }}>
              {formatRupiah(kongsi.kongsiPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4E1DF]/60">
          <div className="h-full rounded-full bg-[#3991FA]" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-[#7A7876]">
          <span>
            {kongsi.currentParticipants}/{kongsi.targetParticipants} pembeli
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            Berakhir dalam {kongsi.timeLeft}
          </span>
        </div>
      </div>

      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#FFCF00]/20 px-2.5 py-1 text-xs font-semibold text-[#7A6300]">
        🔥 {kongsi.remainingLabel}
      </span>

      <button
        type="button"
        className="mt-1 w-full rounded-xl bg-[#3991FA] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
      >
        Kelola Kongsi
      </button>
    </div>
  );
}
