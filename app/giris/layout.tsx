import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Giriş Yap",
  canonical: "/giris",
  follow: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
