import type { ComponentType } from "react";
import type { OverviewMetric } from "@/lib/umkmMockData";
import { ArrowDownRightIcon, ArrowUpRightIcon, ShoppingBagIcon, UsersIcon, WalletIcon } from "./icons";

const ICONS: Record<OverviewMetric["icon"], ComponentType<{ className?: string }>> = {
  users: UsersIcon,
  bag: ShoppingBagIcon,
  money: WalletIcon,
  buyers: UsersIcon,
};

const ICON_BG: Record<OverviewMetric["icon"], string> = {
  users: "bg-[#3991FA]/10 text-[#3991FA]",
  bag: "bg-[#FFCF00]/20 text-[#7A6300]",
  money: "bg-[#1FA971]/10 text-[#1FA971]",
  buyers: "bg-[#3991FA]/10 text-[#3991FA]",
};

export default function OverviewCard({ metric }: { metric: OverviewMetric }) {
  const Icon = ICONS[metric.icon];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-5 shadow-[0_1px_4px_rgba(41,40,40,0.04)]">
      <div className={["flex h-10 w-10 items-center justify-center rounded-full", ICON_BG[metric.icon]].join(" ")}>
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-sm font-medium text-[#7A7876]">{metric.label}</p>
        <p
          className="mt-1 text-[28px] font-bold leading-tight text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {metric.value}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-[#7A7876]">
        {metric.trend === "up" && <ArrowUpRightIcon className="h-3.5 w-3.5 text-[#1FA971]" />}
        {metric.trend === "down" && <ArrowDownRightIcon className="h-3.5 w-3.5 text-[#E14B4B]" />}
        <span className={metric.trend === "up" ? "text-[#1FA971]" : metric.trend === "down" ? "text-[#E14B4B]" : ""}>
          {metric.supportingText}
        </span>
      </div>
    </div>
  );
}
