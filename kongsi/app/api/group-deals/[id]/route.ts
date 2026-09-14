import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_CATEGORIES = [
  "Kuliner",
  "Fashion",
  "Kerajinan",
  "Kebutuhan Rumah",
  "Produk Lokal",
] as const;
const ALLOWED_FULFILLMENT = ["pickup", "delivery", "pickup-delivery"] as const;

function durationToHours(value: string): number {
  const duration = value.match(/(\d+(?:\.\d+)?)\s*(jam|hari)/i);
  if (duration) {
    const amount = Number(duration[1]);
    return duration[2].toLowerCase() === "hari" ? amount * 24 : amount;
  }
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) + Number(minutes) / 60;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login terlebih dahulu." },
      { status: 401 },
    );
  }

  const { data: deal, error: findError } = await supabase
    .from("group_deals")
    .select("deadline, deadline_at, status, current_participants")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!deal) return NextResponse.json({ error: "Kongsi tidak ditemukan." }, { status: 404 });
  if (deal.status !== "berlangsung") {
    return NextResponse.json(
      { error: "Hanya Kongsi yang sedang berlangsung yang dapat diubah." },
      { status: 400 },
    );
  }

  if (body.extendHours !== undefined) {
    const hours = Number(body.extendHours);
    if (![1, 3, 24].includes(hours)) {
      return NextResponse.json({ error: "Durasi tambahan tidak valid." }, { status: 400 });
    }
    const currentHours = Math.max(
      0,
      (new Date(deal.deadline_at).getTime() - Date.now()) / 3_600_000,
    ) || durationToHours(deal.deadline);
    if (!Number.isFinite(currentHours)) {
      return NextResponse.json(
        { error: "Format batas waktu di database tidak valid." },
        { status: 500 },
      );
    }
    const totalHours = currentHours + hours;
    const deadline = `${totalHours} jam`;
    const deadlineAt = new Date(Date.now() + totalHours * 3_600_000).toISOString();
    const { error } = await supabase
      .from("group_deals")
      .update({ deadline, deadline_at: deadlineAt })
      .eq("id", id)
      .eq("owner_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ deadline, deadlineAt, totalHours });
  }

  const requiredFields = [
    "productName",
    "description",
    "normalPrice",
    "kongsiPrice",
    "targetParticipants",
    "category",
    "fulfillment",
  ];
  if (requiredFields.some((field) => body[field] === undefined || body[field] === "")) {
    return NextResponse.json({ error: "Data produk belum lengkap." }, { status: 400 });
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
  const needsPickup = body.fulfillment === "pickup" || body.fulfillment === "pickup-delivery";
  const needsDelivery = body.fulfillment === "delivery" || body.fulfillment === "pickup-delivery";
  if (
    !Number.isFinite(normalPrice) || normalPrice < 1000 ||
    !Number.isFinite(kongsiPrice) || kongsiPrice < 1000 ||
    kongsiPrice >= normalPrice ||
    !Number.isInteger(targetParticipants) ||
    targetParticipants < deal.current_participants ||
    targetParticipants < 1 ||
    !Number.isFinite(deliveryFee) || deliveryFee < 0 ||
    (needsPickup && !body.pickupLocation?.trim()) ||
    (needsPickup && !body.pickupHours?.trim()) ||
    (needsDelivery && body.deliveryFee === "")
  ) {
    return NextResponse.json(
      { error: `Nilai tidak valid. Target minimal ${deal.current_participants} pembeli.` },
      { status: 400 },
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("group_deals")
    .update({
      product_name: body.productName.trim(),
      description: body.description.trim(),
      image_file_name: body.fileName?.trim() || null,
      image_url: body.imageUrl?.trim() || null,
      normal_price: normalPrice,
      kongsi_price: kongsiPrice,
      target_participants: targetParticipants,
      category: body.category,
      fulfillment: body.fulfillment,
      pickup_location: needsPickup ? body.pickupLocation.trim() : null,
      pickup_maps_url: needsPickup ? body.pickupMapsUrl?.trim() || null : null,
      pickup_hours: needsPickup ? body.pickupHours.trim() : null,
      delivery_fee: needsDelivery ? deliveryFee : 0,
    })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id")
    .maybeSingle();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: "Kongsi gagal diperbarui." }, { status: 404 });
  return NextResponse.json({ id: updated.id });
}
