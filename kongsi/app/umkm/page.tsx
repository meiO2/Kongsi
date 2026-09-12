    import Link from "next/link";
    import OverviewCard from "@/components/umkm/OverviewCard";
    import ActiveKongsiCard from "@/components/umkm/ActiveKongsiCard";
    import ActionRow from "@/components/umkm/ActionRow";
    import SalesChart from "@/components/umkm/SalesChart";
    import MobileCreateKongsiButton from "@/components/umkm/MobileCreateKongsiButton";
    import { PlusIcon } from "@/components/umkm/icons";
    import {
    ACTION_ITEMS,
    ACTIVE_KONGSI,
    OVERVIEW_METRICS,
    SALES_LAST_7_DAYS,
    SALES_SUMMARY,
    formatRupiah,
    } from "@/lib/umkmMockData";

    export default function UmkmDashboardPage() {
    return (
        <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pb-24 pt-8 sm:px-6 sm:pb-16">
        {/* PAGE HEADER */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1
                className="text-2xl font-bold text-[#292828] sm:text-[28px]"
                style={{ fontFamily: "var(--font-heading)" }}
            >
                Selamat datang kembali! 👋
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
            {OVERVIEW_METRICS.map((metric) => (
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
                {ACTIVE_KONGSI.map((kongsi) => (
                    <ActiveKongsiCard key={kongsi.id} kongsi={kongsi} />
                ))}
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
                <SalesStat label="Penjualan Hari Ini" value={formatRupiah(SALES_SUMMARY.today)} />
                <SalesStat label="Penjualan Bulan Ini" value={formatRupiah(SALES_SUMMARY.thisMonth)} />
                <SalesStat label="Kongsi Berhasil" value={String(SALES_SUMMARY.successfulKongsi)} />
                <SalesStat label="Total Pembeli" value={String(SALES_SUMMARY.totalBuyers)} />
                </div>

                <div className="mt-2 border-t border-[#F1EFEF] pt-4">
                <p className="mb-2 text-sm font-medium text-[#7A7876]">
                    Penjualan 7 hari terakhir
                </p>
                <SalesChart data={SALES_LAST_7_DAYS} />
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
                {ACTION_ITEMS.map((item) => (
                <ActionRow key={item.id} item={item} />
                ))}
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
