import ProfileSection, { ProfileRow } from "@/components/customer/ProfileSection";
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
import { ADDRESSES, MOCK_PROFILE } from "@/lib/customerMockData";

export default function ProfilePage() {
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
            {MOCK_PROFILE.avatarInitial}
          </div>
          <div>
            <p
              className="text-[17px] font-semibold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {MOCK_PROFILE.name}
            </p>
            <p className="text-sm text-[#7A7876]">{MOCK_PROFILE.email}</p>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow label="Nama" value={MOCK_PROFILE.name} />
          <ProfileRow label="Nomor HP" value={MOCK_PROFILE.phone} />
          <ProfileRow label="Email" value={MOCK_PROFILE.email} />
        </div>
      </ProfileSection>

      {/* Alamat */}
      <ProfileSection
        title="Alamat"
        action={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-[#3991FA]/30 px-3 py-1.5 text-sm font-semibold text-[#3991FA] transition-colors hover:bg-[#3991FA]/[0.06]"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah alamat
          </button>
        }
      >
        <div className="flex flex-col gap-3">
          {ADDRESSES.map((address) => (
            <div
              key={address.id}
              className="flex items-start gap-3 rounded-xl border border-[#E4E1DF] p-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EFEF] text-[#292828]">
                <HomeIcon className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-[#292828]">{address.label}</p>
                  {address.isPrimary && (
                    <span className="rounded-full bg-[#FFCF00]/20 px-2 py-0.5 text-xs font-semibold text-[#7A6300]">
                      Alamat Utama
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#7A7876]">{address.detail}</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#B3B0AE]" />
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* Pengaturan */}
      <ProfileSection title="Pengaturan">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow icon={<BellIcon className="h-4.5 w-4.5" />} label="Notifikasi" onClick={() => {}} />
          <ProfileRow icon={<ShieldIcon className="h-4.5 w-4.5" />} label="Keamanan akun" onClick={() => {}} />
          <ProfileRow icon={<LockIcon className="h-4.5 w-4.5" />} label="Ubah password" onClick={() => {}} />
          <ProfileRow icon={<GlobeIcon className="h-4.5 w-4.5" />} label="Bahasa" value="Indonesia" onClick={() => {}} />
        </div>
      </ProfileSection>

      {/* Bantuan */}
      <ProfileSection title="Bantuan">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow icon={<HelpCircleIcon className="h-4.5 w-4.5" />} label="FAQ" onClick={() => {}} />
          <ProfileRow icon={<MessageIcon className="h-4.5 w-4.5" />} label="Hubungi bantuan" onClick={() => {}} />
        </div>
      </ProfileSection>

      {/* Informasi */}
      <ProfileSection title="Informasi">
        <div className="flex flex-col divide-y divide-[#F1EFEF]">
          <ProfileRow icon={<InfoIcon className="h-4.5 w-4.5" />} label="Tentang Kongsi!" onClick={() => {}} />
          <ProfileRow icon={<FileTextIcon className="h-4.5 w-4.5" />} label="Kebijakan Privasi" onClick={() => {}} />
        </div>
      </ProfileSection>

      {/* Account */}
      <ProfileSection title="Account">
        <ProfileRow icon={<LogOutIcon className="h-4.5 w-4.5" />} label="Keluar" onClick={() => {}} danger />
      </ProfileSection>
    </main>
  );
}
