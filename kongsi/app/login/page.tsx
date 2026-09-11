import { Baloo_2, Inter } from "next/font/google";
import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

const baloo = Baloo_2({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    variable: "--font-heading",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-body",
});

export const metadata: Metadata = {
    title: "Masuk atau Daftar — Kongsi!",
    description: "Masuk ke akun Kongsi! kamu atau daftar sebagai Pelanggan maupun UMKM.",
};

export default function LoginPage() {
    return (
    <main className={`${baloo.variable} ${inter.variable} font-[family-name:var(--font-body)]`}>
        <AuthPage />
    </main>
    );
}