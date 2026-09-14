import { notFound } from "next/navigation";
import CheckoutView from "@/components/customer/CheckoutView";
import { getDealStatus } from "@/lib/customerData";
import {
  getCustomerGroupDealById,
  getCustomerSellerByOwner,
} from "@/lib/customerGroupDeals";

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

  const seller = await getCustomerSellerByOwner(deal.sellerId);

  return <CheckoutView deal={deal} seller={seller} />;
}
