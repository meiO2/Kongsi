import { notFound } from "next/navigation";
import CheckoutView from "@/components/customer/CheckoutView";
import { getDealStatus, getSellerById } from "@/lib/customerMockData";
import { getCustomerGroupDealById } from "@/lib/customerGroupDeals";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getCustomerGroupDealById(id);

  if (!deal || getDealStatus(deal) !== "berlangsung") {
    notFound();
  }

  const seller = getSellerById(deal.sellerId);

  return <CheckoutView deal={deal} seller={seller} />;
}
