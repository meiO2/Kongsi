"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BellIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Jelajahi" },
  { href: "/customer/orders", label: "Pesanan" },
] as const;

const supabase = createClient();

export default function CustomerNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileInitial, setProfileInitial] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const name = data.user?.user_metadata?.name || data.user?.email;
      setProfileInitial(name ? name.charAt(0).toUpperCase() : null);
    }

    loadUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const name = session?.user.user_metadata?.name || session?.user.email;
        setProfileInitial(name ? name.charAt(0).toUpperCase() : null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-[#3991FA] font-[family-name:var(--font-body)]">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Kongsi! — Beranda"
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

        {/* Search — desktop/tablet */}
        <form action="/" method="get" className="hidden flex-1 sm:block sm:max-w-md md:max-w-lg">
          <label className="relative block w-full">
            <span className="sr-only">Cari produk atau Kongsi</span>

            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7876]" />

            <input
              type="search"
              name="q"
              placeholder="Cari produk atau Kongsi..."
              className="w-full rounded-full border border-transparent bg-white py-2.5 pl-10 pr-4 font-[family-name:var(--font-body)] text-sm text-[#292828] placeholder:text-[#B3B0AE] outline-none transition-shadow focus:ring-4 focus:ring-white/40"
            />
          </label>
        </form>

        {/* Right side — desktop nav */}
        <nav className="ml-auto hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "relative pb-1 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white/90 transition-colors hover:text-white",
                isActive(link.href) ? "text-white" : "",
              ].join(" ")}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-white" />
              )}
            </Link>
          ))}

          {/* Notifications */}
          <Link
            href="/customer/notifications"
            aria-label="Notifikasi"
            className={[
              "relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white",
              isActive("/customer/notifications")
                ? "bg-white/10 text-white"
                : "",
            ].join(" ")}
          >
            <BellIcon className="h-5 w-5" />
          </Link>

          {/* Profile / Login */}
          {profileInitial ? (
            <Link
              href="/customer/profile"
              aria-label="Profil saya"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20 font-[family-name:var(--font-body)] text-sm font-semibold text-white ring-2 ring-white/30 transition-shadow hover:ring-white/60"
            >
              {profileInitial}
            </Link>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 font-[family-name:var(--font-body)] text-sm font-semibold text-[#3991FA] transition-colors hover:bg-white/90"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>

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

      {/* Search — mobile row */}
      <form action="/" method="get" className="px-4 pb-3 sm:hidden">
        <label className="relative block w-full">
          <span className="sr-only">Cari produk atau Kongsi</span>

          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7876]" />

          <input
            type="search"
            name="q"
            placeholder="Cari produk atau Kongsi..."
            className="w-full rounded-full border border-transparent bg-white py-2.5 pl-10 pr-4 font-[family-name:var(--font-body)] text-sm text-[#292828] placeholder:text-[#B3B0AE] outline-none transition-shadow focus:ring-4 focus:ring-white/40"
          />
        </label>
      </form>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/15 bg-[#3991FA] px-4 pb-4 pt-2 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={[
                "rounded-xl px-3 py-2.5 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white/90 transition-colors",
                isActive(link.href)
                  ? "bg-white/15 text-white"
                  : "hover:bg-white/10",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/customer/notifications"
            onClick={() => setMobileOpen(false)}
            className={[
              "rounded-xl px-3 py-2.5 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white/90 transition-colors",
              isActive("/customer/notifications")
                ? "bg-white/15 text-white"
                : "hover:bg-white/10",
            ].join(" ")}
          >
            Notifikasi
          </Link>

          {profileInitial ? (
            <Link
              href="/customer/profile"
              onClick={() => setMobileOpen(false)}
              className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold ring-2 ring-white/30">
                {profileInitial}
              </span>
              Profil saya
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-xl bg-white px-3 py-2.5 text-center font-[family-name:var(--font-body)] text-[15px] font-semibold text-[#3991FA]"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
