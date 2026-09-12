interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
}

export default function ProgressBar({ current, target, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className={["h-2 w-full overflow-hidden rounded-full bg-[#E4E1DF]/60", className ?? ""].join(" ")}>
      <div
        className="h-full rounded-full bg-[#3991FA] transition-[width]"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
