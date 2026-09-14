import { notFound } from "next/navigation";
import EditKongsiForm from "@/components/umkm/EditKongsiForm";
import { createClient } from "@/utils/supabase/server";
import type {
  FulfillmentMethod,
  KongsiCategory,
} from "@/lib/kongsiData";

export default async function EditKongsiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, category, fulfillment, pickup_location, pickup_maps_url, pickup_hours, delivery_fee, status",
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (error || !data || data.status !== "berlangsung") notFound();

  return (
    <EditKongsiForm
      deal={{
        id: data.id,
        productName: data.product_name,
        description: data.description,
        imageUrl: data.image_url ?? "",
        normalPrice: data.normal_price,
        kongsiPrice: data.kongsi_price,
        currentParticipants: data.current_participants,
        targetParticipants: data.target_participants,
        category: data.category as KongsiCategory,
        fulfillment: data.fulfillment as FulfillmentMethod,
        pickupLocation: data.pickup_location ?? "",
        pickupMapsUrl: data.pickup_maps_url ?? "",
        pickupHours: data.pickup_hours ?? "",
        deliveryFee: data.delivery_fee ?? 0,
      }}
    />
  );
}
