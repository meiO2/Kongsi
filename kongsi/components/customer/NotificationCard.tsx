import type { NotificationItem, NotificationType } from "@/lib/customerMockData";
import {
  BellIcon,
  CheckCircleFilledIcon,
  ClockIcon,
  XCircleFilledIcon,
} from "./icons";

function NotifIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "berhasil":
    case "siap-diambil":
      return <CheckCircleFilledIcon className="h-5 w-5 text-[#1FA971]" />;
    case "dikembalikan":
      return <XCircleFilledIcon className="h-5 w-5 text-[#E14B4B]" />;
    case "segera-berakhir":
    case "hampir-mencapai":
      return <ClockIcon className="h-5 w-5 text-[#7A6300]" />;
    default:
      return <BellIcon className="h-5 w-5 text-[#3991FA]" />;
  }
}

const ICON_BG: Record<NotificationType, string> = {
  "hampir-mencapai": "bg-[#FFCF00]/20",
  berhasil: "bg-[#1FA971]/10",
  diproses: "bg-[#3991FA]/10",
  "siap-diambil": "bg-[#1FA971]/10",
  pengiriman: "bg-[#3991FA]/10",
  dikembalikan: "bg-[#E14B4B]/10",
  "segera-berakhir": "bg-[#FFCF00]/20",
};

export default function NotificationCard({ notification }: { notification: NotificationItem }) {
  return (
    <div
      className={[
        "flex gap-3 rounded-2xl border p-4 transition-colors",
        notification.unread
          ? "border-[#3991FA]/25 bg-[#3991FA]/[0.04]"
          : "border-[#E4E1DF] bg-white",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          ICON_BG[notification.type],
        ].join(" ")}
      >
        <NotifIcon type={notification.type} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#292828]">{notification.title}</h3>
          <span className="shrink-0 text-xs text-[#7A7876]">{notification.time}</span>
        </div>
        <p className="text-sm text-[#7A7876]">{notification.description}</p>
      </div>

      {notification.unread && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3991FA]" aria-label="Belum dibaca" />
      )}
    </div>
  );
}
