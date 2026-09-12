// Mock/static data for the Customer experience.
// No backend, no database, no network calls — everything here is hardcoded
// so the UI can be demonstrated end-to-end on the frontend only.

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "kuliner", label: "Kuliner", emoji: "🍜" },
  { id: "fashion", label: "Fashion", emoji: "👕" },
  { id: "kerajinan", label: "Kerajinan", emoji: "🧶" },
  { id: "rumah", label: "Kebutuhan Rumah", emoji: "🏠" },
  { id: "lokal", label: "Produk Lokal", emoji: "🌾" },
];

export interface GroupDeal {
  id: string;
  name: string;
  seller: string;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  remainingLabel: string;
  timeLeft: string;
  distanceLabel?: string;
  locationLabel?: string;
  category?: string;
  imageEmoji: string;
  imageUrl?: string;
}

export const RECOMMENDED_DEALS: GroupDeal[] = [
  {
    id: "deal-1",
    name: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 8,
    targetParticipants: 10,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "03:12:40",
    imageEmoji: "🍚",
  },
  {
    id: "deal-2",
    name: "Kaos Katun Polos",
    seller: "Rumah Jahit Melati",
    normalPrice: 65000,
    kongsiPrice: 48000,
    currentParticipants: 5,
    targetParticipants: 15,
    remainingLabel: "Tinggal 10 orang lagi!",
    timeLeft: "11:40:05",
    imageEmoji: "👕",
  },
  {
    id: "deal-3",
    name: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    normalPrice: 85000,
    kongsiPrice: 69000,
    currentParticipants: 6,
    targetParticipants: 8,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "05:22:10",
    imageEmoji: "🧺",
  },
  {
    id: "deal-4",
    name: "Sabun Herbal Sereh",
    seller: "Griya Sehat Alami",
    normalPrice: 18000,
    kongsiPrice: 13000,
    currentParticipants: 12,
    targetParticipants: 20,
    remainingLabel: "Tinggal 8 orang lagi!",
    timeLeft: "08:05:30",
    imageEmoji: "🧼",
  },
  {
    id: "deal-5",
    name: "Keripik Singkong Pedas",
    seller: "UMKM Renyah Jaya",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "01:45:00",
    imageEmoji: "🥔",
  },
  {
    id: "deal-6",
    name: "Batik Tulis Motif Kawung",
    seller: "Batik Sekar Ayu",
    normalPrice: 150000,
    kongsiPrice: 120000,
    currentParticipants: 3,
    targetParticipants: 6,
    remainingLabel: "Tinggal 3 orang lagi!",
    timeLeft: "23:10:00",
    imageEmoji: "🧵",
  },
];

export const ALMOST_THERE_DEALS: GroupDeal[] = [
  {
    id: "almost-1",
    name: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 10,
    targetParticipants: 12,
    remainingLabel: "Tinggal 2 orang lagi!",
    timeLeft: "02:10:00",
    imageEmoji: "🍚",
  },
  {
    id: "almost-2",
    name: "Keripik Singkong Pedas",
    seller: "UMKM Renyah Jaya",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "01:45:00",
    imageEmoji: "🥔",
  },
  {
    id: "almost-3",
    name: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    normalPrice: 85000,
    kongsiPrice: 69000,
    currentParticipants: 7,
    targetParticipants: 8,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "04:05:00",
    imageEmoji: "🧺",
  },
];

export const NEARBY_DEALS: GroupDeal[] = [
  {
    id: "nearby-1",
    name: "Seblak Teh Nia",
    seller: "Warung Teh Nia",
    normalPrice: 15000,
    kongsiPrice: 12000,
    currentParticipants: 9,
    targetParticipants: 10,
    remainingLabel: "Tinggal 1 orang lagi!",
    timeLeft: "02:30:00",
    distanceLabel: "1.2 km dari kamu",
    locationLabel: "Cipondoh, Tangerang",
    imageEmoji: "🍲",
  },
  {
    id: "nearby-2",
    name: "Nasi Uduk Betawi",
    seller: "Dapur Mpok Yani",
    normalPrice: 14000,
    kongsiPrice: 11000,
    currentParticipants: 6,
    targetParticipants: 10,
    remainingLabel: "Tinggal 4 orang lagi!",
    timeLeft: "06:15:00",
    distanceLabel: "2.4 km dari kamu",
    locationLabel: "Cibodas, Tangerang",
    imageEmoji: "🍛",
  },
  {
    id: "nearby-3",
    name: "Kerupuk Kulit Original",
    seller: "UMKM Renyah Jaya",
    normalPrice: 22000,
    kongsiPrice: 17000,
    currentParticipants: 8,
    targetParticipants: 12,
    remainingLabel: "Tinggal 4 orang lagi!",
    timeLeft: "09:50:00",
    distanceLabel: "3.1 km dari kamu",
    locationLabel: "Periuk, Tangerang",
    imageEmoji: "🍘",
  },
];

export type OrderStatus = "berlangsung" | "sukses" | "gagal";

export interface Order {
  id: string;
  dealName: string;
  seller: string;
  currentParticipants: number;
  targetParticipants: number;
  status: OrderStatus;
  statusLabel: string;
  helperLabel: string;
  imageEmoji: string;
}

export const ORDERS: Order[] = [
  {
    id: "order-1",
    dealName: "Rice Bowl Ayam",
    seller: "Warung Bu Rina",
    currentParticipants: 8,
    targetParticipants: 10,
    status: "berlangsung",
    statusLabel: "Menunggu Kongsi berhasil",
    helperLabel: "Tinggal 2 orang lagi!",
    imageEmoji: "🍚",
  },
  {
    id: "order-2",
    dealName: "Kaos Katun Polos",
    seller: "Rumah Jahit Melati",
    currentParticipants: 5,
    targetParticipants: 15,
    status: "berlangsung",
    statusLabel: "Menunggu Kongsi berhasil",
    helperLabel: "Tinggal 10 orang lagi!",
    imageEmoji: "👕",
  },
  {
    id: "order-3",
    dealName: "Sabun Herbal Sereh",
    seller: "Griya Sehat Alami",
    currentParticipants: 20,
    targetParticipants: 20,
    status: "sukses",
    statusLabel: "Pesanan sedang diproses",
    helperLabel: "Target tercapai 🎉",
    imageEmoji: "🧼",
  },
  {
    id: "order-4",
    dealName: "Anyaman Tas Rotan",
    seller: "Kriya Ibu Sari",
    currentParticipants: 3,
    targetParticipants: 8,
    status: "gagal",
    statusLabel: "Pembayaran dikembalikan",
    helperLabel: "Target tidak tercapai",
    imageEmoji: "🧺",
  },
];

export type NotificationType =
  | "hampir-mencapai"
  | "berhasil"
  | "diproses"
  | "siap-diambil"
  | "pengiriman"
  | "dikembalikan"
  | "segera-berakhir";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  group: "Hari ini" | "Kemarin";
  unread: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "hampir-mencapai",
    title: "Kongsi hampir mencapai target",
    description: "Rice Bowl Ayam tinggal 2 orang lagi untuk berhasil.",
    time: "10:24",
    group: "Hari ini",
    unread: true,
  },
  {
    id: "notif-2",
    type: "siap-diambil",
    title: "Pesanan siap diambil",
    description:
      "Keripik Singkong Pedas sudah bisa diambil di Warung Renyah Jaya.",
    time: "09:02",
    group: "Hari ini",
    unread: true,
  },
  {
    id: "notif-3",
    type: "segera-berakhir",
    title: "Kongsi akan segera berakhir",
    description: "Batik Tulis Motif Kawung akan ditutup dalam 1 jam lagi.",
    time: "07:48",
    group: "Hari ini",
    unread: false,
  },
  {
    id: "notif-4",
    type: "berhasil",
    title: "Kongsi berhasil",
    description: "Sabun Herbal Sereh mencapai target 20 orang. Yay!",
    time: "19:12",
    group: "Kemarin",
    unread: false,
  },
  {
    id: "notif-5",
    type: "pengiriman",
    title: "Pengiriman sedang berlangsung",
    description: "Pesanan Nasi Uduk Betawi kamu sedang dalam perjalanan.",
    time: "14:30",
    group: "Kemarin",
    unread: false,
  },
  {
    id: "notif-6",
    type: "dikembalikan",
    title: "Pembayaran dikembalikan",
    description:
      "Anyaman Tas Rotan tidak mencapai target. Dana sudah dikembalikan.",
    time: "08:15",
    group: "Kemarin",
    unread: false,
  },
];

export const MOCK_PROFILE = {
  name: "Dewi Anggraini",
  phone: "0812-3456-7890",
  email: "dewi.anggraini@email.com",
  avatarInitial: "D",
};

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
