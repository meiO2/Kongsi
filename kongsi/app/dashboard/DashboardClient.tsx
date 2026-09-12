"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface DashboardClientProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      phone?: string;
      accountType?: "customer" | "umkm";
      businessName?: string;
      businessCategory?: string;
      businessAddress?: string;
    };
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const metadata = user.user_metadata || {};
  const isUmkm = metadata.accountType === "umkm";

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F1EFEF] p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Kongsi!"
              width={110}
              height={50}
              className="h-auto w-24"
              priority
            />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl border border-[#E4E1DF] px-4 py-2 text-sm font-semibold text-[#7A7876] transition-colors hover:border-[#E14B4B] hover:text-[#E14B4B] disabled:opacity-50"
          >
            {isLoggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4E1DF] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#292828]">
                  Halo, {metadata.name || user.email || "Pengguna Kongsi"}! 👋
                </h1>
              </div>
              <p className="mt-1 text-sm text-[#7A7876]">
                Selamat datang di sistem Kongsi!
              </p>
            </div>
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                isUmkm
                  ? "bg-[#3991FA]/10 text-[#3991FA]"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isUmkm ? "Mitra UMKM" : "Pelanggan"}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-base font-semibold text-[#292828]">
              Informasi Akun
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-2xl bg-[#F8F7F6] p-4">
                <span className="text-xs font-medium text-[#7A7876]">
                  Email
                </span>
                <p className="mt-1 font-medium text-[#292828]">
                  {user.email || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F7F6] p-4">
                <span className="text-xs font-medium text-[#7A7876]">
                  Nomor HP
                </span>
                <p className="mt-1 font-medium text-[#292828]">
                  {metadata.phone || "-"}
                </p>
              </div>
            </div>

            {isUmkm && (
              <div className="mt-6 rounded-2xl border border-dashed border-[#3991FA]/30 bg-[#3991FA]/[0.04] p-5">
                <h3 className="text-sm font-semibold text-[#3991FA]">
                  Detail Usaha UMKM
                </h3>
                <div className="mt-3 space-y-2 text-sm text-[#292828]">
                  <p>
                    <strong className="font-medium text-[#7A7876]">
                      Nama Usaha:
                    </strong>{" "}
                    {metadata.businessName || "-"}
                  </p>
                  <p>
                    <strong className="font-medium text-[#7A7876]">
                      Kategori Usaha:
                    </strong>{" "}
                    {metadata.businessCategory || "-"}
                  </p>
                  <p>
                    <strong className="font-medium text-[#7A7876]">
                      Alamat Usaha:
                    </strong>{" "}
                    {metadata.businessAddress || "-"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
