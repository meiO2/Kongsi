import { createClient } from "@/utils/supabase/server";
import type { GroupDeal } from "./customerMockData";

type CustomerGroupDealRow = {
  id: string;
  product_name: string;
  description: string;
  image_url: string | null;
  normal_price: number;
  kongsi_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  category: string;
  fulfillment: GroupDeal["fulfillment"];
  pickup_location: string | null;
  pickup_hours: string | null;
  delivery_fee: number;
  status: string;
  owner_id: string;
};

export async function getCustomerGroupDealById(
  id: string,
): Promise<GroupDeal | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, category, fulfillment, pickup_location, pickup_hours, delivery_fee, status, owner_id",
    )
    .eq("id", id)
    .eq("status", "berlangsung")
    .maybeSingle();

  if (error || !data) return undefined;

  const deal = data as CustomerGroupDealRow;
  return {
    id: deal.id,
    name: deal.product_name,
    seller: "UMKM lokal",
    sellerId: deal.owner_id,
    normalPrice: deal.normal_price,
    kongsiPrice: deal.kongsi_price,
    currentParticipants: deal.current_participants,
    targetParticipants: deal.target_participants,
    remainingLabel: `Tinggal ${Math.max(0, deal.target_participants - deal.current_participants)} orang lagi!`,
    timeLeft: deal.deadline,
    imageEmoji: "🛍️",
    imageUrl: deal.image_url ?? undefined,
    description: deal.description,
    details: [deal.category],
    fulfillment: deal.fulfillment,
    pickupLocation: deal.pickup_location ?? undefined,
    pickupHours: deal.pickup_hours ?? undefined,
    deliveryFee: deal.delivery_fee,
  };
}
