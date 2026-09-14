export type OrderStatus =
  | "menunggu"
  | "perlu-diproses"
  | "diproses"
  | "siap-diambil"
  | "sedang-dikirim"
  | "selesai"
  | "dibatalkan";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu Kongsi Berhasil",
  "perlu-diproses": "Perlu Diproses",
  diproses: "Sedang Diproses",
  "siap-diambil": "Siap Diambil",
  "sedang-dikirim": "Sedang Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export const ORDER_FILTERS: Array<{
  value: OrderStatus | "semua";
  label: string;
}> = [
  { value: "semua", label: "Semua" },
  { value: "menunggu", label: "Menunggu Kongsi Berhasil" },
  { value: "perlu-diproses", label: "Perlu Diproses" },
  { value: "diproses", label: "Sedang Diproses" },
  { value: "siap-diambil", label: "Siap Diambil" },
  { value: "sedang-dikirim", label: "Sedang Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export interface Order {
  id: string;
  kongsiId: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  fulfillment: "pickup" | "delivery";
  pickupLocation?: string;
  pickupHours?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  status: OrderStatus;
}

export function calculateOrderTotal(order: Order): number {
  const subtotal = order.quantity * order.unitPrice;
  return subtotal +
    (order.fulfillment === "delivery" ? order.deliveryFee ?? 0 : 0);
}

export function getNextOrderStep(
  order: Order,
): { nextStatus: OrderStatus; actionLabel: string } | null {
  if (order.status === "perlu-diproses") {
    return { nextStatus: "diproses", actionLabel: "Mulai Proses" };
  }
  if (order.status === "diproses") {
    return order.fulfillment === "pickup"
      ? { nextStatus: "siap-diambil", actionLabel: "Siap Diambil" }
      : { nextStatus: "sedang-dikirim", actionLabel: "Siap Dikirim" };
  }
  if (order.status === "siap-diambil" || order.status === "sedang-dikirim") {
    return { nextStatus: "selesai", actionLabel: "Selesaikan Pesanan" };
  }
  return null;
}

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
