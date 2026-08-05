import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Şifremi Unuttum",
  canonical: "/sifremi-unuttum",
  follow: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
