import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Kongsi!",
  description: "Belanja bareng, lebih hemat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${baloo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}