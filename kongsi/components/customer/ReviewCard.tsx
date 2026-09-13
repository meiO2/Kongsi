import type { Review } from "@/lib/customerMockData";
import { StarRatingDisplay } from "./StarRating";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-[#E4E1DF] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <StarRatingDisplay rating={review.rating} />
        <span className="text-sm font-semibold text-[#292828]">{review.customerName}</span>
      </div>
      <p className="text-sm text-[#7A7876]">{review.comment}</p>
    </div>
  );
}
