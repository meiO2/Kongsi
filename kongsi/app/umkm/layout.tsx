import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import UmkmNavbar from "@/components/umkm/UmkmNavbar";
import { createClient } from "@/utils/supabase/server";

export default async function UmkmLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  const metadataRole = String(
    user.user_metadata?.role ?? user.user_metadata?.accountType ?? "",
  ).toUpperCase();
  if ((profile?.role ?? metadataRole) !== "UMKM") redirect("/");

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#292828]">
      <UmkmNavbar />
      {children}
    </div>
  );
}
