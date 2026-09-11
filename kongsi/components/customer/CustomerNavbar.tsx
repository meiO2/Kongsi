    "use client";

    import Image from "next/image";
    import Link from "next/link";
    import { usePathname } from "next/navigation";

    const navItems = [
    {
        label: "Jelajahi",
        href: "/",
    },
    {
        label: "Pesanan",
        href: "/customer/orders",
    },
    {
        label: "Notifikasi",
        href: "/customer/notifications",
    },
    {
        label: "Profil",
        href: "/customer/profile",
    },
    ];

    export default function CustomerNavbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-[#3991FA]">
        <nav className="mx-auto flex h-[82px] w-full items-center justify-between px-6 sm:px-10 lg:px-16">
            {/* Logo */}
            <Link href="/" className="shrink-0">
            <Image
                src="/logo.png"
                alt="Kongsi!"
                width={150}
                height={60}
                className="h-auto w-28 sm:w-32"
                priority
            />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex lg:gap-12">
            {navItems.map((item) => {
                const isActive =
                item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 text-[17px] font-semibold transition-colors ${
                    isActive
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                >
                    {item.label}

                    {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-white" />
                    )}
                </Link>
                );
            })}
            </div>

            {/* Mobile menu placeholder */}
            <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            aria-label="Open navigation menu"
            >
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            </button>
        </nav>
        </header>
    );
    }