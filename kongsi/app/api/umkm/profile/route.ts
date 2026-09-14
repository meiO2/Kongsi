import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const { data, error } = await supabase.from("umkm")
    .select("business_name, category, contact, description, location, logo_url, verification_status, verification_document_url")
    .eq("owner_id", user.id).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Profil UMKM tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ...data, name: user.user_metadata?.name ?? "", email: user.email ?? "" });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const body = await request.json();
  const profile = {
    business_name: String(body.businessName ?? "").trim(),
    category: String(body.category ?? "").trim(),
    contact: String(body.contact ?? "").trim(),
    description: String(body.description ?? "").trim(),
    location: String(body.location ?? "").trim(),
    verification_document_url: String(body.verificationDocumentUrl ?? "").trim() || null,
  };
  if (!profile.business_name || !profile.category || !profile.location) return NextResponse.json({ error: "Nama, kategori, dan alamat usaha wajib diisi." }, { status: 400 });
  const { error } = await supabase.from("umkm").update(profile).eq("owner_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.auth.updateUser({ data: { businessName: profile.business_name, business_name: profile.business_name, businessCategory: profile.category, business_category: profile.category, businessAddress: profile.location, business_address: profile.location, phone: profile.contact, verificationDocumentUrl: profile.verification_document_url, verification_document_url: profile.verification_document_url } });
  return NextResponse.json({ success: true });
}
