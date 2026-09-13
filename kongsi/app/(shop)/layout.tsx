import type { ReactNode } from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#292828]">
      <CustomerNavbar />
      {children}
    </div>
  );
}
