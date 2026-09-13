import { notFound } from "next/navigation";
import CheckoutView from "@/components/customer/CheckoutView";
import { getDealById, getDealStatus, getSellerById } from "@/lib/customerMockData";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal || getDealStatus(deal) !== "berlangsung") {
    notFound();
  }

  const seller = getSellerById(deal.sellerId);

  return <CheckoutView deal={deal} seller={seller} />;
}
