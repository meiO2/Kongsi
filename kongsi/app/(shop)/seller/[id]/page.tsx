import { notFound } from "next/navigation";
import Link from "next/link";
import SellerRating from "@/components/customer/SellerRating";
import ReviewCard from "@/components/customer/ReviewCard";
import {
  getCustomerSellerByOwner,
  getCustomerSellerReviews,
} from "@/lib/customerGroupDeals";

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [seller, reviews] = await Promise.all([
    getCustomerSellerByOwner(id),
    getCustomerSellerReviews(id),
  ]);
  if (!seller) notFound();
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <Link href="/" className="w-fit text-sm font-semibold text-[#3991FA] hover:underline">← Kembali ke Beranda</Link>
      <section className="rounded-2xl border border-[#E4E1DF] bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3991FA]/10 text-3xl" aria-hidden>{seller.avatarEmoji}</span>
          <div><h1 className="text-xl font-bold text-[#292828]">{seller.name}</h1><p className="text-sm text-[#7A7876]">{seller.category}</p><SellerRating rating={seller.rating} reviewCount={seller.reviewCount} /></div>
        </div>
        <p className="mt-5 text-sm text-[#292828]">{seller.description || "Profil usaha belum dilengkapi."}</p>
        <p className="mt-2 text-sm text-[#7A7876]">{seller.address || "Lokasi belum tersedia"}</p>
      </section>
      <section className="flex flex-col gap-3"><h2 className="text-lg font-bold text-[#292828]">Ulasan Customer</h2>{reviews.length ? reviews.map((review) => <ReviewCard key={review.id} review={review} />) : <p className="rounded-2xl border border-dashed border-[#E4E1DF] p-5 text-sm text-[#7A7876]">Penjual baru—belum ada ulasan.</p>}</section>
    </main>
  );
}
