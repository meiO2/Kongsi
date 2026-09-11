"use client";

import Image from "next/image";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F1EFEF]">
      {/* Brand panel */}
      <div
        className="
          flex h-screen w-full shrink-0 items-center justify-center
          bg-[#3991FA]
          px-[8%] py-12
          md:w-[44%] md:px-[7%] md:py-0
        "
      >
        <div className="w-full">
          <Image
            src="/logo.png"
            alt="Kongsi!"
            width={260}
            height={127}
            className="
              h-auto
              w-[clamp(180px,25vw,500px)]
            "
            priority
          />

          <p
            className="
              max-w-[90%]
              text-[clamp(16px,4vw,35px)]
              font-bold
              leading-[1.2]
              text-white
            "
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kongsi bareng, hemat bareng!
          </p>

        </div>
      </div>

      {/* Form panel */}
      <div
        className="
          flex h-screen w-full flex-1
          items-center justify-center
          overflow-y-auto
          px-5 py-10
          sm:px-8
        "
      >
        <div className="w-full max-w-[420px]">
          <div className="mb-7 flex flex-col gap-1.5">
            <h1
              className="text-[26px] font-bold text-[#292828]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {mode === "login"
                ? "Selamat datang lagi!"
                : "Yuk, gabung Kongsi!"}
            </h1>
            <p className="text-[15px] text-[#7A7876]">
              {mode === "login"
                ? "Masuk untuk lanjut belanja atau kelola usahamu."
                : "Buat akun dalam waktu kurang dari semenit."}
            </p>
          </div>

          {/* Pill switch between Login and Sign up */}
          <div className="mb-7 flex rounded-2xl bg-[#E4E1DF]/50 p-1">
            {(
              [
                { key: "login", label: "Masuk" },
                { key: "signup", label: "Daftar" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={[
                  "flex-1 rounded-xl py-2.5 text-[15px] font-semibold transition-all",
                  mode === tab.key
                    ? "bg-white text-[#3991FA] shadow-[0_1px_4px_rgba(41,40,40,0.08)]"
                    : "text-[#7A7876] hover:text-[#292828]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <LoginForm
              onForgotPassword={() =>
                console.log("[Kongsi] Forgot password clicked (placeholder)")
              }
            />
          ) : (
            <SignUpForm />
          )}

          <p className="mt-6 text-center text-sm text-[#7A7876]">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-[#3991FA] hover:underline"
                >
                  Daftar sekarang
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-[#3991FA] hover:underline"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
