"use client";

import { useId, type ChangeEvent } from "react";

type FieldType = "text" | "number" | "textarea" | "select" | "file";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  type?: FieldType;
  value?: string;
  onChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  fileName?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options?: Option[];
  rows?: number;
  prefix?: string;
}

const BASE_INPUT_CLASSES =
  "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#292828] placeholder:text-[#B3B0AE] outline-none transition-shadow focus:ring-4";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  onFileChange,
  fileName,
  placeholder,
  required = false,
  error,
  hint,
  options = [],
  rows = 4,
  prefix,
}: FormFieldProps) {
  const id = useId();
  const borderClass = error
    ? "border-[#E14B4B] focus:border-[#E14B4B] focus:ring-[#E14B4B]/15"
    : "border-[#E4E1DF] focus:border-[#3991FA] focus:ring-[#3991FA]/15";

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[#292828]">
        {label}
        {required && <span className="ml-0.5 text-[#E14B4B]">*</span>}
      </label>

      {type === "textarea" && (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={[BASE_INPUT_CLASSES, borderClass, "resize-none"].join(" ")}
        />
      )}

      {type === "select" && (
        <select
          id={id}
          value={value}
          onChange={handleChange}
          className={[BASE_INPUT_CLASSES, borderClass, "appearance-none"].join(" ")}
        >
          <option value="" disabled>
            {placeholder ?? "Pilih salah satu"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {type === "file" && (
        <label
          htmlFor={id}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed bg-[#F1EFEF]/50 px-4 py-8 text-center transition-colors hover:border-[#3991FA]/50",
            error ? "border-[#E14B4B]" : "border-[#E4E1DF]",
          ].join(" ")}
        >
          <span className="text-sm font-semibold text-[#3991FA]">
            {fileName ? "Ganti foto" : "Unggah foto produk"}
          </span>
          <span className="text-xs text-[#7A7876]">
            {fileName ?? "PNG atau JPG, maksimal 5MB"}
          </span>
          <input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {(type === "text" || type === "number") && (
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7A7876]">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={[BASE_INPUT_CLASSES, borderClass, prefix ? "pl-11" : ""].join(" ")}
          />
        </div>
      )}

      {error ? (
        <p className="text-xs font-medium text-[#E14B4B]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#7A7876]">{hint}</p>
      ) : null}
    </div>
  );
}
