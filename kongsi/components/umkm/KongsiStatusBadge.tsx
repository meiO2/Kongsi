import { KONGSI_STATUS_LABEL, type KongsiStatus } from "@/lib/kongsiMockData";

const STATUS_STYLES: Record<KongsiStatus, string> = {
  berlangsung: "bg-[#3991FA]/10 text-[#3991FA]",
  sukses: "bg-[#1FA971]/10 text-[#1FA971]",
  selesai: "bg-[#7A7876]/10 text-[#7A7876]",
  "tidak-berhasil": "bg-[#E14B4B]/10 text-[#E14B4B]",
};

export default function KongsiStatusBadge({ status }: { status: KongsiStatus }) {
  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      {KONGSI_STATUS_LABEL[status]}
    </span>
  );
}
