"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KongsiCard from "@/components/umkm/KongsiCard";
import { PlusIcon } from "@/components/umkm/icons";
import {
  KONGSI_FILTERS,
  type FulfillmentMethod,
  type KongsiCategory,
  type KongsiDeal,
  type KongsiStatus,
} from "@/lib/kongsiMockData";

interface GroupDealResponse {
  id: string;
  product_name: string;
  description: string;
  image_url: string | null;
  normal_price: number;
  kongsi_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  category: KongsiCategory;
  fulfillment: FulfillmentMethod;
  pickup_location: string | null;
  pickup_hours: string | null;
  delivery_fee: number | null;
  status: KongsiStatus;
}

function mapDeal(deal: GroupDealResponse): KongsiDeal {
  return {
    id: deal.id,
    name: deal.product_name,
    description: deal.description,
    imageUrl: deal.image_url ?? undefined,
    imageEmoji: "📦",
    category: deal.category,
    normalPrice: deal.normal_price,
    kongsiPrice: deal.kongsi_price,
    currentParticipants: deal.current_participants,
    targetParticipants: deal.target_participants,
    timeLeft: deal.deadline,
    status: deal.status,
    fulfillment: deal.fulfillment,
    pickupLocation: deal.pickup_location ?? undefined,
    pickupHours: deal.pickup_hours ?? undefined,
    deliveryFee: deal.delivery_fee ?? undefined,
  };
}

export default function KongsiListPage() {
  const [filter, setFilter] = useState<KongsiStatus | "semua">("semua");
  const [deals, setDeals] = useState<KongsiDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const response = await fetch("/api/group-deals");
        const result = (await response.json()) as
          | GroupDealResponse[]
          | { error?: string };
        if (!response.ok) {
          setError(
            "error" in result
              ? (result.error ?? "Kongsi gagal dimuat.")
              : "Kongsi gagal dimuat.",
          );
          return;
        }
        setDeals((result as GroupDealResponse[]).map(mapDeal));
      } catch {
        setError("Tidak dapat terhubung ke backend.");
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  const filteredDeals =
    filter === "semua" ? deals : deals.filter((deal) => deal.status === filter);

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 pb-16 pt-8 sm:px-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#292828] sm:text-[28px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kongsi
          </h1>
          <p className="mt-1 text-[15px] text-[#7A7876]">
            Kelola semua Group Deal tokomu.
          </p>
        </div>

        <Link
          href="/umkm/kongsi/baru"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3991FA] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0]"
        >
          <PlusIcon className="h-4.5 w-4.5" />
          Buat Kongsi
        </Link>
      </section>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {KONGSI_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={[
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === item.value
                ? "border-[#3991FA] bg-[#3991FA]/[0.06] text-[#3991FA]"
                : "border-[#E4E1DF] bg-white text-[#292828] hover:border-[#3991FA]/40",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
          <p className="text-sm text-[#7A7876]">Memuat Kongsi...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#E14B4B]/30 bg-[#E14B4B]/10 py-14 text-center">
          <p className="text-sm text-[#E14B4B]">{error}</p>
        </div>
      ) : filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDeals.map((deal) => (
            <KongsiCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E4E1DF] py-14 text-center">
          <p className="text-sm text-[#7A7876]">
            Belum ada Kongsi di kategori ini.
          </p>
        </div>
      )}
    </main>
  );
}
