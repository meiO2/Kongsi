type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline";
};

export default function ActionButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
        variant === "outline"
          ? "border-[#3991FA]/30 bg-white text-[#3991FA] hover:bg-[#3991FA]/[0.06]"
          : "border-[#3991FA] bg-[#3991FA] text-white hover:bg-[#2B7FE0]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
