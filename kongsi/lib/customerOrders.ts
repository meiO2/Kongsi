import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { Order, Review } from "./customerData";

export async function getCompletedCustomerOrder(orderId: string): Promise<{
  order: Order;
  review?: Review;
} | undefined> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return undefined;

  const { data, error } = await supabase.from("orders")
    .select("id, order_number, group_deal_id, owner_id, product_name, image_url, quantity, unit_price, target_participants, participants_after, fulfillment, pickup_location, pickup_hours, delivery_fee, status")
    .eq("id", orderId).eq("customer_id", user.id).eq("status", "selesai")
    .limit(1).maybeSingle();
  if (error || !data) return undefined;

  const admin = createAdminClient();
  const [{ data: seller }, { data: reviewRow }] = await Promise.all([
    admin.from("umkm").select("business_name").eq("owner_id", data.owner_id).limit(1).maybeSingle(),
    admin.from("reviews").select("id, customer_name, rating, comment").eq("order_id", data.id).limit(1).maybeSingle(),
  ]);
  const sellerName = seller?.business_name ?? "UMKM lokal";
  return {
    order: {
      id: data.id,
      orderNumber: data.order_number,
      dealId: data.group_deal_id,
      sellerId: data.owner_id,
      dealName: data.product_name,
      seller: sellerName,
      currentParticipants: Number(data.participants_after ?? 0),
      targetParticipants: Number(data.target_participants ?? 1),
      status: "selesai",
      statusLabel: "Selesai",
      helperLabel: "Pesanan sudah diterima",
      imageEmoji: "🛍️",
      imageUrl: data.image_url ?? undefined,
      hasReview: Boolean(reviewRow),
      quantity: data.quantity,
      unitPrice: data.unit_price,
      fulfillment: data.fulfillment,
      pickupLocation: data.pickup_location ?? undefined,
      pickupHours: data.pickup_hours ?? undefined,
      deliveryFee: data.delivery_fee ?? undefined,
    },
    review: reviewRow ? {
      id: reviewRow.id,
      sellerId: data.owner_id,
      orderId: data.id,
      customerName: reviewRow.customer_name,
      rating: reviewRow.rating,
      comment: reviewRow.comment,
    } : undefined,
  };
}
