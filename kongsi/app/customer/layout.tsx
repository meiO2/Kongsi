import { Baloo_2, Inter } from "next/font/google";
import type { ReactNode } from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

// Same font configuration as app/login/page.tsx, so the Customer
// experience uses the exact same typefaces as the Login & Sign Up page.
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

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${baloo.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-body)] text-[#292828]`}
    >
      <CustomerNavbar />
      {children}
    </div>
  );
}
