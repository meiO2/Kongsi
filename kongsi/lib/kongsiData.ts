export type KongsiStatus =
  | "berlangsung"
  | "sukses"
  | "selesai"
  | "tidak-berhasil";

export type KongsiCategory =
  | "Kuliner"
  | "Fashion"
  | "Kerajinan"
  | "Kebutuhan Rumah"
  | "Produk Lokal";

export type FulfillmentMethod = "pickup" | "delivery" | "pickup-delivery";

export const KONGSI_STATUS_LABEL: Record<KongsiStatus, string> = {
  berlangsung: "Sedang Berlangsung",
  sukses: "Target Tercapai",
  selesai: "Selesai",
  "tidak-berhasil": "Tidak Berhasil",
};

export const KONGSI_FILTERS: Array<{
  value: KongsiStatus | "semua";
  label: string;
}> = [
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
  imageUrl?: string;
  category: KongsiCategory;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  timeLeft: string;
  deadlineAt: string;
  status: KongsiStatus;
  fulfillment: FulfillmentMethod;
  pickupLocation?: string;
  pickupMapsUrl?: string;
  pickupHours?: string;
  deliveryFee?: number;
}

export const KONGSI_CATEGORIES: KongsiCategory[] = [
  "Kuliner",
  "Fashion",
  "Kerajinan",
  "Kebutuhan Rumah",
  "Produk Lokal",
];

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
