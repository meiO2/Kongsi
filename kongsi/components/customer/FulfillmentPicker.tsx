"use client";

import { formatRupiah } from "@/lib/customerMockData";

export type FulfillmentChoice = "pickup" | "delivery";

interface FulfillmentPickerProps {
  value: FulfillmentChoice;
  onChange: (value: FulfillmentChoice) => void;
  pickupLocation?: string;
  pickupHours?: string;
  deliveryFee?: number;
}

export default function FulfillmentPicker({
  value,
  onChange,
  pickupLocation,
  pickupHours,
  deliveryFee,
}: FulfillmentPickerProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => onChange("pickup")}
        className={[
          "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
          value === "pickup" ? "border-[#3991FA] bg-[#3991FA]/[0.04]" : "border-[#E4E1DF] bg-white",
        ].join(" ")}
      >
        <RadioDot active={value === "pickup"} />
        <div>
          <p className="text-sm font-semibold text-[#292828]">📍 Ambil di tempat</p>
          <p className="mt-0.5 text-sm text-[#7A7876]">{pickupLocation}</p>
          <p className="text-sm text-[#7A7876]">{pickupHours}</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onChange("delivery")}
        className={[
          "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
          value === "delivery" ? "border-[#3991FA] bg-[#3991FA]/[0.04]" : "border-[#E4E1DF] bg-white",
        ].join(" ")}
      >
        <RadioDot active={value === "delivery"} />
        <div>
          <p className="text-sm font-semibold text-[#292828]">🚚 Pengiriman</p>
          <p className="mt-0.5 text-sm text-[#7A7876]">
            Biaya pengiriman {formatRupiah(deliveryFee ?? 0)}
          </p>
        </div>
      </button>
    </div>
  );
}

export function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2",
        active ? "border-[#3991FA]" : "border-[#E4E1DF]",
      ].join(" ")}
    >
      {active && <span className="h-2 w-2 rounded-full bg-[#3991FA]" />}
    </span>
  );
}
