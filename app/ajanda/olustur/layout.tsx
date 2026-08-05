import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Etkinlik Oluştur",
  canonical: "/ajanda",
  follow: true,
});

export default function EventCreationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
