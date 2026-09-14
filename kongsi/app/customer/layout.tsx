import { Baloo_2, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { createClient } from "@/utils/supabase/server";

// Same font configuration as app/login/page.tsx, so the Customer
// experience uses the exact same typefaces as the Login & Sign Up page.
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default async function CustomerLayout({ children }: { children: ReactNode }) {
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
  if ((profile?.role ?? metadataRole) === "UMKM") redirect("/umkm");

  return (
    <div
      className={`${baloo.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-body)] text-[#292828]`}
    >
      <CustomerNavbar />
      {children}
    </div>
  );
}
