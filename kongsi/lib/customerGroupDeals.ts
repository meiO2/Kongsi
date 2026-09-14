import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { formatRemainingTime } from "./deadline";
import type { GroupDeal, Review, Seller } from "./customerData";

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
  deadline_at: string;
  category: string;
  fulfillment: GroupDeal["fulfillment"];
  pickup_location: string | null;
  pickup_hours: string | null;
  delivery_fee: number;
  status: string;
  owner_id: string;
};

export async function getCustomerSellerByOwner(
  ownerId: string,
): Promise<Seller | undefined> {
  const supabase = createAdminClient();
  const [{ data: profile, error }, { data: reviews }] = await Promise.all([
    supabase.from("umkm").select("owner_id, business_name, category, description, location").eq("owner_id", ownerId).limit(1).maybeSingle(),
    supabase.from("reviews").select("rating").eq("owner_id", ownerId),
  ]);
  if (error || !profile) return undefined;
  const ratings = (reviews ?? []).map((review) => Number(review.rating));
  return {
    id: profile.owner_id,
    name: profile.business_name,
    category: profile.category ?? "Produk Lokal",
    avatarEmoji: "🏪",
    rating: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null,
    reviewCount: ratings.length,
    description: profile.description ?? "",
    address: profile.location ?? "",
  };
}

export async function getCustomerSellerReviews(ownerId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews")
    .select("id, order_id, customer_name, rating, comment")
    .eq("owner_id", ownerId).order("created_at", { ascending: false }).limit(20);
  return (data ?? []).map((review) => ({
    id: review.id,
    sellerId: ownerId,
    orderId: review.order_id,
    customerName: review.customer_name,
    rating: review.rating,
    comment: review.comment,
  }));
}

export async function getCustomerGroupDealById(
  id: string,
): Promise<GroupDeal | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, deadline_at, category, fulfillment, pickup_location, pickup_hours, delivery_fee, status, owner_id",
    )
    .eq("id", id)
    .eq("status", "berlangsung")
    .gt("deadline_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return undefined;

  const deal = data as CustomerGroupDealRow;
  const seller = await getCustomerSellerByOwner(deal.owner_id);
  return {
    id: deal.id,
    name: deal.product_name,
    seller: seller?.name ?? "UMKM lokal",
    sellerId: deal.owner_id,
    normalPrice: deal.normal_price,
    kongsiPrice: deal.kongsi_price,
    currentParticipants: deal.current_participants,
    targetParticipants: deal.target_participants,
    remainingLabel: `Tinggal ${Math.max(0, deal.target_participants - deal.current_participants)} orang lagi!`,
    timeLeft: formatRemainingTime(deal.deadline_at),
    deadlineAt: deal.deadline_at,
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
