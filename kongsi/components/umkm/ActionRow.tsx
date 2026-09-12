import Link from "next/link";
import type { ComponentType } from "react";
import type { ActionItem } from "@/lib/umkmMockData";
import { AlarmClockIcon, PackageCheckIcon, ShoppingBagIcon } from "./icons";

const ICON_BY_TYPE: Record<ActionItem["type"], ComponentType<{ className?: string }>> = {
  process: ShoppingBagIcon,
  ready: PackageCheckIcon,
  ending: AlarmClockIcon,
};

const ICON_BG: Record<ActionItem["type"], string> = {
  process: "bg-[#3991FA]/10 text-[#3991FA]",
  ready: "bg-[#1FA971]/10 text-[#1FA971]",
  ending: "bg-[#FFCF00]/20 text-[#7A6300]",
};

export default function ActionRow({ item }: { item: ActionItem }) {
  const Icon = ICON_BY_TYPE[item.type];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E4E1DF] bg-white p-3.5">
      <span className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-full", ICON_BG[item.type]].join(" ")}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="flex-1 text-sm font-medium text-[#292828]">{item.message}</p>
      <Link
        href={item.href}
        className="shrink-0 whitespace-nowrap rounded-full border border-[#3991FA]/30 px-3 py-1.5 text-xs font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
      >
        {item.actionLabel}
      </Link>
    </div>
  );
}
