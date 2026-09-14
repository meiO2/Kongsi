    "use client";

    import Image from "next/image";
    import Link from "next/link";
    import { usePathname } from "next/navigation";
    import { useEffect, useState } from "react";
    import { createClient } from "@/utils/supabase/client";
    import { BellIcon, ChevronDownIcon, CloseIcon, MenuIcon } from "./icons";

    const NAV_LINKS = [
    { href: "/umkm", label: "Dashboard" },
    { href: "/umkm/kongsi", label: "Kongsi" },
    { href: "/umkm/pesanan", label: "Pesanan" },
    ] as const;

    const supabase = createClient();

    export default function UmkmNavbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [businessName, setBusinessName] = useState("UMKM");
    const [businessInitial, setBusinessInitial] = useState("U");

    useEffect(() => {
        function updateBusinessName(
        user: {
            user_metadata?: { businessName?: string; name?: string };
            email?: string;
        } | null,
        ) {
        const name =
            user?.user_metadata?.businessName ||
            user?.user_metadata?.name ||
            user?.email ||
            "UMKM";
        setBusinessName(name);
        setBusinessInitial(name.charAt(0).toUpperCase());
        }

        async function loadUser() {
        const { data } = await supabase.auth.getUser();
        updateBusinessName(data.user);
        }

        loadUser();
        const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => updateBusinessName(session?.user ?? null),
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    const isActive = (href: string) =>
        href === "/umkm" ? pathname === "/umkm" : pathname.startsWith(href);

    return (
        <header className="sticky top-0 z-40 bg-[#3991FA] font-[family-name:var(--font-body)]">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-6 px-4 sm:px-6">
            {/* Logo */}
            <Link
            href="/umkm"
            className="flex shrink-0 items-center"
            aria-label="Kongsi! — Dashboard UMKM"
            >
            <Image
                src="/logo.png"
                alt="Kongsi!"
                width={110}
                height={54}
                className="h-8 w-auto sm:h-9"
                priority
            />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={[
                    "relative pb-1 text-[15px] font-semibold text-white/90 transition-colors hover:text-white",
                    isActive(link.href) ? "text-white" : "",
                ].join(" ")}
                >
                {link.label}
                {isActive(link.href) && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-white" />
                )}
                </Link>
            ))}
            </nav>

            {/* Right side */}
            <div className="ml-auto hidden items-center gap-4 sm:flex">
            <Link
                href="/umkm/notifications"
                aria-label="Notifikasi"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
                <BellIcon className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FFCF00]" />
            </Link>

            <Link
                href="/umkm/profile"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 text-white transition-colors hover:bg-white/10"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold ring-2 ring-white/30">
                {businessInitial}
                </span>
                <span className="max-w-[140px] truncate text-sm font-semibold">
                {businessName}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-white/80" />
            </Link>
            </div>

            {/* Mobile menu button */}
            <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-white sm:hidden"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            >
            {mobileOpen ? (
                <CloseIcon className="h-5 w-5" />
            ) : (
                <MenuIcon className="h-5 w-5" />
            )}
            </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
            <nav className="flex flex-col gap-1 border-t border-white/15 bg-[#3991FA] px-4 pb-4 pt-2 sm:hidden">
            {NAV_LINKS.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={[
                    "rounded-xl px-3 py-2.5 text-[15px] font-semibold text-white/90 transition-colors",
                    isActive(link.href)
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10",
                ].join(" ")}
                >
                {link.label}
                </Link>
            ))}

            <Link
                href="/umkm/notifications"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
                <span className="flex items-center gap-2.5">
                <BellIcon className="h-5 w-5" />
                Notifikasi
                </span>
                <span className="h-2 w-2 rounded-full bg-[#FFCF00]" />
            </Link>

            <Link href="/umkm/profile" onClick={() => setMobileOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white ring-2 ring-white/30">
                {businessInitial}
                </span>
                <span className="truncate text-sm font-semibold text-white">
                {businessName}
                </span>
            </Link>
            </nav>
        )}
        </header>
    );
    }
