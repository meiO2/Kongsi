"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FormSection from "@/components/umkm/FormSection";
import FormField from "@/components/umkm/FormField";
import ActionButton from "@/components/umkm/ActionButton";
import {
  KONGSI_CATEGORIES,
  type FulfillmentMethod,
  type KongsiCategory,
} from "@/lib/kongsiData";

interface FormState {
  productName: string;
  description: string;
  fileName: string;
  normalPrice: string;
  kongsiPrice: string;
  targetParticipants: string;
  deadlineAmount: string;
  deadlineUnit: "jam" | "hari";
  category: KongsiCategory | "";
  fulfillment: FulfillmentMethod | "";
  pickupLocation: string;
  pickupMapsUrl: string;
  pickupStart: string;
  pickupEnd: string;
  deliveryFee: string;
}

const INITIAL_STATE: FormState = {
  productName: "",
  description: "",
  fileName: "",
  normalPrice: "",
  kongsiPrice: "",
  targetParticipants: "",
  deadlineAmount: "",
  deadlineUnit: "jam",
  category: "",
  fulfillment: "",
  pickupLocation: "",
  pickupMapsUrl: "",
  pickupStart: "",
  pickupEnd: "",
  deliveryFee: "",
};

const FULFILLMENT_OPTIONS: { value: FulfillmentMethod; label: string }[] = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "pickup-delivery", label: "Pickup & Delivery" },
];

export default function BuatKongsiPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locatingPickup, setLocatingPickup] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const showPickupFields =
    form.fulfillment === "pickup" || form.fulfillment === "pickup-delivery";
  const showDeliveryFields =
    form.fulfillment === "delivery" || form.fulfillment === "pickup-delivery";

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.productName.trim())
      nextErrors.productName = "Nama produk wajib diisi.";
    if (!form.description.trim())
      nextErrors.description = "Deskripsi wajib diisi.";
    if (!form.normalPrice || Number(form.normalPrice) < 1000)
      nextErrors.normalPrice = "Harga minimal Rp1.000.";
    if (!form.kongsiPrice || Number(form.kongsiPrice) < 1000)
      nextErrors.kongsiPrice = "Harga minimal Rp1.000.";
    if (
      form.normalPrice &&
      form.kongsiPrice &&
      Number(form.kongsiPrice) >= Number(form.normalPrice)
    ) {
      nextErrors.kongsiPrice =
        "Harga Kongsi harus lebih rendah dari harga normal.";
    }
    if (!form.targetParticipants)
      nextErrors.targetParticipants = "Target pembeli wajib diisi.";
    if (!form.deadlineAmount || Number(form.deadlineAmount) < 1)
      nextErrors.deadlineAmount = "Masukkan durasi minimal 1.";
    if (!form.category) nextErrors.category = "Pilih kategori produk.";
    if (!form.fulfillment) nextErrors.fulfillment = "Pilih metode pemenuhan.";
    if (showPickupFields && !form.pickupLocation.trim())
      nextErrors.pickupLocation = "Lokasi pickup wajib diisi.";
    if (showPickupFields && (!form.pickupStart || !form.pickupEnd))
      nextErrors.pickupStart = "Pilih jam mulai dan selesai pickup.";
    if (showPickupFields && form.pickupStart >= form.pickupEnd)
      nextErrors.pickupEnd = "Jam selesai harus setelah jam mulai.";
    if (showDeliveryFields && !form.deliveryFee)
      nextErrors.deliveryFee = "Biaya pengiriman wajib diisi.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  function useCurrentPickupLocation() {
    if (!navigator.geolocation) {
      setSubmitError("Browser ini tidak mendukung pengambilan lokasi.");
      return;
    }

    setLocatingPickup(true);
    setSubmitError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const coordinates = `${coords.latitude},${coords.longitude}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1&accept-language=id`,
          );
          const result = (await response.json()) as { display_name?: string };
          update(
            "pickupLocation",
            result.display_name || `Lokasi saat ini (${coordinates})`,
          );
        } catch {
          update("pickupLocation", `Lokasi saat ini (${coordinates})`);
        }

        update("pickupMapsUrl", mapsUrl);
        setLocatingPickup(false);
      },
      () => {
        setSubmitError(
          "Lokasi tidak bisa diakses. Izinkan akses lokasi lalu coba lagi.",
        );
        setLocatingPickup(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Sesi login tidak ditemukan.");

        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-");
        const imagePath = `${userData.user.id}/${crypto.randomUUID()}-${safeFileName}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(imagePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
          });
        if (uploadError)
          throw new Error(`Foto gagal diunggah: ${uploadError.message}`);

        imageUrl = supabase.storage
          .from("product-images")
          .getPublicUrl(imagePath).data.publicUrl;
      }

      const payload = {
        ...form,
        deadline: `${form.deadlineAmount} ${form.deadlineUnit}`,
        pickupMapsUrl:
          form.pickupMapsUrl ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.pickupLocation.trim())}`,
        pickupHours: showPickupFields
          ? `${form.pickupStart}–${form.pickupEnd}`
          : "",
      };
      const response = await fetch("/api/group-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, imageUrl }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setSubmitError(
          result.error ?? `Kongsi gagal disimpan (HTTP ${response.status}).`,
        );
        return;
      }

      router.push("/umkm/kongsi");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan Kongsi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-24 pt-8 sm:px-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#292828] sm:text-[28px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Buat Kongsi
        </h1>
        <p className="mt-1 text-[15px] text-[#7A7876]">
          Lengkapi detail Group Deal baru untuk tokomu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormSection title="Informasi Produk">
          <FormField
            label="Foto Produk"
            type="file"
            fileName={form.fileName}
            onFileChange={(file) => {
              setImageFile(file);
              update("fileName", file?.name ?? "");
            }}
          />
          <FormField
            label="Nama Produk"
            value={form.productName}
            onChange={(value) => update("productName", value)}
            placeholder="Contoh: Rice Bowl Ayam"
            required
            error={errors.productName}
          />
          <FormField
            label="Deskripsi"
            type="textarea"
            value={form.description}
            onChange={(value) => update("description", value)}
            placeholder="Ceritakan produkmu secara singkat"
            required
            error={errors.description}
          />
        </FormSection>

        <FormSection title="Harga & Target">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Harga Normal"
              type="number"
              prefix="Rp"
              value={form.normalPrice}
              onChange={(value) => update("normalPrice", value)}
              placeholder="1000"
              min={1000}
              required
              error={errors.normalPrice}
            />
            <FormField
              label="Harga Kongsi"
              type="number"
              prefix="Rp"
              value={form.kongsiPrice}
              onChange={(value) => update("kongsiPrice", value)}
              placeholder="1000"
              min={1000}
              required
              error={errors.kongsiPrice}
              hint="Harga per pembeli saat target tercapai."
            />
            <FormField
              label="Target Pembeli"
              type="number"
              value={form.targetParticipants}
              onChange={(value) => update("targetParticipants", value)}
              placeholder="10"
              required
              error={errors.targetParticipants}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#292828]">
                Durasi Kongsi<span className="ml-0.5 text-[#E14B4B]">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={form.deadlineAmount}
                  onChange={(event) =>
                    update("deadlineAmount", event.target.value)
                  }
                  placeholder="24"
                  className="w-full rounded-2xl border border-[#E4E1DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#3991FA]"
                />
                <select
                  value={form.deadlineUnit}
                  onChange={(event) =>
                    update("deadlineUnit", event.target.value as "jam" | "hari")
                  }
                  className="rounded-2xl border border-[#E4E1DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#3991FA]"
                >
                  <option value="jam">Jam</option>
                  <option value="hari">Hari</option>
                </select>
              </div>
              {errors.deadlineAmount && (
                <p className="text-xs font-medium text-[#E14B4B]">
                  {errors.deadlineAmount}
                </p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Kategori">
          <FormField
            label="Kategori"
            type="select"
            value={form.category}
            onChange={(value) => update("category", value as KongsiCategory)}
            options={KONGSI_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            }))}
            placeholder="Pilih kategori"
            required
            error={errors.category}
          />
        </FormSection>

        <FormSection
          title="Pemenuhan"
          description="Pilih bagaimana pembeli akan menerima produk ini."
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[#292828]">
              Metode Pemenuhan<span className="ml-0.5 text-[#E14B4B]">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {FULFILLMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("fulfillment", option.value)}
                  className={[
                    "rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                    form.fulfillment === option.value
                      ? "border-[#3991FA] bg-[#3991FA]/[0.06] text-[#3991FA]"
                      : "border-[#E4E1DF] bg-white text-[#292828] hover:border-[#3991FA]/40",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.fulfillment && (
              <p className="text-xs font-medium text-[#E14B4B]">
                {errors.fulfillment}
              </p>
            )}
          </div>

          {showPickupFields && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Lokasi Pickup"
                value={form.pickupLocation}
                onChange={(value) => update("pickupLocation", value)}
                placeholder="Alamat/lokasi pickup"
                required
                error={errors.pickupLocation}
              />
              <div className="flex flex-col justify-end gap-1.5">
                <span className="text-sm font-semibold text-[#292828]">
                  Peta Lokasi
                </span>
                <button
                  type="button"
                  onClick={useCurrentPickupLocation}
                  disabled={locatingPickup}
                  className="rounded-2xl border border-[#3991FA]/30 px-4 py-3 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
                >
                  {locatingPickup
                    ? "Mengambil lokasi..."
                    : "Gunakan lokasi saya dari Maps"}
                </button>
                {form.pickupMapsUrl && (
                  <p className="text-xs text-[#1FA971]">
                    Link Maps siap disimpan.
                  </p>
                )}
              </div>
              <FormField
                label="Mulai Pickup"
                type="time"
                value={form.pickupStart}
                onChange={(value) => update("pickupStart", value)}
                required
                error={errors.pickupStart}
              />
              <FormField
                label="Selesai Pickup"
                type="time"
                value={form.pickupEnd}
                onChange={(value) => update("pickupEnd", value)}
                required
                error={errors.pickupEnd}
              />
            </div>
          )}

          {showDeliveryFields && (
            <FormField
              label="Biaya Pengiriman"
              type="number"
              prefix="Rp"
              value={form.deliveryFee}
              onChange={(value) => update("deliveryFee", value)}
              placeholder="10000"
              required
              error={errors.deliveryFee}
            />
          )}
        </FormSection>

        {submitError && (
          <p className="rounded-xl border border-[#E14B4B]/30 bg-[#E14B4B]/10 p-3 text-sm font-medium text-[#E14B4B]">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => router.push("/umkm/kongsi")}
          >
            Batal
          </ActionButton>
          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Menerbitkan..." : "Terbitkan Kongsi"}
          </ActionButton>
        </div>
      </form>
    </main>
  );
}
