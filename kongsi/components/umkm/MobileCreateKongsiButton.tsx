import Link from "next/link";
import { PlusIcon } from "./icons";

export default function MobileCreateKongsiButton() {
  return (
    <Link
      href="/umkm/kongsi/baru"
      className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-center gap-2 rounded-2xl bg-[#3991FA] py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(57,145,250,0.35)] transition-colors hover:bg-[#2B7FE0] sm:hidden"
    >
      <PlusIcon className="h-4.5 w-4.5" />
      Buat Kongsi
    </Link>
  );
}
