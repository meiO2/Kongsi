import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formatRemainingTime } from "@/lib/deadline";

const ALLOWED_CATEGORIES = [
  "Kuliner",
  "Fashion",
  "Kerajinan",
  "Kebutuhan Rumah",
  "Produk Lokal",
] as const;
const ALLOWED_FULFILLMENT = ["pickup", "delivery", "pickup-delivery"] as const;

export async function GET() {
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

  const { data, error } = await supabase
    .from("group_deals")
    .select(
      "id, product_name, description, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, deadline_at, category, fulfillment, pickup_location, pickup_hours, delivery_fee, status",
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map((deal) => ({ ...deal, deadline: formatRemainingTime(deal.deadline_at) })));
}

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

  const { data: umkmProfile, error: umkmError } = await supabase
    .from("umkm")
    .select("umkm_id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (umkmError) {
    return NextResponse.json(
      { error: `Profil UMKM belum bisa diperiksa: ${umkmError.message}` },
      { status: 500 },
    );
  }

  if (!umkmProfile) {
    return NextResponse.json(
      { error: "Akun ini belum memiliki profil UMKM." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const requiredFields = [
    "productName",
    "description",
    "normalPrice",
    "kongsiPrice",
    "targetParticipants",
    "deadline",
    "category",
    "fulfillment",
  ];

  if (requiredFields.some((field) => !body[field])) {
    return NextResponse.json(
      { error: "Data produk belum lengkap." },
      { status: 400 },
    );
  }

  if (
    !ALLOWED_CATEGORIES.includes(body.category) ||
    !ALLOWED_FULFILLMENT.includes(body.fulfillment)
  ) {
    return NextResponse.json(
      { error: "Kategori atau metode pemenuhan tidak valid." },
      { status: 400 },
    );
  }

  const normalPrice = Number(body.normalPrice);
  const kongsiPrice = Number(body.kongsiPrice);
  const targetParticipants = Number(body.targetParticipants);
  const deliveryFee = body.deliveryFee ? Number(body.deliveryFee) : 0;
  const deadlineAmount = Number(body.deadlineAmount);
  const deadlineMs = body.deadlineUnit === "hari"
    ? deadlineAmount * 24 * 60 * 60 * 1000
    : deadlineAmount * 60 * 60 * 1000;

  if (
    !Number.isFinite(normalPrice) ||
    !Number.isFinite(kongsiPrice) ||
    !Number.isInteger(targetParticipants) ||
    targetParticipants < 1 ||
    kongsiPrice >= normalPrice ||
    (body.deliveryFee && !Number.isFinite(deliveryFee))
    || !Number.isFinite(deadlineAmount)
    || deadlineAmount < 1
  ) {
    return NextResponse.json(
      { error: "Nilai harga atau target tidak valid." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("group_deals")
    .insert({
      owner_id: user.id,
      product_name: body.productName.trim(),
      description: body.description.trim(),
      image_file_name: body.fileName || null,
      image_url: body.imageUrl || null,
      normal_price: normalPrice,
      kongsi_price: kongsiPrice,
      target_participants: targetParticipants,
      deadline: body.deadline.trim(),
      deadline_at: new Date(Date.now() + deadlineMs).toISOString(),
      category: body.category,
      fulfillment: body.fulfillment,
      pickup_location: body.pickupLocation?.trim() || null,
      pickup_maps_url: body.pickupMapsUrl?.trim() || null,
      pickup_hours: body.pickupHours?.trim() || null,
      delivery_fee: deliveryFee,
      status: "berlangsung",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
