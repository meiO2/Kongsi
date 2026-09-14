"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Profile = { businessName: string; category: string; contact: string; description: string; location: string; email: string; verificationStatus: string; verificationDocumentUrl: string };
const EMPTY: Profile = { businessName: "", category: "", contact: "", description: "", location: "", email: "", verificationStatus: "PENDING", verificationDocumentUrl: "" };

export default function UmkmProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(EMPTY);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetch("/api/umkm/profile").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Profil gagal dimuat.");
      setProfile({ businessName: data.business_name, category: data.category ?? "", contact: data.contact ?? "", description: data.description ?? "", location: data.location ?? "", email: data.email, verificationStatus: data.verification_status, verificationDocumentUrl: data.verification_document_url ?? "" });
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Profil gagal dimuat."));
  }, []);
  const update = (key: keyof Profile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(null);
    const response = await fetch("/api/umkm/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    const result = await response.json();
    setMessage(response.ok ? "Profil usaha berhasil disimpan." : result.error ?? "Profil gagal disimpan."); setSaving(false);
  }
  async function logout() { await createClient().auth.signOut(); router.push("/login"); router.refresh(); }
  return <main className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pb-20 pt-8 sm:px-6"><div><h1 className="text-2xl font-bold text-[#292828]">Profil Usaha</h1><p className="mt-1 text-sm text-[#7A7876]">Status verifikasi: {profile.verificationStatus}</p></div><form onSubmit={save} className="flex flex-col gap-4 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">{([['businessName','Nama usaha'],['category','Kategori usaha'],['contact','Nomor HP'],['location','Alamat usaha']] as const).map(([key,label]) => <label key={key} className="flex flex-col gap-1.5 text-sm font-semibold text-[#292828]">{label}<input value={profile[key]} onChange={(event) => update(key,event.target.value)} className="rounded-xl border border-[#E4E1DF] px-4 py-3 font-normal outline-none focus:border-[#3991FA]" /></label>)}<label className="flex flex-col gap-1.5 text-sm font-semibold text-[#292828]">Email<input value={profile.email} disabled className="rounded-xl border border-[#E4E1DF] bg-[#F7F7F6] px-4 py-3 font-normal" /></label><label className="flex flex-col gap-1.5 text-sm font-semibold text-[#292828]">Dokumen pendukung<input type="url" value={profile.verificationDocumentUrl} onChange={(event) => update('verificationDocumentUrl',event.target.value)} placeholder="Tautan NIB atau izin usaha" className="rounded-xl border border-[#E4E1DF] px-4 py-3 font-normal outline-none focus:border-[#3991FA]" /></label><label className="flex flex-col gap-1.5 text-sm font-semibold text-[#292828]">Deskripsi<textarea rows={4} value={profile.description} onChange={(event) => update('description',event.target.value)} className="rounded-xl border border-[#E4E1DF] px-4 py-3 font-normal outline-none focus:border-[#3991FA]" /></label>{message && <p className="text-sm text-[#7A7876]">{message}</p>}<button disabled={saving} className="rounded-xl bg-[#3991FA] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Profil"}</button></form><button type="button" onClick={logout} className="rounded-xl border border-[#E14B4B]/30 px-4 py-3 text-sm font-semibold text-[#E14B4B]">Keluar</button></main>;
}
