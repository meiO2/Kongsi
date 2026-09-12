import type { GroupDeal } from "@/lib/customerMockData";
import { formatRupiah } from "@/lib/customerMockData";
import ProgressBar from "./ProgressBar";
import { ClockIcon, LocationIcon } from "./icons";

interface DealCardProps {
  deal: GroupDeal;
  variant?: "default" | "nearby";
  highlight?: boolean;
}

export default function DealCard({ deal, variant = "default", highlight = false }: DealCardProps) {
  const isAlmostThere =
    highlight || deal.currentParticipants >= deal.targetParticipants - 2;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E1DF] bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(41,40,40,0.08)]">
      {/* Image placeholder */}
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#F1EFEF] text-5xl">
        <span aria-hidden>{deal.imageEmoji}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <h3
            className="text-[15px] font-semibold leading-snug text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {deal.name}
          </h3>
          <p className="text-xs text-[#7A7876]">{deal.seller}</p>
        </div>

        {variant === "nearby" && deal.distanceLabel && (
          <div className="flex items-center gap-1 text-xs text-[#7A7876]">
            <LocationIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{deal.distanceLabel}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-[#7A7876] line-through">
            {formatRupiah(deal.normalPrice)}
          </span>
          <span className="text-base font-bold text-[#3991FA]" style={{ fontFamily: "var(--font-heading)" }}>
            {formatRupiah(deal.kongsiPrice)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <ProgressBar current={deal.currentParticipants} target={deal.targetParticipants} />
          <div className="flex items-center justify-between text-xs text-[#7A7876]">
            <span>
              {deal.currentParticipants}/{deal.targetParticipants} orang sudah ikut
            </span>
            {variant !== "nearby" && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {deal.timeLeft}
              </span>
            )}
          </div>
        </div>

        {isAlmostThere && (
          <span className="inline-flex w-fit items-center rounded-full bg-[#FFCF00]/20 px-2.5 py-1 text-xs font-semibold text-[#7A6300]">
            {deal.remainingLabel}
          </span>
        )}
      </div>
    </div>
  );
}
