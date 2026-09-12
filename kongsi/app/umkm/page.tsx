"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import OverviewCard from "@/components/umkm/OverviewCard";
import ActiveKongsiCard from "@/components/umkm/ActiveKongsiCard";
import SalesChart from "@/components/umkm/SalesChart";
import MobileCreateKongsiButton from "@/components/umkm/MobileCreateKongsiButton";
import { PlusIcon } from "@/components/umkm/icons";
import type {
  ActiveKongsi,
  OverviewMetric,
  SalesDataPoint,
} from "@/lib/umkmMockData";

interface DashboardDeal {
  id: string;
  product_name: string;
  image_url: string | null;
  normal_price: number;
  kongsi_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  status: "berlangsung" | "sukses" | "selesai" | "tidak-berhasil";
}

const EMPTY_SALES: SalesDataPoint[] = [
  { label: "Sen", value: 0 },
  { label: "Sel", value: 0 },
  { label: "Rab", value: 0 },
  { label: "Kam", value: 0 },
  { label: "Jum", value: 0 },
  { label: "Sab", value: 0 },
  { label: "Min", value: 0 },
];

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;
const supabase = createClient();

export default function UmkmDashboardPage() {
  const [deals, setDeals] = useState<DashboardDeal[]>([]);
  const [businessName, setBusinessName] = useState("UMKM");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/group-deals");
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error ?? "Dashboard gagal dimuat.");
        setDeals(result);

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        setBusinessName(
          user?.user_metadata?.businessName ||
            user?.user_metadata?.name ||
            user?.email ||
            "UMKM",
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Dashboard gagal dimuat.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const activeDeals = deals.filter((deal) => deal.status === "berlangsung");
  const successfulDeals = deals.filter(
    (deal) => deal.status === "sukses",
  ).length;
  const overviewMetrics: OverviewMetric[] = [
    {
      id: "kongsi-aktif",
      label: "Kongsi Aktif",
      value: String(activeDeals.length),
      supportingText: "Dari backend",
      icon: "users",
    },
    {
      id: "pesanan",
      label: "Pesanan",
      value: "0",
      supportingText: "Belum ada tabel pesanan",
      icon: "bag",
    },
    {
      id: "penjualan",
      label: "Penjualan",
      value: formatRupiah(0),
      supportingText: "Belum ada transaksi",
      icon: "money",
    },
    {
      id: "pembeli",
      label: "Pembeli",
      value: String(
        deals.reduce((total, deal) => total + deal.current_participants, 0),
      ),
      supportingText: "Total peserta Kongsi",
      icon: "buyers",
    },
  ];
  const activeKongsi: ActiveKongsi[] = activeDeals.map((deal) => ({
    id: deal.id,
    name: deal.product_name,
    imageEmoji: "🍜",
    imageUrl: deal.image_url ?? undefined,
    normalPrice: deal.normal_price,
    kongsiPrice: deal.kongsi_price,
    currentParticipants: deal.current_participants,
    targetParticipants: deal.target_participants,
    remainingLabel: `Tinggal ${Math.max(0, deal.target_participants - deal.current_participants)} pembeli lagi!`,
    timeLeft: deal.deadline,
  }));

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pb-24 pt-8 sm:px-6 sm:pb-16">
      {/* PAGE HEADER */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#292828] sm:text-[28px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Selamat datang kembali, {businessName}! 👋
          </h1>
          <p className="mt-1 text-[15px] text-[#7A7876]">
            Pantau Kongsi dan pesanan tokomu hari ini.
          </p>
        </div>

        <Link
          href="/umkm/kongsi/baru"
          className="hidden items-center justify-center gap-2 rounded-2xl bg-[#3991FA] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0] sm:inline-flex"
        >
          <PlusIcon className="h-4.5 w-4.5" />
          Buat Kongsi
        </Link>
      </section>

      {/* RINGKASAN / OVERVIEW */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <OverviewCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* MAIN CONTENT: 2-column on large screens */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* KONGSI YANG SEDANG BERLANGSUNG */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-bold text-[#292828] sm:text-xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Kongsi yang Sedang Berlangsung
              </h2>
              <Link
                href="/umkm/kongsi"
                className="text-sm font-semibold text-[#3991FA] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeKongsi.map((kongsi) => (
                <ActiveKongsiCard key={kongsi.id} kongsi={kongsi} />
              ))}
              {!loading && activeKongsi.length === 0 && (
                <p className="rounded-2xl border border-dashed border-[#E4E1DF] p-6 text-sm text-[#7A7876]">
                  Belum ada Kongsi kuliner aktif. Buat Kongsi pertama kamu.
                </p>
              )}
              {loading && (
                <p className="text-sm text-[#7A7876]">Memuat data backend...</p>
              )}
              {error && <p className="text-sm text-[#E14B4B]">{error}</p>}
            </div>
          </section>

          {/* PENJUALAN */}
          <section className="flex flex-col gap-4 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
            <h2
              className="text-lg font-bold text-[#292828] sm:text-xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Penjualan
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <SalesStat label="Penjualan Hari Ini" value={formatRupiah(0)} />
              <SalesStat label="Penjualan Bulan Ini" value={formatRupiah(0)} />
              <SalesStat
                label="Kongsi Berhasil"
                value={String(successfulDeals)}
              />
              <SalesStat
                label="Total Pembeli"
                value={String(
                  deals.reduce(
                    (total, deal) => total + deal.current_participants,
                    0,
                  ),
                )}
              />
            </div>

            <div className="mt-2 border-t border-[#F1EFEF] pt-4">
              <p className="mb-2 text-sm font-medium text-[#7A7876]">
                Penjualan 7 hari terakhir
              </p>
              <SalesChart data={EMPTY_SALES} />
            </div>
          </section>
        </div>

        {/* PERLU TINDAKAN */}
        <section className="flex h-fit flex-col gap-4 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
          <h2
            className="text-lg font-bold text-[#292828] sm:text-xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Perlu Tindakan
          </h2>

          <div className="flex flex-col gap-3">
            <p className="rounded-xl border border-dashed border-[#E4E1DF] p-4 text-sm text-[#7A7876]">
              Pesanan dan notifikasi tindakan akan muncul setelah tabel pesanan
              terhubung.
            </p>
          </div>
        </section>
      </div>

      <MobileCreateKongsiButton />
    </main>
  );
}

function SalesStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#7A7876]">{label}</p>
      <p
        className="mt-0.5 text-[17px] font-bold text-[#292828] sm:text-lg"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
    </div>
  );
}
