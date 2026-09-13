// Mock/static data for Kelola Kongsi, Buat Kongsi, and Kongsi detail pages.
// No backend calls — everything here is hardcoded for demonstration and is
// designed to be easy to swap for real API data later.

export type KongsiStatus = "berlangsung" | "sukses" | "selesai" | "tidak-berhasil";

export type KongsiCategory = "Kuliner" | "Kerajinan" | "Fashion" | "Lainnya";

export type FulfillmentMethod = "pickup" | "delivery" | "pickup-delivery";

export const KONGSI_STATUS_LABEL: Record<KongsiStatus, string> = {
  berlangsung: "Sedang Berlangsung",
  sukses: "Target Tercapai",
  selesai: "Selesai",
  "tidak-berhasil": "Tidak Berhasil",
};

export const KONGSI_FILTERS: { value: KongsiStatus | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "berlangsung", label: "Sedang Berlangsung" },
  { value: "sukses", label: "Target Tercapai" },
  { value: "selesai", label: "Selesai" },
  { value: "tidak-berhasil", label: "Tidak Berhasil" },
];

export interface KongsiDeal {
  id: string;
  name: string;
  description: string;
  imageEmoji: string;
  category: KongsiCategory;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  timeLeft: string;
  status: KongsiStatus;
  fulfillment: FulfillmentMethod;
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
}

export const KONGSI_DEALS: KongsiDeal[] = [
  {
    id: "ks-001",
    name: "Rice Bowl Ayam",
    description:
      "Rice bowl ayam suwir bumbu kecap dengan telur ceplok dan sambal khas Warung Bu Rina.",
    imageEmoji: "🍚",
    category: "Kuliner",
    normalPrice: 20000,
    kongsiPrice: 16000,
    currentParticipants: 8,
    targetParticipants: 10,
    timeLeft: "03:12:40",
    status: "berlangsung",
    fulfillment: "pickup-delivery",
    pickupLocation: "Pos Satpam Blok B",
    pickupHours: "17.00–19.00",
    deliveryFee: 10000,
  },
  {
    id: "ks-002",
    name: "Keripik Singkong Pedas",
    description: "Keripik singkong renyah dengan bumbu pedas manis, dikemas higienis.",
    imageEmoji: "🥔",
    category: "Kuliner",
    normalPrice: 12000,
    kongsiPrice: 9000,
    currentParticipants: 9,
    targetParticipants: 10,
    timeLeft: "01:45:00",
    status: "berlangsung",
    fulfillment: "pickup",
    pickupLocation: "Warung Renyah Jaya",
    pickupHours: "09.00–17.00",
  },
  {
    id: "ks-003",
    name: "Es Teh Manis Botolan",
    description: "Es teh manis segar dalam kemasan botol 500ml, cocok untuk cuaca panas.",
    imageEmoji: "🧋",
    category: "Kuliner",
    normalPrice: 8000,
    kongsiPrice: 6000,
    currentParticipants: 5,
    targetParticipants: 15,
    timeLeft: "10:30:00",
    status: "berlangsung",
    fulfillment: "delivery",
    deliveryFee: 5000,
  },
  {
    id: "ks-004",
    name: "Sabun Herbal Sereh",
    description: "Sabun batang herbal dengan ekstrak sereh, cocok untuk kulit sensitif.",
    imageEmoji: "🧼",
    category: "Lainnya",
    normalPrice: 18000,
    kongsiPrice: 13000,
    currentParticipants: 20,
    targetParticipants: 20,
    timeLeft: "00:00:00",
    status: "sukses",
    fulfillment: "pickup-delivery",
    pickupLocation: "Griya Sehat Alami",
    pickupHours: "10.00–18.00",
    deliveryFee: 8000,
  },
  {
    id: "ks-005",
    name: "Batik Tulis Motif Kawung",
    description: "Batik tulis asli motif kawung, bahan katun primisima.",
    imageEmoji: "🧵",
    category: "Fashion",
    normalPrice: 150000,
    kongsiPrice: 120000,
    currentParticipants: 6,
    targetParticipants: 6,
    timeLeft: "00:00:00",
    status: "selesai",
    fulfillment: "delivery",
    deliveryFee: 15000,
  },
  {
    id: "ks-006",
    name: "Anyaman Tas Rotan",
    description: "Tas rotan anyaman tangan, ringan dan tahan lama untuk belanja harian.",
    imageEmoji: "🧺",
    category: "Kerajinan",
    normalPrice: 85000,
    kongsiPrice: 69000,
    currentParticipants: 3,
    targetParticipants: 8,
    timeLeft: "00:00:00",
    status: "tidak-berhasil",
    fulfillment: "pickup",
    pickupLocation: "Kriya Ibu Sari",
    pickupHours: "08.00–16.00",
  },
];

export const KONGSI_CATEGORIES: KongsiCategory[] = ["Kuliner", "Kerajinan", "Fashion", "Lainnya"];

export function getKongsiById(id: string): KongsiDeal | undefined {
  return KONGSI_DEALS.find((deal) => deal.id === id);
}

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
