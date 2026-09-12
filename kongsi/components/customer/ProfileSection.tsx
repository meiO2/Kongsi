import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ProfileSection({ title, children, action }: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          className="text-[17px] font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        {action}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </section>
  );
}

interface ProfileRowProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}

export function ProfileRow({ icon, label, value, onClick, danger = false }: ProfileRowProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors",
        onClick ? "hover:bg-[#F1EFEF]" : "",
      ].join(" ")}
    >
      {icon && (
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            danger ? "bg-[#E14B4B]/10 text-[#E14B4B]" : "bg-[#F1EFEF] text-[#292828]",
          ].join(" ")}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span
          className={[
            "block text-[15px] font-medium",
            danger ? "text-[#E14B4B]" : "text-[#292828]",
          ].join(" ")}
        >
          {label}
        </span>
        {value && <span className="block text-sm text-[#7A7876]">{value}</span>}
      </span>
      {onClick && <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#B3B0AE]" />}
    </Comp>
  );
}
