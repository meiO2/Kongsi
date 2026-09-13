import { notFound } from "next/navigation";
import RatingView from "@/components/customer/RatingView";
import { getOrderById, getReviewForOrder } from "@/lib/customerMockData";

export default async function RatingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  if (order.status !== "selesai") {
    return (
      <main className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-3 px-4 pb-20 pt-16 text-center sm:px-6">
        <h1
          className="text-lg font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Belum bisa memberi rating
        </h1>
        <p className="text-sm text-[#7A7876]">
          Rating hanya tersedia untuk pesanan yang sudah selesai.
        </p>
      </main>
    );
  }

  const existingReview = getReviewForOrder(order.id);

  return <RatingView order={order} existingReview={existingReview} />;
}
