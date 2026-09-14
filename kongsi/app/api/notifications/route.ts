import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const { data, error } = await supabase.from("notifications")
    .select("id, type, title, description, is_read, created_at")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const { error } = await supabase.from("notifications")
    .update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
