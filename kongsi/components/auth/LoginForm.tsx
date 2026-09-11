    "use client";

    import { useState } from "react";
    import FormField from "./FormField";
    import { EyeIcon, EyeOffIcon, SpinnerIcon } from "./icons";
    import type { LoginFormData, LoginFormErrors } from "./types";

    const INITIAL_DATA: LoginFormData = {
    identifier: "",
    password: "",
    };

    function validate(data: LoginFormData): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (!data.identifier.trim()) {
        errors.identifier = "Masukkan email atau nomor HP kamu";
    }

    if (!data.password) {
        errors.password = "Masukkan kata sandi kamu";
    } else if (data.password.length < 6) {
        errors.password = "Kata sandi minimal 6 karakter";
    }

    return errors;
    }

    // Placeholder submit handler — wire this up to real auth later.
    function handleSubmit(data: LoginFormData) {
    console.log("[Kongsi] Login submitted (placeholder):", data);
    }

    interface LoginFormProps {
    onForgotPassword?: () => void;
    }

    export default function LoginForm({ onForgotPassword }: LoginFormProps) {
    const [data, setData] = useState<LoginFormData>(INITIAL_DATA);
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField<K extends keyof LoginFormData>(
        field: K,
        value: LoginFormData[K]
    ) {
        setData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate(data);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);
        // Simulated latency so the loading state is visible; replace with a real request later.
        setTimeout(() => {
        handleSubmit(data);
        setIsSubmitting(false);
        }, 900);
    }

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField
            label="Email atau Nomor HP"
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="nama@email.com atau 08123456789"
            value={data.identifier}
            error={errors.identifier}
            onChange={(e) => updateField("identifier", e.target.value)}
        />

        <FormField
            label="Kata Sandi"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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

        <button
            type="button"
            onClick={onForgotPassword}
            className="-mt-2 self-end text-sm font-medium text-[#3991FA] hover:underline"
        >
            Lupa kata sandi?
        </button>

        <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[#3991FA] px-4 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#2B7FE0] disabled:cursor-not-allowed disabled:opacity-70"
        >
            {isSubmitting && <SpinnerIcon className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
        </form>
    );
    }