    import type { ReactNode } from "react";
    import UmkmNavbar from "@/components/umkm/UmkmNavbar";

    export default function UmkmLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F7F7F6] text-[#292828]">
        <UmkmNavbar />
        {children}
        </div>
    );
    }
