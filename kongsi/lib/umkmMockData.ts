// Mock/static data for the UMKM dashboard homepage.
// No backend calls — everything here is hardcoded for demonstration.

export const BUSINESS = {
  name: "Warung Bu Rina",
  avatarInitial: "R",
};

export interface OverviewMetric {
  id: string;
  label: string;
  value: string;
  supportingText: string;
  icon: "users" | "bag" | "money" | "buyers";
  trend?: "up" | "down";
}

export const OVERVIEW_METRICS: OverviewMetric[] = [
  {
    id: "kongsi-aktif",
    label: "Kongsi Aktif",
    value: "3",
    supportingText: "Sedang berlangsung",
    icon: "users",
  },
  {
    id: "pesanan",
    label: "Pesanan",
    value: "12",
    supportingText: "Perlu diproses",
    icon: "bag",
  },
  {
    id: "penjualan-hari-ini",
    label: "Penjualan Hari Ini",
    value: "Rp480.000",
    supportingText: "+12% dari kemarin",
    icon: "money",
    trend: "up",
  },
  {
    id: "pembeli",
    label: "Pembeli",
    value: "28",
    supportingText: "Bulan ini",
    icon: "buyers",
  },
];

export interface ActiveKongsi {
  id: string;
  name: string;
  imageEmoji: string;
  imageUrl?: string;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  remainingLabel: string;
  timeLeft: string;
}

export const ACTIVE_KONGSI: ActiveKongsi[] = [
  {
    id: "kongsi-1",
    name: "Rice Bowl Ayam",
    imageEmoji: "🍚",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 8,
    targetParticipants: 10,
    remainingLabel: "Tinggal 2 pembeli lagi!",
    timeLeft: "03:12:40",
  },
  {
    id: "kongsi-2",
    name: "Keripik Singkong Pedas",
    imageEmoji: "🥔",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 pembeli lagi!",
    timeLeft: "01:45:00",
  },
  {
    id: "kongsi-3",
    name: "Es Teh Manis Botolan",
    imageEmoji: "🧋",
    normalPrice: 8000,
    kongsiPrice: 6000,
    currentParticipants: 5,
    targetParticipants: 15,
    remainingLabel: "Tinggal 10 pembeli lagi!",
    timeLeft: "10:30:00",
  },
];

export interface ActionItem {
  id: string;
  message: string;
  actionLabel: string;
  href: string;
  type: "process" | "ready" | "ending";
}

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: "action-1",
    message: "4 pesanan perlu diproses",
    actionLabel: "Proses Pesanan",
    href: "/umkm/pesanan",
    type: "process",
  },
  {
    id: "action-2",
    message: "2 pesanan siap diambil",
    actionLabel: "Lihat Pesanan",
    href: "/umkm/pesanan",
    type: "ready",
  },
  {
    id: "action-3",
    message: "1 Kongsi hampir berakhir",
    actionLabel: "Lihat Kongsi",
    href: "/umkm/kongsi",
    type: "ending",
  },
];

export const SALES_SUMMARY = {
  today: 480000,
  thisMonth: 8240000,
  successfulKongsi: 24,
  totalBuyers: 156,
};

export interface SalesDataPoint {
  label: string;
  value: number;
}

export const SALES_LAST_7_DAYS: SalesDataPoint[] = [
  { label: "Sen", value: 320000 },
  { label: "Sel", value: 410000 },
  { label: "Rab", value: 280000 },
  { label: "Kam", value: 520000 },
  { label: "Jum", value: 610000 },
  { label: "Sab", value: 390000 },
  { label: "Min", value: 480000 },
];

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
