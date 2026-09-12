import NotificationCard from "@/components/customer/NotificationCard";
import { NOTIFICATIONS } from "@/lib/customerMockData";

const GROUPS = ["Hari ini", "Kemarin"] as const;

export default function NotificationsPage() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 pb-20 pt-8 sm:px-6">
      <h1
        className="text-2xl font-bold text-[#292828]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Notifikasi
      </h1>

      {GROUPS.map((group) => {
        const items = NOTIFICATIONS.filter((n) => n.group === group);
        if (items.length === 0) return null;

        return (
          <section key={group} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#7A7876]">{group}</h2>
            <div className="flex flex-col gap-2.5">
              {items.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
