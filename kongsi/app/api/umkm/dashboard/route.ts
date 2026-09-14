import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formatRemainingTime } from "@/lib/deadline";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Kamu harus login terlebih dahulu." }, { status: 401 });
  const [
    { data: deals, error: dealsError },
    { data: orders, error: ordersError },
    { data: profile },
  ] = await Promise.all([
    supabase.from("group_deals").select("id, product_name, image_url, normal_price, kongsi_price, current_participants, target_participants, deadline, deadline_at, status").eq("owner_id", user.id).order("created_at", { ascending: false }),
    supabase.from("orders").select("customer_id, quantity, total_amount, payment_status, status, created_at").eq("owner_id", user.id).eq("payment_status", "paid"),
    supabase.from("umkm").select("business_name").eq("owner_id", user.id).limit(1).maybeSingle(),
  ]);
  if (dealsError || ordersError) return NextResponse.json({ error: dealsError?.message ?? ordersError?.message }, { status: 500 });
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate()), month = new Date(now.getFullYear(), now.getMonth(), 1);
  const paid = orders ?? [];
  const recognizedSales = paid.filter(
    (order) => !["menunggu", "dibatalkan"].includes(order.status),
  );
  const total = (items: typeof recognizedSales) => items.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);
  const salesLast7Days = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today); start.setDate(start.getDate() - 6 + i);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return { label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(start), value: total(recognizedSales.filter((order) => { const at = new Date(order.created_at); return at >= start && at < end; })) };
  });
  const activeDeals = (deals ?? []).filter((deal) => deal.status === "berlangsung");
  const expiringThreshold = now.getTime() + 24 * 60 * 60 * 1000;
  const expiringDeals = activeDeals.filter((deal) => {
    const deadline = new Date(deal.deadline_at).getTime();
    return Number.isFinite(deadline) && deadline > now.getTime() && deadline <= expiringThreshold;
  });
  const ordersThisMonth = recognizedSales.filter(
    (order) => new Date(order.created_at) >= month,
  );
  return NextResponse.json({
    businessName: profile?.business_name ?? user.email ?? "UMKM",
    deals: (deals ?? []).map((deal) => ({ ...deal, deadline: formatRemainingTime(deal.deadline_at) })),
    salesLast7Days,
    metrics: {
    activeDeals: activeDeals.length,
    expiringDeals: expiringDeals.length,
    ordersToProcess: (orders ?? []).filter((order) => order.status === "perlu-diproses").length,
    readyOrders: (orders ?? []).filter((order) => order.status === "siap-diambil").length,
    salesToday: total(recognizedSales.filter((order) => new Date(order.created_at) >= today)),
    salesThisMonth: total(ordersThisMonth),
    buyersThisMonth: new Set(ordersThisMonth.map((order) => order.customer_id)).size,
    successfulDeals: (deals ?? []).filter((deal) => deal.status === "sukses" || deal.status === "selesai").length,
  }});
}
