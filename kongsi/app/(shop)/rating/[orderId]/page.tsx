import { notFound } from "next/navigation";
import RatingView from "@/components/customer/RatingView";
import { getCompletedCustomerOrder } from "@/lib/customerOrders";

export default async function RatingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const result = await getCompletedCustomerOrder(orderId);

  if (!result) {
    notFound();
  }
  return <RatingView order={result.order} existingReview={result.review} />;
}
