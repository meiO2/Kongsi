"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import KongsiProgress from "./KongsiProgress";
import KongsiStatusBadge from "./KongsiStatusBadge";
import ActionButton from "./ActionButton";
import ExtendTimeModal from "./ExtendTimeModal";
import { formatRupiah, type KongsiDeal } from "@/lib/kongsiMockData";

function parseHours(timeLeft: string): number {
  const [hours = "0", minutes = "0"] = timeLeft.split(":");
  return Number(hours) + Number(minutes) / 60;
}

function formatHours(totalHours: number): string {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export default function KongsiDetailView({ deal }: { deal: KongsiDeal }) {
  const [currentParticipants] = useState(deal.currentParticipants);
  const [hoursLeft, setHoursLeft] = useState(() => parseHours(deal.timeLeft));
  const [modalOpen, setModalOpen] = useState(false);

  const timeLeft = useMemo(() => formatHours(hoursLeft), [hoursLeft]);
  const remaining = deal.targetParticipants - currentParticipants;
  const isAlmostThere = deal.status === "berlangsung" && remaining <= 2 && remaining > 0;

  const fulfillmentLabel =
    deal.fulfillment === "pickup"
      ? "Pickup"
      : deal.fulfillment === "delivery"
        ? "Delivery"
        : "Pickup & Delivery";

  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <Link href="/umkm/kongsi" className="w-fit text-sm font-semibold text-[#3991FA] hover:underline">
        ← Kembali ke Kongsi
      </Link>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F1EFEF] text-5xl">
            <span aria-hidden>{deal.imageEmoji}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="text-xl font-bold text-[#292828] sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {deal.name}
              </h1>
              <KongsiStatusBadge status={deal.status} />
            </div>
            <p className="mt-1.5 text-sm text-[#7A7876]">{deal.description}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-sm text-[#7A7876] line-through">
                {formatRupiah(deal.normalPrice)}
              </span>
              <span
                className="text-xl font-bold text-[#3991FA]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {formatRupiah(deal.kongsiPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Status-specific banner */}
        {deal.status === "sukses" && (
          <div className="rounded-2xl bg-[#1FA971]/10 p-5 text-center">
            <p className="text-lg font-bold text-[#1FA971]" style={{ fontFamily: "var(--font-heading)" }}>
              🎉 Target Tercapai!
            </p>
            <p className="mt-1 text-sm text-[#292828]">
              {currentParticipants}/{deal.targetParticipants} pembeli — pesanan sudah bisa diproses.
            </p>
            <Link
              href="/umkm/pesanan"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#1FA971] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#188A5D]"
            >
              Lihat Pesanan
            </Link>
          </div>
        )}

        {deal.status === "tidak-berhasil" && (
          <div className="rounded-2xl bg-[#E14B4B]/10 p-5 text-center">
            <p className="text-lg font-bold text-[#E14B4B]" style={{ fontFamily: "var(--font-heading)" }}>
              Waktu Habis
            </p>
            <p className="mt-1 text-sm text-[#292828]">
              {currentParticipants}/{deal.targetParticipants} pembeli — target tidak tercapai.
            </p>
            <p className="mt-3 text-xs text-[#7A7876]">
              Pesanan terkait telah dibatalkan dan dana akan dikembalikan ke pembeli.
            </p>
          </div>
        )}

        {deal.status === "selesai" && (
          <div className="rounded-2xl bg-[#7A7876]/10 p-5 text-center">
            <p className="text-lg font-bold text-[#292828]" style={{ fontFamily: "var(--font-heading)" }}>
              Kongsi Selesai
            </p>
            <p className="mt-1 text-sm text-[#7A7876]">
              Semua pesanan dari Kongsi ini telah selesai diproses.
            </p>
          </div>
        )}

        {/* Progress — only meaningful while still running */}
        {deal.status === "berlangsung" && (
          <div className="flex flex-col gap-3 rounded-2xl bg-[#F7F7F6] p-5">
            <KongsiProgress current={currentParticipants} target={deal.targetParticipants} timeLeft={timeLeft} size="lg" />

            {isAlmostThere && (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#FFCF00]/20 px-3 py-1.5 text-sm font-semibold text-[#7A6300]">
                🔥 Tinggal {remaining} pembeli lagi!
              </span>
            )}

            {isAlmostThere && (
              <ActionButton variant="outline" onClick={() => setModalOpen(true)} className="w-fit">
                Tambah Waktu
              </ActionButton>
            )}
          </div>
        )}

        {/* Detail info grid */}
        <div className="grid grid-cols-1 gap-4 border-t border-[#F1EFEF] pt-5 sm:grid-cols-2">
          <DetailRow label="Target Pembeli" value={`${deal.targetParticipants} orang`} />
          <DetailRow label="Pembeli Saat Ini" value={`${currentParticipants} orang`} />
          <DetailRow
            label="Batas Waktu"
            value={deal.status === "berlangsung" ? `${timeLeft} lagi` : "Sudah berakhir"}
          />
          <DetailRow label="Kategori" value={deal.category} />
          <DetailRow label="Metode Pemenuhan" value={fulfillmentLabel} />
          {(deal.fulfillment === "pickup" || deal.fulfillment === "pickup-delivery") && (
            <>
              <DetailRow label="Lokasi Pickup" value={deal.pickupLocation ?? "-"} />
              <DetailRow label="Jam Pickup" value={deal.pickupHours ?? "-"} />
            </>
          )}
          {(deal.fulfillment === "delivery" || deal.fulfillment === "pickup-delivery") && (
            <DetailRow
              label="Biaya Pengiriman"
              value={deal.deliveryFee ? formatRupiah(deal.deliveryFee) : "-"}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <ExtendTimeModal
          onClose={() => setModalOpen(false)}
          onExtend={(hours) => {
            setHoursLeft((prev) => prev + hours);
            setModalOpen(false);
          }}
        />
      )}
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#7A7876]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#292828]">{value}</p>
    </div>
  );
}
