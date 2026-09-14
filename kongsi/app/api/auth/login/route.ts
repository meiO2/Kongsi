import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  const { identifier, password } = await request.json();
  if (typeof identifier !== "string" || typeof password !== "string") return NextResponse.json({ error: "Data login tidak lengkap." }, { status: 400 });
  let email = identifier.trim();
  if (!email.includes("@")) {
    const digits = email.replace(/\D/g, "");
    const normalizedPhone = digits.startsWith("62") ? `0${digits.slice(2)}` : digits;
    const admin = createAdminClient();
    const { data } = await admin.from("users").select("email").eq("phone", normalizedPhone).limit(1).maybeSingle();
    if (!data) return NextResponse.json({ error: "Email/nomor HP atau kata sandi tidak cocok." }, { status: 401 });
    email = data.email;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Login gagal." }, { status: 401 });
  const metadata = data.user.user_metadata ?? {};
  const isUmkm = metadata.accountType === "umkm" || metadata.account_type === "umkm" || String(metadata.role).toLowerCase() === "umkm";
  return NextResponse.json({ destination: isUmkm ? "/umkm" : "/" });
}
