import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { formatRemainingTime } from "@/lib/deadline";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, deadline_at, category, fulfillment, pickup_location, pickup_hours, delivery_fee, owner_id, status",
    )
    .eq("status", "berlangsung")
    .gt("deadline_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ownerIds = [...new Set(data.map((deal) => deal.owner_id))];
  const admin = createAdminClient();
  const [{ data: profiles }, { data: reviews }] = await Promise.all([
    admin.from("umkm").select("owner_id, business_name").in("owner_id", ownerIds),
    admin.from("reviews").select("owner_id, rating").in("owner_id", ownerIds),
  ]);
  const names = new Map((profiles ?? []).map((profile) => [profile.owner_id, profile.business_name]));

  return NextResponse.json(
    data.map((deal) => ({
      ...deal,
      deadline: formatRemainingTime(deal.deadline_at),
      seller: names.get(deal.owner_id) ?? "UMKM lokal",
      seller_rating: (() => {
        const values = (reviews ?? []).filter((review) => review.owner_id === deal.owner_id).map((review) => Number(review.rating));
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
      })(),
      review_count: (reviews ?? []).filter((review) => review.owner_id === deal.owner_id).length,
      image_emoji: "🛍️",
      remaining_label: `Tinggal ${Math.max(0, deal.target_participants - deal.current_participants)} orang lagi!`,
    })),
  );
}
