"use client";

import { useState } from "react";
import { StarIcon } from "./icons";

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRatingDisplay({ rating, size = "sm" }: StarRatingDisplayProps) {
  const dimension = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5 text-[#FFCF00]">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= Math.round(rating)} className={dimension} />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered || value;

  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          aria-label={`Beri ${star} bintang`}
          className="text-[#FFCF00] transition-transform hover:scale-110"
        >
          <StarIcon filled={star <= displayValue} className="h-9 w-9" />
        </button>
      ))}
    </div>
  );
}
