import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login terlebih dahulu." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const quantity = Number(body.quantity);
  const fulfillment = body.fulfillment;

  if (!body.groupDealId || !Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json(
      { error: "Data pesanan tidak valid." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("join_group_deal", {
    p_group_deal_id: body.groupDealId,
    p_quantity: quantity,
    p_fulfillment: fulfillment,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login terlebih dahulu." },
      { status: 401 },
    );
  }

  const scope = new URL(request.url).searchParams.get("scope");
  const query = supabase
    .from("orders")
    .select(
      "id, order_number, participation_id, group_deal_id, customer_id, owner_id, customer_name, product_name, image_url, quantity, unit_price, target_participants, participants_after, fulfillment, pickup_location, pickup_hours, delivery_fee, total_amount, payment_method, payment_status, status, created_at",
    )
    .order("created_at", { ascending: false });

  const scopedQuery =
    scope === "umkm"
      ? query.eq("owner_id", user.id).eq("payment_status", "paid")
      : query.eq("customer_id", user.id);
  const { data, error } = await scopedQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
