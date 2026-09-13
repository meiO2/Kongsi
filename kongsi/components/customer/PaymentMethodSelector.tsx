"use client";

import { RadioDot } from "./FulfillmentPicker";

export type PaymentMethod = "qris" | "ewallet" | "va" | "kartu";

const METHODS: { value: PaymentMethod; label: string; emoji: string }[] = [
  { value: "qris", label: "QRIS", emoji: "🔳" },
  { value: "ewallet", label: "GoPay / OVO / DANA", emoji: "📱" },
  { value: "va", label: "Virtual Account", emoji: "🏦" },
  { value: "kartu", label: "Kartu", emoji: "💳" },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {METHODS.map((method) => (
        <button
          key={method.value}
          type="button"
          onClick={() => onChange(method.value)}
          className={[
            "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
            value === method.value
              ? "border-[#3991FA] bg-[#3991FA]/[0.04]"
              : "border-[#E4E1DF] bg-white",
          ].join(" ")}
        >
          <RadioDot active={value === method.value} />
          <span className="text-lg" aria-hidden>
            {method.emoji}
          </span>
          <span className="text-sm font-semibold text-[#292828]">{method.label}</span>
        </button>
      ))}
    </div>
  );
}
