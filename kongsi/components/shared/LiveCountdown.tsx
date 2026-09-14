"use client";

import { useEffect, useState } from "react";

function formatCountdown(deadlineAt: string): string {
  const remainingSeconds = Math.max(
    0,
    Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000),
  );
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function LiveCountdown({
  deadlineAt,
  initialLabel,
  expiredLabel = "Waktu habis",
}: {
  deadlineAt: string;
  initialLabel: string;
  expiredLabel?: string;
}) {
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    const update = () => {
      const nextLabel = formatCountdown(deadlineAt);
      setLabel(nextLabel === "00:00:00" ? expiredLabel : nextLabel);
    };
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [deadlineAt, expiredLabel]);

  return <>{label}</>;
}
