import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const body = await request.json();
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 1000) : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating harus bernilai 1 sampai 5." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const { data: order, error: orderError } = await supabase.from("orders")
    .select("id, group_deal_id, owner_id, customer_name")
    .eq("id", orderId).eq("customer_id", user.id).eq("status", "selesai")
    .limit(1).maybeSingle();
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: "Pesanan belum selesai atau tidak ditemukan." }, { status: 404 });

  const { error } = await supabase.from("reviews").upsert({
    order_id: order.id,
    group_deal_id: order.group_deal_id,
    customer_id: user.id,
    owner_id: order.owner_id,
    customer_name: order.customer_name,
    rating,
    comment,
    updated_at: new Date().toISOString(),
  }, { onConflict: "order_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, rating, comment });
}
