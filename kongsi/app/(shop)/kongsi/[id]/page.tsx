import Link from "next/link";
import { notFound } from "next/navigation";
import ProgressBar from "@/components/customer/ProgressBar";
import CountdownTimer from "@/components/customer/CountdownTimer";
import SellerRating from "@/components/customer/SellerRating";
import {
  formatRupiah,
  getDealStatus,
  getSellerById,
} from "@/lib/customerMockData";
import { getCustomerGroupDealById } from "@/lib/customerGroupDeals";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getCustomerGroupDealById(id);

  if (!deal) {
    notFound();
  }

  const seller = getSellerById(deal.sellerId);
  const status = getDealStatus(deal);
  const remaining = deal.targetParticipants - deal.currentParticipants;
  const isAlmostThere =
    status === "berlangsung" && remaining <= 2 && remaining > 0;

  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/"
        className="w-fit text-sm font-semibold text-[#3991FA] hover:underline"
      >
        ← Kembali ke Beranda
      </Link>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-8">
        {/* Product image */}
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-[#F1EFEF] text-7xl sm:aspect-[21/9]">
          <span aria-hidden>{deal.imageEmoji}</span>
        </div>

        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold text-[#292828] sm:text-[28px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {deal.name}
          </h1>

          <Link
            href={`/umkm/${deal.sellerId}`}
            className="mt-2 flex w-fit items-center gap-2 text-sm font-semibold text-[#292828] hover:underline"
          >
            {deal.seller}
          </Link>
          {seller && (
            <div className="mt-1">
              <SellerRating
                rating={seller.rating}
                reviewCount={seller.reviewCount}
              />
            </div>
          )}

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base text-[#7A7876] line-through">
              {formatRupiah(deal.normalPrice)}
            </span>
            <span
              className="text-2xl font-bold text-[#3991FA]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatRupiah(deal.kongsiPrice)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-3 rounded-2xl bg-[#F7F7F6] p-5">
          {status === "sukses" ? (
            <p
              className="text-lg font-bold text-[#1FA971]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              🎉 Target tercapai!
            </p>
          ) : null}

          <ProgressBar
            current={deal.currentParticipants}
            target={deal.targetParticipants}
          />
          <p className="text-sm text-[#7A7876]">
            {deal.currentParticipants}/{deal.targetParticipants} orang sudah
            ikut
          </p>

          {isAlmostThere && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#FFCF00]/20 px-3 py-1.5 text-sm font-semibold text-[#7A6300]">
              🔥 Tinggal {remaining} orang lagi!
            </span>
          )}

          {status === "berlangsung" && (
            <CountdownTimer timeLeft={deal.timeLeft} />
          )}
          {status === "berakhir" && (
            <CountdownTimer timeLeft={deal.timeLeft} expired />
          )}
        </div>

        {/* Tentang Produk */}
        <section>
          <h2
            className="text-lg font-bold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Tentang Produk
          </h2>
          <p className="mt-2 text-sm text-[#7A7876]">{deal.description}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {deal.details.map((detail) => (
              <li
                key={detail}
                className="flex items-center gap-2 text-sm text-[#292828]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3991FA]" />
                {detail}
              </li>
            ))}
          </ul>
        </section>

        {/* Pemenuhan Pesanan */}
        <section>
          <h2
            className="text-lg font-bold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pemenuhan Pesanan
          </h2>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {(deal.fulfillment === "pickup" ||
              deal.fulfillment === "pickup-delivery") && (
              <div className="flex flex-1 items-start gap-2.5 rounded-2xl border border-[#E4E1DF] p-4">
                <span aria-hidden className="text-lg">
                  📍
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#292828]">
                    Ambil di tempat
                  </p>
                  <p className="mt-0.5 text-sm text-[#7A7876]">
                    {deal.pickupLocation}
                  </p>
                  <p className="text-sm text-[#7A7876]">{deal.pickupHours}</p>
                </div>
              </div>
            )}
            {(deal.fulfillment === "delivery" ||
              deal.fulfillment === "pickup-delivery") && (
              <div className="flex flex-1 items-start gap-2.5 rounded-2xl border border-[#E4E1DF] p-4">
                <span aria-hidden className="text-lg">
                  🚚
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#292828]">
                    Pengiriman
                  </p>
                  <p className="mt-0.5 text-sm text-[#7A7876]">
                    Biaya pengiriman {formatRupiah(deal.deliveryFee ?? 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <div className="border-t border-[#F1EFEF] pt-5">
          {status === "berlangsung" && (
            <Link
              href={`/checkout/${deal.id}`}
              className="flex w-full items-center justify-center rounded-2xl bg-[#3991FA] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2B7FE0] sm:w-auto sm:px-10"
            >
              Ikut Kongsi
            </Link>
          )}

          {status === "sukses" && (
            <div className="rounded-2xl bg-[#1FA971]/10 px-5 py-4 text-center text-sm font-semibold text-[#1FA971]">
              🎉 Kongsi ini sudah mencapai target dan tidak menerima peserta
              baru.
            </div>
          )}

          {status === "berakhir" && (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-[#E4E1DF] py-3.5 text-[15px] font-semibold text-[#7A7876] sm:w-auto sm:px-10"
            >
              Kongsi sudah berakhir.
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
