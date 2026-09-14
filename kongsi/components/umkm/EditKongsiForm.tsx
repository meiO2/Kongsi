"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FormSection from "./FormSection";
import FormField from "./FormField";
import ActionButton from "./ActionButton";
import {
  KONGSI_CATEGORIES,
  type FulfillmentMethod,
  type KongsiCategory,
} from "@/lib/kongsiData";

type EditableDeal = {
  id: string;
  productName: string;
  description: string;
  imageUrl: string;
  normalPrice: number;
  kongsiPrice: number;
  currentParticipants: number;
  targetParticipants: number;
  category: KongsiCategory;
  fulfillment: FulfillmentMethod;
  pickupLocation: string;
  pickupMapsUrl: string;
  pickupHours: string;
  deliveryFee: number;
};

type FormState = {
  productName: string;
  description: string;
  normalPrice: string;
  kongsiPrice: string;
  targetParticipants: string;
  category: KongsiCategory;
  fulfillment: FulfillmentMethod;
  pickupLocation: string;
  pickupMapsUrl: string;
  pickupStart: string;
  pickupEnd: string;
  deliveryFee: string;
};

const FULFILLMENT_OPTIONS: Array<{ value: FulfillmentMethod; label: string }> = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "pickup-delivery", label: "Pickup & Delivery" },
];

export default function EditKongsiForm({ deal }: { deal: EditableDeal }) {
  const router = useRouter();
  const supabase = createClient();
  const [pickupStart = "", pickupEnd = ""] = deal.pickupHours.split(/[–-]/);
  const [form, setForm] = useState<FormState>({
    productName: deal.productName,
    description: deal.description,
    normalPrice: String(deal.normalPrice),
    kongsiPrice: String(deal.kongsiPrice),
    targetParticipants: String(deal.targetParticipants),
    category: deal.category,
    fulfillment: deal.fulfillment,
    pickupLocation: deal.pickupLocation,
    pickupMapsUrl: deal.pickupMapsUrl,
    pickupStart,
    pickupEnd,
    deliveryFee: String(deal.deliveryFee),
  });
  const [imageUrl, setImageUrl] = useState(deal.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const showPickup = form.fulfillment !== "delivery";
  const showDelivery = form.fulfillment !== "pickup";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const normalPrice = Number(form.normalPrice);
    const kongsiPrice = Number(form.kongsiPrice);
    const targetParticipants = Number(form.targetParticipants);
    if (!form.productName.trim() || !form.description.trim()) {
      setError("Nama dan deskripsi produk wajib diisi.");
      return;
    }
    if (
      normalPrice < 1000 ||
      kongsiPrice < 1000 ||
      kongsiPrice >= normalPrice
    ) {
      setError("Harga Kongsi minimal Rp1.000 dan harus di bawah harga normal.");
      return;
    }
    if (!Number.isInteger(targetParticipants) || targetParticipants < deal.currentParticipants) {
      setError(`Target tidak boleh di bawah ${deal.currentParticipants} pembeli yang sudah ikut.`);
      return;
    }
    if (showPickup && (!form.pickupLocation.trim() || !form.pickupStart || !form.pickupEnd)) {
      setError("Lokasi dan jam pickup wajib dilengkapi.");
      return;
    }

    setSubmitting(true);
    try {
      let nextImageUrl = imageUrl;
      if (imageFile) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Sesi login tidak ditemukan.");
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-");
        const path = `${userData.user.id}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, { contentType: imageFile.type, upsert: false });
        if (uploadError) throw new Error(`Foto gagal diunggah: ${uploadError.message}`);
        nextImageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
        setImageUrl(nextImageUrl);
      }

      const response = await fetch(`/api/group-deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fileName,
          imageUrl: nextImageUrl,
          pickupMapsUrl: showPickup
            ? form.pickupMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.pickupLocation)}`
            : "",
          pickupHours: showPickup ? `${form.pickupStart}–${form.pickupEnd}` : "",
          deliveryFee: showDelivery ? form.deliveryFee : "0",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Detail Kongsi gagal disimpan.");
      router.push(`/umkm/kongsi/${deal.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Detail Kongsi gagal disimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-24 pt-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[#292828]" style={{ fontFamily: "var(--font-heading)" }}>
          Edit Detail Kongsi
        </h1>
        <p className="mt-1 text-sm text-[#7A7876]">
          Perubahan langsung disimpan ke Supabase dan tampil di halaman customer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormSection title="Informasi Produk">
          {imageUrl && (
            <div
              aria-label="Foto produk saat ini"
              className="aspect-[4/3] w-full max-w-xs rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
          <FormField
            label="Ganti Foto Produk"
            type="file"
            fileName={fileName}
            onFileChange={(file) => {
              setImageFile(file);
              setFileName(file?.name ?? "");
            }}
          />
          <FormField label="Nama Produk" value={form.productName} onChange={(value) => update("productName", value)} required />
          <FormField label="Deskripsi" type="textarea" value={form.description} onChange={(value) => update("description", value)} required />
        </FormSection>

        <FormSection title="Harga & Target">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Harga Normal" type="number" prefix="Rp" min={1000} value={form.normalPrice} onChange={(value) => update("normalPrice", value)} required />
            <FormField label="Harga Kongsi" type="number" prefix="Rp" min={1000} value={form.kongsiPrice} onChange={(value) => update("kongsiPrice", value)} required />
            <FormField
              label="Target Pembeli"
              type="number"
              min={deal.currentParticipants}
              value={form.targetParticipants}
              onChange={(value) => update("targetParticipants", value)}
              hint={`Minimal ${deal.currentParticipants}, sesuai jumlah pembeli yang sudah ikut.`}
              required
            />
          </div>
        </FormSection>

        <FormSection title="Kategori & Pemenuhan">
          <FormField
            label="Kategori"
            type="select"
            value={form.category}
            onChange={(value) => update("category", value as KongsiCategory)}
            options={KONGSI_CATEGORIES.map((category) => ({ value: category, label: category }))}
            required
          />
          <div className="flex flex-wrap gap-2">
            {FULFILLMENT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update("fulfillment", option.value)}
                className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold ${form.fulfillment === option.value ? "border-[#3991FA] bg-[#3991FA]/[0.06] text-[#3991FA]" : "border-[#E4E1DF]"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {showPickup && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Lokasi Pickup" value={form.pickupLocation} onChange={(value) => update("pickupLocation", value)} required />
              <FormField label="Link Google Maps" value={form.pickupMapsUrl} onChange={(value) => update("pickupMapsUrl", value)} placeholder="Opsional, dibuat otomatis dari alamat" />
              <FormField label="Mulai Pickup" type="time" value={form.pickupStart} onChange={(value) => update("pickupStart", value)} required />
              <FormField label="Selesai Pickup" type="time" value={form.pickupEnd} onChange={(value) => update("pickupEnd", value)} required />
            </div>
          )}
          {showDelivery && (
            <FormField label="Biaya Pengiriman" type="number" prefix="Rp" min={0} value={form.deliveryFee} onChange={(value) => update("deliveryFee", value)} required />
          )}
        </FormSection>

        {error && <p className="rounded-xl bg-[#E14B4B]/10 p-3 text-sm font-medium text-[#E14B4B]">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ActionButton type="button" variant="outline" onClick={() => router.back()}>Batal</ActionButton>
          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </ActionButton>
        </div>
      </form>
    </main>
  );
}
