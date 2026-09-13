import type { Seller } from "@/lib/customerMockData";
import { StarIcon } from "./icons";

interface SellerRatingProps {
  rating: Seller["rating"];
  reviewCount?: number;
  size?: "sm" | "md";
}

export default function SellerRating({ rating, reviewCount, size = "sm" }: SellerRatingProps) {
  const dimension = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "md" ? "text-base" : "text-sm";

  if (rating === null) {
    return (
      <span className={["flex items-center gap-1 font-medium text-[#7A7876]", textSize].join(" ")}>
        <StarIcon className={dimension} />
        Penjual Baru
      </span>
    );
  }

  return (
    <span className={["flex items-center gap-1 font-semibold text-[#292828]", textSize].join(" ")}>
      <StarIcon filled className={[dimension, "text-[#FFCF00]"].join(" ")} />
      {rating.toFixed(1)}
      {reviewCount !== undefined && (
        <span className="font-normal text-[#7A7876]">({reviewCount} ulasan)</span>
      )}
    </span>
  );
}
