import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Kayıt Ol",
  canonical: "/kayit",
  follow: true,
});

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
