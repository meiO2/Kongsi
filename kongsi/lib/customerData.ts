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

export type FulfillmentMethod = "pickup" | "delivery" | "pickup-delivery";
export type DealOutcome = "berlangsung" | "sukses" | "berakhir";

export interface GroupDeal {
  id: string;
  name: string;
  seller: string;
  sellerId: string;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  remainingLabel: string;
  timeLeft: string;
  deadlineAt: string;
  distanceLabel?: string;
  locationLabel?: string;
  category?: string;
  imageEmoji: string;
  imageUrl?: string;
  description: string;
  details: string[];
  fulfillment: FulfillmentMethod;
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
  outcome?: DealOutcome;
}

export function getDealStatus(deal: GroupDeal): DealOutcome {
  if (deal.currentParticipants >= deal.targetParticipants) return "sukses";
  return deal.outcome ?? "berlangsung";
}

export interface Seller {
  id: string;
  name: string;
  category: string;
  avatarEmoji: string;
  rating: number | null;
  reviewCount: number;
  description: string;
  address: string;
}

export interface Review {
  id: string;
  sellerId: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
}

export const RATING_LABELS: Record<number, string> = {
  1: "Sangat Buruk",
  2: "Buruk",
  3: "Cukup",
  4: "Bagus",
  5: "Sangat Bagus",
};

export type OrderStatus = "berlangsung" | "sukses" | "gagal" | "selesai";

export interface Order {
  id: string;
  orderNumber: string;
  dealId: string;
  sellerId: string;
  dealName: string;
  seller: string;
  currentParticipants: number;
  targetParticipants: number;
  status: OrderStatus;
  statusLabel: string;
  helperLabel: string;
  imageEmoji: string;
  imageUrl?: string;
  hasReview?: boolean;
  quantity: number;
  unitPrice: number;
  fulfillment: "pickup" | "delivery";
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
}

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

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
