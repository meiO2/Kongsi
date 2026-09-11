    "use client";

    import Image from "next/image";
    import CustomerNavbar from "@/components/customer/CustomerNavbar";
    import CategoryCard from "@/components/customer/CategoryCard";
    import DealCard from "@/components/customer/DealCard";

    const categories = [
    { name: "Kuliner", icon: "🍜" },
    { name: "Fashion", icon: "👕" },
    { name: "Kerajinan", icon: "🧶" },
    { name: "Kebutuhan Rumah", icon: "🏠" },
    { name: "Produk Lokal", icon: "🌾" },
    ];

    const recommendedDeals = [
    {
        image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        productName: "Rice Bowl Ayam",
        seller: "Warung Bu Rina",
        normalPrice: "Rp20.000",
        dealPrice: "Rp16.000",
        current: 8,
        target: 10,
        remaining: "03:12:40",
    },
    {
        image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
        productName: "Donat Homemade",
        seller: "Dapur Nona",
        normalPrice: "Rp15.000",
        dealPrice: "Rp12.000",
        current: 6,
        target: 8,
        remaining: "05:42:18",
    },
    {
        image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        productName: "Sneakers Lokal",
        seller: "Langkah Kita",
        normalPrice: "Rp350.000",
        dealPrice: "Rp295.000",
        current: 14,
        target: 20,
        remaining: "12:20:05",
    },
    ];

    const nearbyDeals = [
    {
        image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        productName: "Seblak Teh Nia",
        seller: "Teh Nia",
        normalPrice: "Rp15.000",
        dealPrice: "Rp12.000",
        current: 9,
        target: 10,
        remaining: "01:24:32",
        location: "1.2 km dari kamu",
    },
    {
        image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
        productName: "Paket Sayur Segar",
        seller: "Kebun Tetangga",
        normalPrice: "Rp45.000",
        dealPrice: "Rp38.000",
        current: 7,
        target: 10,
        remaining: "08:14:12",
        location: "2.1 km dari kamu",
    },
    {
        image:
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80",
        productName: "Hampers Lokal",
        seller: "Rumah Kriya",
        normalPrice: "Rp120.000",
        dealPrice: "Rp99.000",
        current: 5,
        target: 8,
        remaining: "16:42:10",
        location: "2.8 km dari kamu",
    },
    ];

    export default function CustomerHome() {
    return (
        <div className="min-h-screen bg-[#F1EFEF] text-[#292828]">
        <CustomerNavbar />

        <main>
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8 lg:px-12">
            <div className="relative overflow-hidden rounded-[28px] bg-white px-7 py-10 shadow-[0_2px_15px_rgba(41,40,40,0.04)] sm:px-10 lg:px-14 lg:py-12">
                {/* Decorative shapes */}
                <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#FFCF00]/20" />

                <div className="pointer-events-none absolute -bottom-20 right-1/3 h-36 w-36 rounded-full bg-[#3991FA]/10" />

                <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
                {/* Hero text */}
                <div className="max-w-xl">
                    <div className="mb-4 inline-flex items-center rounded-full bg-[#FFCF00]/25 px-4 py-2 text-sm font-bold text-[#404040]">
                    🛍️ Belanja bareng, lebih hemat!
                    </div>

                    <h1
                    className="text-3xl font-bold leading-tight text-[#292828] sm:text-4xl lg:text-[44px]"
                    style={{ fontFamily: "var(--font-heading)" }}
                    >
                    Temukan barang favoritmu,
                    <span className="text-[#3991FA]"> bareng-bareng.</span>
                    </h1>

                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#7A7876] sm:text-base">
                    Ikut Group Deal dari UMKM di sekitarmu dan dapatkan harga
                    lebih hemat. Makin banyak yang ikut, makin seru kongsinya!
                    </p>

                    {/* Search */}
                    <div className="mt-7 flex h-14 w-full max-w-xl items-center rounded-2xl border border-[#E3E1DF] bg-[#F9F8F7] px-4 transition focus-within:border-[#3991FA] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(57,145,250,0.10)]">
                    <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7A7876"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Cari produk atau Kongsi..."
                        className="ml-3 w-full bg-transparent text-sm text-[#292828] outline-none placeholder:text-[#999694]"
                    />

                    <button
                        type="button"
                        className="hidden rounded-xl bg-[#3991FA] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2583ed] sm:block"
                    >
                        Cari
                    </button>
                    </div>
                </div>

                {/* Illustration */}
                <div className="relative flex h-52 w-full max-w-sm items-center justify-center lg:h-64 lg:max-w-md">
                    <div className="absolute h-48 w-48 rounded-full bg-[#3991FA]/10 sm:h-56 sm:w-56" />

                    <Image
                    src="/customer/home-illustration.png"
                    alt="Belanja bersama di Kongsi!"
                    width={400}
                    height={320}
                    className="relative z-10 h-auto max-h-64 w-auto max-w-full object-contain"
                    />
                </div>
                </div>
            </div>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
            <div className="mb-5 flex items-end justify-between">
                <div>
                <p className="text-sm font-semibold text-[#3991FA]">
                    Temukan yang kamu suka
                </p>

                <h2
                    className="mt-1 text-2xl font-bold text-[#292828]"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Jelajahi kategori
                </h2>
                </div>

                <button
                type="button"
                className="hidden text-sm font-semibold text-[#3991FA] hover:underline sm:block"
                >
                Lihat semua
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3">
                {categories.map((category) => (
                <CategoryCard
                    key={category.name}
                    name={category.name}
                    icon={category.icon}
                />
                ))}
            </div>
            </section>

            {/* Recommended */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
            <div className="mb-6">
                <p className="text-sm font-semibold text-[#3991FA]">
                Pilihan untukmu
                </p>

                <h2
                className="mt-1 text-2xl font-bold text-[#292828]"
                style={{ fontFamily: "var(--font-heading)" }}
                >
                Rekomendasi Kongsi
                </h2>

                <p className="mt-1 text-sm text-[#7A7876]">
                Group Deal yang mungkin cocok buat kamu.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedDeals.map((deal) => (
                <DealCard key={deal.productName} {...deal} />
                ))}
            </div>
            </section>

            {/* Almost reached */}
            <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-12">
            <div className="overflow-hidden rounded-[24px] bg-[#3991FA] px-6 py-7 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="inline-flex rounded-full bg-[#FFCF00] px-3 py-1 text-xs font-bold text-[#292828]">
                    🔥 Hampir berhasil!
                    </div>

                    <h2 className="mt-3 text-2xl font-bold text-white">
                    Tinggal sedikit lagi untuk Kongsi!
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/80">
                    Bantu Group Deal di bawah mencapai target dan nikmati harga
                    Kongsi bersama.
                    </p>
                </div>

                <button
                    type="button"
                    className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3991FA] transition hover:bg-[#FFCF00] hover:text-[#292828]"
                >
                    Lihat Kongsi
                </button>
                </div>
            </div>
            </section>

            {/* Nearby */}
            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
            <div className="mb-6">
                <p className="text-sm font-semibold text-[#3991FA]">
                Dekat denganmu
                </p>

                <h2
                className="mt-1 text-2xl font-bold text-[#292828]"
                style={{ fontFamily: "var(--font-heading)" }}
                >
                Kongsi di sekitarmu
                </h2>

                <p className="mt-1 text-sm text-[#7A7876]">
                Dukung UMKM lokal sambil mendapatkan harga yang lebih hemat.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyDeals.map((deal) => (
                <DealCard key={deal.productName} {...deal} />
                ))}
            </div>
            </section>

            {/* Bottom spacing */}
            <div className="h-10" />
        </main>
        </div>
    );
    }