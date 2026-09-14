import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function getUser(requestClient: Awaited<ReturnType<typeof createClient>>) {
  return (await requestClient.auth.getUser()).data.user;
}

export async function GET() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const [{ data: profile }, { data: addresses, error }] = await Promise.all([
    supabase.from("users").select("name, phone, avatar_url").eq("user_id", user.id).limit(1).maybeSingle(),
    supabase.from("user_addresses").select("id, label, detail, maps_url, is_primary").eq("user_id", user.id).order("is_primary", { ascending: false }).order("created_at"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ name: profile?.name ?? user.user_metadata?.name ?? "Pengguna Kongsi", phone: profile?.phone ?? user.user_metadata?.phone ?? "", email: user.email ?? "", avatarUrl: profile?.avatar_url ?? null, addresses: addresses ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const body = await request.json();
  const label = String(body.label ?? "").trim();
  const detail = String(body.detail ?? "").trim();
  if (!label || !detail) return NextResponse.json({ error: "Nama dan detail alamat wajib diisi." }, { status: 400 });
  const { count } = await supabase.from("user_addresses").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const { data, error } = await supabase.from("user_addresses").insert({ user_id: user.id, label, detail, maps_url: body.mapsUrl || null, is_primary: (count ?? 0) === 0 }).select("id, label, detail, maps_url, is_primary").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const { addressId } = await request.json();
  if (typeof addressId !== "string" || !addressId) {
    return NextResponse.json({ error: "Alamat tidak valid." }, { status: 400 });
  }
  const { error } = await supabase.rpc("set_primary_address", {
    p_address_id: addressId,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
