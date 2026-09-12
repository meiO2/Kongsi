"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DealCard from "@/components/customer/DealCard";
import CategoryCard from "@/components/customer/CategoryCard";
import {
  ChevronDownIcon,
  LocationIcon,
  SlidersIcon,
} from "@/components/customer/icons";
import { CATEGORIES, type GroupDeal } from "@/lib/customerMockData";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

const SORT_OPTIONS = [
  { value: "terdekat", label: "Terdekat" },
  { value: "harga", label: "Harga terendah" },
  { value: "target", label: "Hampir mencapai target" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface CustomerDealResponse {
  id: string;
  product_name: string;
  description: string;
  image_url: string | null;
  normal_price: number;
  kongsi_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  category: string;
  pickup_location: string | null;
  seller: string;
  image_emoji: string;
  remaining_label: string;
}

export default function CustomerHomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortValue>("terdekat");
  const [deals, setDeals] = useState<GroupDeal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [dealError, setDealError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const response = await fetch("/api/customer/group-deals");
        const result = (await response.json()) as
          | CustomerDealResponse[]
          | { error?: string };
        if (!response.ok)
          throw new Error(
            "error" in result ? result.error : "Kongsi gagal dimuat.",
          );
        if (!Array.isArray(result))
          throw new Error("Format data Kongsi tidak valid.");
        setDeals(
          result.map((deal: CustomerDealResponse) => ({
            id: deal.id,
            name: deal.product_name,
            seller: deal.seller,
            normalPrice: deal.normal_price,
            kongsiPrice: deal.kongsi_price,
            currentParticipants: deal.current_participants,
            targetParticipants: deal.target_participants,
            remainingLabel: deal.remaining_label,
            timeLeft: deal.deadline,
            imageEmoji: deal.image_emoji,
            imageUrl: deal.image_url ?? undefined,
            locationLabel: deal.pickup_location ?? undefined,
            category: deal.category,
          })),
        );
      } catch (error) {
        setDealError(
          error instanceof Error ? error.message : "Kongsi gagal dimuat.",
        );
      } finally {
        setLoadingDeals(false);
      }
    }
    loadDeals();
  }, []);

  // Frontend-only sort over the mock recommended deals — no real
  // backend/filtering logic, just enough to demonstrate the control.
  const sortedDeals = useMemo(() => {
    const filtered = activeCategory
      ? deals.filter((deal) =>
          deal.category?.toLowerCase().includes(activeCategory),
        )
      : deals;
    const sorted = [...filtered];
    if (sort === "harga") {
      return sorted.sort((a, b) => a.kongsiPrice - b.kongsiPrice);
    }
    if (sort === "target") {
      return sorted.sort(
        (a, b) =>
          b.currentParticipants / b.targetParticipants -
          a.currentParticipants / a.targetParticipants,
      );
    }
    return sorted;
  }, [activeCategory, deals, sort]);

  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 px-4 pb-20 pt-8 sm:px-6 sm:gap-16">
        {/* HERO */}
        <section className="overflow-hidden rounded-[28px] border border-[#E4E1DF] bg-gradient-to-br from-white via-white to-[#FFF7DA]">
          <div className="flex flex-col items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 md:flex-row md:gap-12">
            <div className="flex w-full max-w-[360px] shrink-0 items-center justify-center md:max-w-[320px]">
              <HeroIllustration />
            </div>

            <div className="flex w-full flex-col items-center gap-4 text-center md:items-start md:text-left">
              <h1
                className="text-[28px] font-bold leading-tight text-[#292828] sm:text-[34px]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Belanja bareng, lebih hemat!
              </h1>
              <p className="max-w-[420px] text-[15px] text-[#7A7876] sm:text-base">
                Temukan produk lokal favoritmu dan dapatkan harga lebih hemat
                dengan ikut Kongsi.
              </p>
              <Link
                href="#kategori"
                className="mt-1 inline-flex items-center justify-center rounded-2xl bg-[#3991FA] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
              >
                Jelajahi Kongsi
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORY NAVIGATION */}
        <section id="kategori" className="flex flex-col gap-4">
          <h2
            className="text-xl font-bold text-[#292828] sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Jelajahi berdasarkan kategori
          </h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                active={activeCategory === category.id}
                onClick={() =>
                  setActiveCategory((prev) =>
                    prev === category.id ? null : category.id,
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* FILTER & SORT */}
        <section className="flex flex-col gap-3 rounded-2xl border border-[#E4E1DF] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <SlidersIcon className="h-4 w-4 text-[#7A7876]" />
            <span className="mr-1 font-medium text-[#292828]">Filter:</span>
            {["Kategori", "Harga", "Lokasi"].map((filter) => (
              <button
                key={filter}
                type="button"
                className="flex items-center gap-1 rounded-full border border-[#E4E1DF] bg-white px-3 py-1.5 font-medium text-[#292828] transition-colors hover:border-[#3991FA]/40"
              >
                {filter}
                <ChevronDownIcon className="h-3.5 w-3.5 text-[#7A7876]" />
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[#292828]">Urutkan:</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="rounded-full border border-[#E4E1DF] bg-white px-3 py-1.5 text-sm font-medium text-[#292828] outline-none transition-colors focus:border-[#3991FA] focus:ring-4 focus:ring-[#3991FA]/15"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* RECOMMENDED GROUP DEALS */}
        <section className="flex flex-col gap-5">
          <div>
            <h2
              className="text-xl font-bold text-[#292828] sm:text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Rekomendasi untukmu
            </h2>
            <p className="text-sm text-[#7A7876]">
              Group Deal yang mungkin cocok buat kamu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loadingDeals ? (
              <p className="text-sm text-[#7A7876]">Memuat Kongsi UMKM...</p>
            ) : dealError ? (
              <p className="text-sm text-[#E14B4B]">{dealError}</p>
            ) : sortedDeals.length === 0 ? (
              <p className="text-sm text-[#7A7876]">
                Belum ada Kongsi aktif dari UMKM.
              </p>
            ) : (
              sortedDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </section>

        {/* HAMPIR BERHASIL */}
        <section className="flex flex-col gap-5 rounded-[28px] bg-[#FFF7DA]/60 p-5 sm:p-8">
          <div>
            <h2
              className="text-xl font-bold text-[#292828] sm:text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hampir berhasil!
            </h2>
            <p className="text-sm text-[#7A7876]">
              Kongsi ini tinggal beberapa orang lagi untuk mencapai target.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sortedDeals
              .filter(
                (deal) =>
                  deal.currentParticipants >= deal.targetParticipants - 2,
              )
              .map((deal) => (
                <DealCard key={deal.id} deal={deal} highlight />
              ))}
          </div>
        </section>

        {/* KONGSI DI SEKITARMU */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <LocationIcon className="h-5 w-5 text-[#3991FA]" />
            <div>
              <h2
                className="text-xl font-bold text-[#292828] sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Kongsi di sekitarmu
              </h2>
              <p className="text-sm text-[#7A7876]">
                Dukung UMKM lokal sambil mendapatkan harga yang lebih hemat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sortedDeals
              .filter((deal) => deal.locationLabel)
              .map((deal) => (
                <DealCard key={deal.id} deal={deal} variant="nearby" />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 260"
      className="h-auto w-full"
      role="img"
      aria-label="Ilustrasi orang-orang berbelanja bersama"
    >
      <circle cx="160" cy="130" r="120" fill="#FFCF00" opacity="0.12" />
      <circle cx="160" cy="130" r="86" fill="#3991FA" opacity="0.08" />

      {/* Shopping bag */}
      <g transform="translate(96 78)">
        <rect x="0" y="26" width="88" height="80" rx="14" fill="#3991FA" />
        <path
          d="M18 26v-6a26 26 0 0 1 52 0v6"
          fill="none"
          stroke="#292828"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect
          x="16"
          y="52"
          width="56"
          height="8"
          rx="4"
          fill="white"
          opacity="0.85"
        />
        <rect x="16" y="70" width="36" height="8" rx="4" fill="#FFCF00" />
      </g>

      {/* Two people */}
      <g transform="translate(48 150)">
        <circle cx="18" cy="10" r="14" fill="#292828" />
        <path d="M0 62c0-18 8-30 18-30s18 12 18 30" fill="#292828" />
      </g>
      <g transform="translate(214 150)">
        <circle cx="18" cy="10" r="14" fill="#FFCF00" />
        <path d="M0 62c0-18 8-30 18-30s18 12 18 30" fill="#FFCF00" />
      </g>

      {/* Little heart accents */}
      <path
        d="M252 92c-4-6-13-4-13 3 0 6 13 15 13 15s13-9 13-15c0-7-9-9-13-3Z"
        fill="#3991FA"
      />
    </svg>
  );
}
