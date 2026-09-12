import { ClockIcon } from "./icons";

interface KongsiProgressProps {
  current: number;
  target: number;
  timeLeft?: string;
  size?: "sm" | "lg";
}

export default function KongsiProgress({ current, target, timeLeft, size = "sm" }: KongsiProgressProps) {
  const percent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={[
          "w-full overflow-hidden rounded-full bg-[#E4E1DF]/60",
          size === "lg" ? "h-3" : "h-2",
        ].join(" ")}
      >
        <div className="h-full rounded-full bg-[#3991FA]" style={{ width: `${percent}%` }} />
      </div>
      <div
        className={[
          "flex items-center justify-between text-[#7A7876]",
          size === "lg" ? "text-sm" : "text-xs",
        ].join(" ")}
      >
        <span>
          {current}/{target} pembeli
        </span>
        {timeLeft && (
          <span className="flex items-center gap-1">
            <ClockIcon className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} />
            Berakhir dalam {timeLeft}
          </span>
        )}
      </div>
    </div>
  );
}
