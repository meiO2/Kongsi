import { notFound } from "next/navigation";
import KongsiDetailView from "@/components/umkm/KongsiDetailView";
import { createClient } from "@/utils/supabase/server";
import type { KongsiDeal } from "@/lib/kongsiMockData";

export default async function KongsiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, category, fulfillment, pickup_location, pickup_hours, delivery_fee, status",
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error || !data) notFound();

  const deal: KongsiDeal = {
    id: data.id,
    name: data.product_name,
    description: data.description,
    imageEmoji: "🍜",
    imageUrl: data.image_url ?? undefined,
    category: data.category,
    normalPrice: data.normal_price,
    kongsiPrice: data.kongsi_price,
    currentParticipants: data.current_participants,
    targetParticipants: data.target_participants,
    timeLeft: data.deadline,
    status: data.status,
    fulfillment: data.fulfillment,
    pickupLocation: data.pickup_location ?? undefined,
    pickupHours: data.pickup_hours ?? undefined,
    deliveryFee: data.delivery_fee ?? undefined,
  };

  return <KongsiDetailView deal={deal} />;
}
