"use client";

import { CloseIcon } from "./icons";

interface ExtendTimeOption {
  label: string;
  hours: number;
}

const OPTIONS: ExtendTimeOption[] = [
  { label: "+1 jam", hours: 1 },
  { label: "+3 jam", hours: 3 },
  { label: "+1 hari", hours: 24 },
];

interface ExtendTimeModalProps {
  onClose: () => void;
  onExtend: (hours: number) => void | Promise<void>;
}

export default function ExtendTimeModal({ onClose, onExtend }: ExtendTimeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#292828]/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-lg font-bold text-[#292828]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Tambah Waktu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A7876] transition-colors hover:bg-[#F1EFEF]"
          >
            <CloseIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-[#7A7876]">
          Beri waktu tambahan agar Kongsi ini bisa mencapai target pembeli.
        </p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onExtend(option.hours)}
              className="rounded-xl border border-[#E4E1DF] px-4 py-3 text-left text-sm font-semibold text-[#292828] transition-colors hover:border-[#3991FA]/40 hover:bg-[#3991FA]/[0.04]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
