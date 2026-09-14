import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

const ORDER_FIELDS =
  "id, order_number, group_deal_id, customer_id, owner_id, customer_name, product_name, image_url, quantity, unit_price, fulfillment, pickup_location, pickup_hours, delivery_address, delivery_fee, total_amount, payment_method, payment_status, status, target_participants, participants_after, created_at";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const umkmScope = new URL(request.url).searchParams.get("scope") === "umkm";
  let query = supabase.from("orders").select(ORDER_FIELDS)
    .eq(umkmScope ? "owner_id" : "customer_id", user.id).order("created_at", { ascending: false });
  if (umkmScope) query = query.eq("payment_status", "paid");
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (umkmScope || !data?.length) return NextResponse.json(data ?? []);

  const ownerIds = [...new Set(data.map((order) => order.owner_id))];
  const orderIds = data.map((order) => order.id);
  const admin = createAdminClient();
  const [{ data: sellers }, { data: reviews }] = await Promise.all([
    admin.from("umkm").select("owner_id, business_name").in("owner_id", ownerIds),
    admin.from("reviews").select("order_id").in("order_id", orderIds),
  ]);
  const sellerNames = new Map((sellers ?? []).map((seller) => [seller.owner_id, seller.business_name]));
  const reviewedOrders = new Set((reviews ?? []).map((review) => review.order_id));
  return NextResponse.json(data.map((order) => ({
    ...order,
    seller_name: sellerNames.get(order.owner_id) ?? "UMKM lokal",
    has_review: reviewedOrders.has(order.id),
  })));
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus login terlebih dahulu." },
        { status: 401 },
      );
    }
    const body = await request.json();
    const groupDealId = typeof body.groupDealId === "string" ? body.groupDealId : "";
    const quantity = Number(body.quantity);
    const fulfillment = body.fulfillment;
    const deliveryAddress =
      typeof body.deliveryAddress === "string" ? body.deliveryAddress.trim() : "";
    if (!groupDealId || !Number.isInteger(quantity) || quantity < 1 || !["pickup", "delivery"].includes(fulfillment)) {
      return NextResponse.json({ error: "Data pesanan tidak valid." }, { status: 400 });
    }
    if (fulfillment === "delivery" && !deliveryAddress) {
      return NextResponse.json(
        { error: "Pilih alamat utama di profil sebelum membuat pesanan delivery." },
        { status: 400 },
      );
    }
    const { data, error } = await supabase.rpc("join_group_deal", {
      p_group_deal_id: groupDealId,
      p_quantity: quantity,
      p_fulfillment: fulfillment,
      p_delivery_address: deliveryAddress || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Data pesanan tidak dapat dibaca." }, { status: 400 });
  }
}
