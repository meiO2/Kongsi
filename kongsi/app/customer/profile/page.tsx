"use client";

import { createClient } from "@/utils/supabase/client";
import ProfileSection, {
  ProfileRow,
} from "@/components/customer/ProfileSection";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BellIcon,
  ChevronRightIcon,
  FileTextIcon,
  GlobeIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  LockIcon,
  LogOutIcon,
  MessageIcon,
  PlusIcon,
  ShieldIcon,
} from "@/components/customer/icons";

const supabase = createClient();

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  avatarInitial: string;
  addresses: Address[];
}

interface Address {
  id: string;
  label: string;
  detail: string;
  mapsUrl?: string;
  isPrimary?: boolean;
}

const EMPTY_PROFILE: ProfileData = {
  name: "Pengguna Kongsi",
  phone: "-",
  email: "-",
  avatarInitial: "P",
  addresses: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (!response.ok || !isMounted) return;
      const name = data.name || EMPTY_PROFILE.name;
      setProfile({
        name,
        phone: data.phone || "-",
        email: data.email || "-",
        avatarInitial: name.charAt(0).toUpperCase(),
        addresses: Array.isArray(data.addresses)
          ? data.addresses.map((address: { id: string; label: string; detail: string; maps_url?: string; is_primary?: boolean }) => ({ id: address.id, label: address.label, detail: address.detail, mapsUrl: address.maps_url, isPrimary: address.is_primary }))
          : [],
      });
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleAddAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = addressLabel.trim();
    const detail = addressDetail.trim();

    if (!label || !detail) {
      setAddressError("Lengkapi nama dan detail alamat.");
      return;
    }

    setIsSavingAddress(true);
    setAddressError(null);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail)}`;
    const response = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label, detail, mapsUrl }) });
    const result = await response.json();
    if (!response.ok) {
      setAddressError(result.error ?? "Alamat gagal disimpan.");
    } else {
      const address: Address = { id: result.id, label: result.label, detail: result.detail, mapsUrl: result.maps_url, isPrimary: result.is_primary };
      setProfile((current) => ({ ...current, addresses: [...current.addresses, address] }));
      setAddressLabel("");
      setAddressDetail("");
      setIsAddingAddress(false);
    }
    setIsSavingAddress(false);
  }

  async function setPrimaryAddress(addressId: string) {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addressId }) });
    if (!response.ok) return;
    setProfile((current) => ({ ...current, addresses: current.addresses.map((address) => ({ ...address, isPrimary: address.id === addressId })) }));
  }

  async function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setAddressError("Browser ini tidak mendukung lokasi perangkat.");
      return;
    }

    setIsLocating(true);
    setAddressError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const coordinates = `${coords.latitude},${coords.longitude}`;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1&accept-language=id`,
          );
          const result = (await response.json()) as {
            display_name?: string;
          };

          setAddressDetail(
            result.display_name || `Lokasi saat ini (${coordinates})`,
          );
        } catch {
          setAddressDetail(`Lokasi saat ini (${coordinates})`);
        }
        setIsLocating(false);
      },
      () => {
        setAddressError(
          "Lokasi tidak bisa diakses. Izinkan akses lokasi lalu coba lagi.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <h1
        className="text-2xl font-bold text-[#292828]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Profil
      </h1>

      {/* Akun */}
      <ProfileSection title="Akun">
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3991FA] text-2xl font-bold text-white">
            {profile.avatarInitial}
          </div>
          <div>
            <p
              className="text-[17px] font-semibold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {profile.name}
            </p>
            <p className="text-sm text-[#7A7876]">{profile.email}</p>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow label="Nama" value={profile.name} />
          <ProfileRow label="Nomor HP" value={profile.phone} />
          <ProfileRow label="Email" value={profile.email} />
        </div>
      </ProfileSection>

      {/* Alamat */}
      <ProfileSection
        title="Alamat"
        action={
          <button
            type="button"
            onClick={() => setIsAddingAddress((current) => !current)}
            className="flex items-center gap-1.5 rounded-full border border-[#3991FA]/30 px-3 py-1.5 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah alamat
          </button>
        }
      >
        {isAddingAddress && (
          <form
            onSubmit={handleAddAddress}
            className="mb-3 flex flex-col gap-3 rounded-xl border border-dashed border-[#3991FA]/30 bg-[#3991FA]/[0.04] p-4"
          >
            <input
              value={addressLabel}
              onChange={(event) => setAddressLabel(event.target.value)}
              placeholder="Label alamat, misalnya Rumah"
              className="rounded-xl border border-[#E4E1DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3991FA]"
            />
            <textarea
              value={addressDetail}
              onChange={(event) => setAddressDetail(event.target.value)}
              placeholder="Detail alamat lengkap"
              rows={3}
              className="resize-none rounded-xl border border-[#E4E1DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3991FA]"
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="rounded-xl border border-[#3991FA]/30 px-4 py-2.5 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06] disabled:opacity-60"
            >
              {isLocating ? "Mengambil lokasi..." : "Gunakan lokasi saya"}
            </button>
            {addressError && (
              <p className="text-sm text-[#E14B4B]">{addressError}</p>
            )}
            <button
              type="submit"
              disabled={isSavingAddress}
              className="rounded-xl bg-[#3991FA] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSavingAddress ? "Menyimpan..." : "Simpan alamat"}
            </button>
          </form>
        )}
        <div className="flex flex-col gap-3">
          {profile.addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-start gap-3 rounded-xl border border-[#E4E1DF] p-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EFEF] text-[#292828]">
                <HomeIcon className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-[#292828]">
                    {address.label}
                  </p>
                  {address.isPrimary && (
                    <span className="rounded-full bg-[#FFCF00]/20 px-2 py-0.5 text-xs font-semibold text-[#7A6300]">
                      Alamat Utama
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#7A7876]">{address.detail}</p>
                <a
                  href={
                    address.mapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.detail)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-[#3991FA] hover:underline"
                >
                  Buka di Google Maps
                </a>
                {!address.isPrimary && (
                  <button type="button" onClick={() => setPrimaryAddress(address.id)} className="ml-3 text-sm font-semibold text-[#3991FA] hover:underline">
                    Jadikan alamat utama
                  </button>
                )}
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#B3B0AE]" />
            </div>
          ))}
          {profile.addresses.length === 0 && !isAddingAddress && (
            <p className="rounded-xl border border-dashed border-[#E4E1DF] p-4 text-sm text-[#7A7876]">
              Belum ada alamat tersimpan.
            </p>
          )}
        </div>
      </ProfileSection>

      {/* Pengaturan */}
      <ProfileSection title="Pengaturan">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow
            icon={<BellIcon className="h-4.5 w-4.5" />}
            label="Notifikasi"
            onClick={() => {}}
          />
          <ProfileRow
            icon={<ShieldIcon className="h-4.5 w-4.5" />}
            label="Keamanan akun"
            onClick={() => {}}
          />
          <ProfileRow
            icon={<LockIcon className="h-4.5 w-4.5" />}
            label="Ubah password"
            onClick={() => {}}
          />
          <ProfileRow
            icon={<GlobeIcon className="h-4.5 w-4.5" />}
            label="Bahasa"
            value="Indonesia"
            onClick={() => {}}
          />
        </div>
      </ProfileSection>

      {/* Bantuan */}
      <ProfileSection title="Bantuan">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow
            icon={<HelpCircleIcon className="h-4.5 w-4.5" />}
            label="FAQ"
            onClick={() => {}}
          />
          <ProfileRow
            icon={<MessageIcon className="h-4.5 w-4.5" />}
            label="Hubungi bantuan"
            onClick={() => {}}
          />
        </div>
      </ProfileSection>

      {/* Informasi */}
      <ProfileSection title="Informasi">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow
            icon={<InfoIcon className="h-4.5 w-4.5" />}
            label="Tentang Kongsi!"
            onClick={() => {}}
          />
          <ProfileRow
            icon={<FileTextIcon className="h-4.5 w-4.5" />}
            label="Kebijakan Privasi"
            onClick={() => {}}
          />
        </div>
      </ProfileSection>

      {/* Account */}
      <ProfileSection title="Account">
        <ProfileRow
          icon={<LogOutIcon className="h-4.5 w-4.5" />}
          label={isLoggingOut ? "Keluar..." : "Keluar"}
          onClick={handleLogout}
          danger
        />
      </ProfileSection>
    </main>
  );
}
