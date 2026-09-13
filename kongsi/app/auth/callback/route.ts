import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const providerError = searchParams.get("error_description");

  if (providerError) {
    console.error("Supabase auth callback error:", providerError);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(providerError)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Supabase code exchange error:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const destination =
        user?.user_metadata?.accountType === "umkm" ? "/umkm" : next;
      const metadata = user?.user_metadata || {};
      const isUmkm =
        metadata.accountType === "umkm" ||
        metadata.role === "UMKM" ||
        metadata.role?.toLowerCase() === "umkm" ||
        metadata.account_type === "umkm";
      const destination = isUmkm ? "/umkm" : next;
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${destination}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${destination}`);
      } else {
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Kode verifikasi tidak ditemukan atau sudah kedaluwarsa.")}`,
  );
}
