import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-[#3991FA] text-white hover:bg-[#2B7FE0]",
  outline: "border border-[#E4E1DF] bg-white text-[#292828] hover:border-[#3991FA]/40",
  ghost: "bg-transparent text-[#3991FA] hover:bg-[#3991FA]/[0.06]",
  danger: "border border-[#E14B4B]/30 bg-white text-[#E14B4B] hover:bg-[#E14B4B]/[0.06]",
};

export default function ActionButton({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_STYLES[variant],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
