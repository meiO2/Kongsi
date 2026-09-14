"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "./icons";

function parseToSeconds(timeLeft: string): number {
  const value = timeLeft.trim().toLowerCase();
  if (!value) return 0;

  if (value.includes(":")) {
    const parts = value.split(":").map((part) => Number(part));
    if (parts.length === 3 && parts.every(Number.isFinite)) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  const durationMatch = value.match(
    /^(\d+(?:\.\d+)?)\s*(detik|second|menit|minute|jam|hour|hari|day)s?$/i,
  );
  if (!durationMatch) return 0;

  const amount = Number(durationMatch[1]);
  const unit = durationMatch[2];
  if (!Number.isFinite(amount)) return 0;
  if (["detik", "second"].includes(unit)) return Math.round(amount);
  if (["menit", "minute"].includes(unit)) return Math.round(amount * 60);
  if (["jam", "hour"].includes(unit)) return Math.round(amount * 3600);
  return Math.round(amount * 86400);
}

function formatSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

interface CountdownTimerProps {
  timeLeft: string;
  deadlineAt?: string;
  expired?: boolean;
}

export default function CountdownTimer({
  timeLeft,
  deadlineAt,
  expired = false,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    parseToSeconds(timeLeft),
  );

  useEffect(() => {
    if (expired || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => deadlineAt
        ? Math.max(0, Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000))
        : Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineAt, expired, secondsLeft]);

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
