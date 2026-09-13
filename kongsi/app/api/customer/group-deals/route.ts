import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, category, fulfillment, pickup_location, pickup_hours, delivery_fee, owner_id, status",
    )
    .eq("status", "berlangsung")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    data.map((deal) => ({
      ...deal,
      seller: "UMKM lokal",
      image_emoji: "🍜",
      remaining_label: `Tinggal ${Math.max(0, deal.target_participants - deal.current_participants)} orang lagi!`,
    })),
  );
}
