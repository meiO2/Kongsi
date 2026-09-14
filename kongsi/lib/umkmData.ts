export interface OverviewMetric {
  id: string;
  label: string;
  value: string;
  supportingText: string;
  icon: "users" | "bag" | "money" | "buyers";
  trend?: "up" | "down";
}

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
  deadlineAt: string;
}

export interface ActionItem {
  id: string;
  message: string;
  actionLabel: string;
  href: string;
  type: "process" | "ready" | "ending";
}

export interface SalesDataPoint {
  label: string;
  value: number;
}

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}
