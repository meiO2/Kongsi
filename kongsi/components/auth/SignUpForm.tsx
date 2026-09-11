    "use client";

    import { useState } from "react";
    import FormField from "./FormField";
    import RoleToggle from "./RoleToggle";
    import { EyeIcon, EyeOffIcon, SpinnerIcon } from "./icons";
    import {
    BUSINESS_CATEGORIES,
    type SignUpFormData,
    type SignUpFormErrors,
    } from "./types";

    const INITIAL_DATA: SignUpFormData = {
    name: "",
    email: "",
    phone: "",
    password: "",
    accountType: "customer",
    businessName: "",
    businessCategory: "",
    businessAddress: "",
    };

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_PATTERN = /^[0-9+()\s-]{9,15}$/;

    function validate(data: SignUpFormData): SignUpFormErrors {
    const errors: SignUpFormErrors = {};

    if (!data.name.trim()) {
        errors.name = "Masukkan nama lengkap kamu";
    }

    if (!data.email.trim()) {
        errors.email = "Masukkan alamat email kamu";
    } else if (!EMAIL_PATTERN.test(data.email)) {
        errors.email = "Format email belum benar";
    }

    if (!data.phone.trim()) {
        errors.phone = "Masukkan nomor HP kamu";
    } else if (!PHONE_PATTERN.test(data.phone)) {
        errors.phone = "Format nomor HP belum benar";
    }

    if (!data.password) {
        errors.password = "Buat kata sandi";
    } else if (data.password.length < 6) {
        errors.password = "Kata sandi minimal 6 karakter";
    }

    if (data.accountType === "umkm") {
        if (!data.businessName.trim()) {
        errors.businessName = "Masukkan nama usaha kamu";
        }
        if (!data.businessCategory) {
        errors.businessCategory = "Pilih kategori usaha";
        }
        if (!data.businessAddress.trim()) {
        errors.businessAddress = "Masukkan alamat usaha kamu";
        }
    }

    return errors;
    }

    // Placeholder submit handler — wire this up to real registration later.
    function handleSubmit(data: SignUpFormData) {
    console.log("[Kongsi] Sign up submitted (placeholder):", data);
    }

    export default function SignUpForm() {
    const [data, setData] = useState<SignUpFormData>(INITIAL_DATA);
    const [errors, setErrors] = useState<SignUpFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField<K extends keyof SignUpFormData>(
        field: K,
        value: SignUpFormData[K]
    ) {
        setData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function onAccountTypeChange(accountType: SignUpFormData["accountType"]) {
        setData((prev) => ({ ...prev, accountType }));
        // Clear any UMKM-only errors when switching back to Customer.
        if (accountType === "customer") {
        setErrors((prev) => ({
            ...prev,
            businessName: undefined,
            businessCategory: undefined,
            businessAddress: undefined,
        }));
        }
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate(data);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        setTimeout(() => {
        handleSubmit(data);
        setIsSubmitting(false);
        }, 900);
    }

    const isUmkm = data.accountType === "umkm";

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField
            label="Nama Lengkap"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Nama kamu"
            value={data.name}
            error={errors.name}
            onChange={(e) => updateField("name", e.target.value)}
        />

        <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={data.email}
            error={errors.email}
            onChange={(e) => updateField("email", e.target.value)}
        />

        <FormField
            label="Nomor HP"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="08123456789"
            value={data.phone}
            error={errors.phone}
            onChange={(e) => updateField("phone", e.target.value)}
        />

        <FormField
            label="Kata Sandi"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            value={data.password}
            error={errors.password}
            onChange={(e) => updateField("password", e.target.value)}
            rightElement={
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[#7A7876] transition-colors hover:text-[#292828]"
                aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
            >
                {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
                ) : (
                <EyeIcon className="h-5 w-5" />
                )}
            </button>
            }
        />

        <RoleToggle value={data.accountType} onChange={onAccountTypeChange} />

        <div
            className={[
            "grid overflow-hidden transition-all duration-300 ease-out",
            isUmkm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
        >
            <div className="min-h-0">
            <div className="flex flex-col gap-5 rounded-2xl border border-dashed border-[#3991FA]/30 bg-[#3991FA]/[0.04] p-4">
                <p className="text-sm font-medium text-[#3991FA]">
                Ceritakan tentang usahamu
                </p>

                <FormField
                label="Nama Usaha"
                name="businessName"
                type="text"
                placeholder="Contoh: Warung Bu Sari"
                value={data.businessName}
                error={errors.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="businessCategory"
                    className="text-sm font-medium text-[#292828]"
                >
                    Kategori Usaha
                </label>
                <select
                    id="businessCategory"
                    name="businessCategory"
                    value={data.businessCategory}
                    onChange={(e) =>
                    updateField("businessCategory", e.target.value)
                    }
                    className={[
                    "w-full appearance-none rounded-2xl border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%237A7876%27 stroke-width=%272%27><path d=%27M6 9l6 6 6-6%27/></svg>')] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-[15px] text-[#292828] outline-none transition-colors",
                    "focus:border-[#3991FA] focus:ring-4 focus:ring-[#3991FA]/15",
                    data.businessCategory === "" ? "text-[#B3B0AE]" : "",
                    errors.businessCategory
                        ? "border-[#E14B4B] focus:border-[#E14B4B] focus:ring-[#E14B4B]/15"
                        : "border-[#E4E1DF]",
                    ].join(" ")}
                >
                    <option value="" disabled>
                    Pilih kategori
                    </option>
                    {BUSINESS_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                    ))}
                </select>
                {errors.businessCategory && (
                    <p className="text-sm text-[#E14B4B]">
                    {errors.businessCategory}
                    </p>
                )}
                </div>

                <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="businessAddress"
                    className="text-sm font-medium text-[#292828]"
                >
                    Alamat Usaha
                </label>
                <textarea
                    id="businessAddress"
                    name="businessAddress"
                    rows={2}
                    placeholder="Jalan, nomor, kelurahan, kota"
                    value={data.businessAddress}
                    onChange={(e) =>
                    updateField("businessAddress", e.target.value)
                    }
                    className={[
                    "w-full resize-none rounded-2xl border bg-white px-4 py-3 text-[15px] text-[#292828]",
                    "placeholder:text-[#B3B0AE] outline-none transition-colors",
                    "focus:border-[#3991FA] focus:ring-4 focus:ring-[#3991FA]/15",
                    errors.businessAddress
                        ? "border-[#E14B4B] focus:border-[#E14B4B] focus:ring-[#E14B4B]/15"
                        : "border-[#E4E1DF]",
                    ].join(" ")}
                />
                {errors.businessAddress && (
                    <p className="text-sm text-[#E14B4B]">
                    {errors.businessAddress}
                    </p>
                )}
                </div>
            </div>
            </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[#3991FA] px-4 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#2B7FE0] disabled:cursor-not-allowed disabled:opacity-70"
        >
            {isSubmitting && <SpinnerIcon className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Memproses..." : "Buat Akun"}
        </button>
        </form>
    );
    }