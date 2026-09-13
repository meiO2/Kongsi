"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "./icons";

function parseToSeconds(timeLeft: string): number {
  const parts = timeLeft.split(":").map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = parts;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

interface CountdownTimerProps {
  timeLeft: string;
  expired?: boolean;
}

export default function CountdownTimer({ timeLeft, expired = false }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => parseToSeconds(timeLeft));

  useEffect(() => {
    if (expired || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [expired, secondsLeft]);

  const isExpired = expired || secondsLeft <= 0;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-[#7A7876]/10 px-4 py-3 text-sm font-semibold text-[#7A7876]">
        <ClockIcon className="h-4.5 w-4.5" />
        Waktu Kongsi telah habis.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[#FFCF00]/15 px-4 py-3 text-sm font-bold text-[#7A6300]">
      <ClockIcon className="h-4.5 w-4.5" />
      Kongsi berakhir dalam {formatSeconds(secondsLeft)}
    </div>
  );
}
