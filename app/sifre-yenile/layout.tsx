import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Şifre Yenile",
  canonical: "/sifre-yenile",
  follow: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
