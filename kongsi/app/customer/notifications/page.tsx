"use client";

import { useEffect, useState } from "react";
import NotificationCard from "@/components/customer/NotificationCard";
import type { NotificationItem, NotificationType } from "@/lib/customerData";

const GROUPS = ["Hari ini", "Kemarin"] as const;

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Notifikasi gagal dimuat.");
        setItems((result as Array<Record<string, string | boolean>>).map((row) => {
          const createdAt = new Date(String(row.created_at));
          return {
            id: String(row.id),
            type: (row.type === "selesai" ? "berhasil" : row.type) as NotificationType,
            title: String(row.title),
            description: String(row.description),
            time: createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            group: createdAt.toDateString() === new Date().toDateString() ? "Hari ini" : "Kemarin",
            unread: !Boolean(row.is_read),
          };
        }));
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Notifikasi gagal dimuat."))
      .finally(() => setLoading(false));
  }, []);

  async function markAllRead() {
    const response = await fetch("/api/notifications", { method: "PATCH" });
    if (response.ok) setItems((current) => current.map((item) => ({ ...item, unread: false })));
  }

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 pb-20 pt-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#292828]" style={{ fontFamily: "var(--font-heading)" }}>Notifikasi</h1>
        {items.some((item) => item.unread) && <button type="button" onClick={markAllRead} className="text-sm font-semibold text-[#3991FA] hover:underline">Tandai semua dibaca</button>}
      </div>

      {loading && <p className="text-sm text-[#7A7876]">Memuat notifikasi...</p>}
      {error && <p className="text-sm text-[#E14B4B]">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="rounded-2xl border border-dashed border-[#E4E1DF] p-6 text-sm text-[#7A7876]">Belum ada notifikasi.</p>}

      {GROUPS.map((group) => {
        const groupedItems = items.filter((item) => item.group === group);
        if (groupedItems.length === 0) return null;

        return (
          <section key={group} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#7A7876]">{group}</h2>
            <div className="flex flex-col gap-2.5">
              {groupedItems.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
