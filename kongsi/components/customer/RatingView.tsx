"use client";

import { useState } from "react";
import Link from "next/link";
import { StarRatingDisplay, StarRatingInput } from "./StarRating";
import { RATING_LABELS, type Order, type Review } from "@/lib/customerData";

interface RatingViewProps {
  order: Order;
  existingReview?: Review;
}

export default function RatingView({ order, existingReview }: RatingViewProps) {
  const [review, setReview] = useState(existingReview ?? null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setError(null);
    const response = await fetch(`/api/reviews/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(result.error ?? "Ulasan gagal disimpan.");
      setSubmitting(false);
      return;
    }
    setReview({
      id: existingReview?.id ?? `review-${order.id}`,
      sellerId: order.sellerId,
      orderId: order.id,
      customerName: "Kamu",
      rating,
      comment,
    });
    setSubmitted(true);
    setEditing(false);
    setSubmitting(false);
  };

  // Thank-you state right after submitting
  if (submitted && review) {
    return (
      <main className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-4 pb-20 pt-16 text-center sm:px-6">
        <span className="text-4xl" aria-hidden>
          🎉
        </span>
        <h1
          className="text-xl font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Terima kasih atas ulasanmu!
        </h1>
        <p className="text-sm text-[#7A7876]">
          Ulasan kamu membantu UMKM meningkatkan kualitas mereka.
        </p>
        <StarRatingDisplay rating={review.rating} size="md" />
        <p className="text-sm font-semibold text-[#292828]">{order.seller}</p>
        <Link
          href="/customer/orders"
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
        >
          Kembali ke Pesanan
        </Link>
      </main>
    );
  }

  // Already reviewed, not currently editing
  if (review && !editing) {
    return (
      <main className="mx-auto flex w-full max-w-[480px] flex-col gap-5 px-4 pb-20 pt-10 sm:px-6">
        <Link
          href="/customer/orders"
          className="w-fit text-sm font-semibold text-[#3991FA] hover:underline"
        >
          ← Kembali ke Pesanan
        </Link>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-6">
          <p className="text-sm text-[#7A7876]">
            Kamu sudah memberikan ulasan untuk pesanan ini.
          </p>
          <StarRatingDisplay rating={review.rating} size="md" />
          {review.comment && <p className="text-sm text-[#292828]">“{review.comment}”</p>}

          <button
            type="button"
            onClick={() => {
              setRating(review.rating);
              setComment(review.comment);
              setEditing(true);
            }}
            className="mt-2 w-fit rounded-xl border border-[#3991FA]/30 px-4 py-2 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
          >
            Edit Ulasan
          </button>
        </div>
      </main>
    );
  }

  // Empty / editable form
  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-4 pb-20 pt-10 sm:px-6">
      <Link
        href="/customer/orders"
        className="w-fit text-sm font-semibold text-[#3991FA] hover:underline"
      >
        ← Kembali ke Pesanan
      </Link>

      <div>
        <h1
          className="text-xl font-bold text-[#292828] sm:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Bagaimana pengalamanmu?
        </h1>
        <p className="mt-1 text-sm text-[#7A7876]">
          Berikan penilaian untuk pesananmu dari {order.seller}.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1EFEF] text-2xl">
          <span aria-hidden>{order.imageEmoji}</span>
        </div>
        <div>
          <p
            className="text-sm font-semibold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {order.dealName}
          </p>
          <p className="text-xs text-[#7A7876]">{order.seller}</p>
          <p className="text-xs text-[#7A7876]">Pesanan #{order.orderNumber}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-6 text-center">
        <p className="text-sm font-semibold text-[#292828]">Bagaimana kamu menilai UMKM ini?</p>
        <StarRatingInput value={rating} onChange={setRating} />
        <p className="h-5 text-sm font-semibold text-[#3991FA]">
          {rating > 0 ? RATING_LABELS[rating] : ""}
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-[#E4E1DF] bg-white p-5">
        <label htmlFor="rating-comment" className="text-sm font-semibold text-[#292828]">
          Ceritakan pengalamanmu (opsional)
        </label>
        <textarea
          id="rating-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder="Tulis pengalamanmu tentang produk atau pelayanan UMKM ini..."
          className="w-full resize-none rounded-2xl border border-[#E4E1DF] bg-white px-4 py-3 text-sm text-[#292828] placeholder:text-[#B3B0AE] outline-none transition-shadow focus:border-[#3991FA] focus:ring-4 focus:ring-[#3991FA]/15"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Kirim Ulasan"}
      </button>
      {error && <p className="text-sm text-[#E14B4B]">{error}</p>}
    </main>
  );
}
