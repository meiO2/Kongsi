"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import { EyeIcon, EyeOffIcon, SpinnerIcon } from "./icons";
import type { LoginFormData, LoginFormErrors } from "./types";
import { createClient } from "@/utils/supabase/client";

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
interface LoginFormProps {
  onForgotPassword?: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [data, setData] = useState<LoginFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }

  async function handleResetPassword() {
    if (onForgotPassword) {
      onForgotPassword();
      return;
    }

    if (!data.identifier.trim() || !data.identifier.includes("@")) {
      setServerError(
        "Masukkan alamat email yang valid untuk reset kata sandi.",
      );
      return;
    }

    setServerError(null);
    setInfoMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(
      data.identifier.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    );

    if (error) {
      setServerError(error.message);
    } else {
      setInfoMessage("Link reset kata sandi telah dikirim ke email kamu!");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    setInfoMessage(null);

    try {
      const email = data.identifier.trim();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("invalid login credentials") ||
          error.message.toLowerCase().includes("invalid_credentials")
        ) {
          setServerError(
            "Email atau kata sandi tidak cocok. Silakan coba lagi.",
          );
        } else if (
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          setServerError(
            "Email kamu belum dikonfirmasi. Silakan periksa inbox/spam email kamu.",
          );
        } else {
          setServerError(error.message);
        }
        return;
      }

      if (authData.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-2xl border border-[#E14B4B]/30 bg-[#E14B4B]/10 p-4 text-sm text-[#E14B4B]">
          {serverError}
        </div>
      )}

      {infoMessage && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-sm text-emerald-700">
          {infoMessage}
        </div>
      )}

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
        onClick={handleResetPassword}
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
