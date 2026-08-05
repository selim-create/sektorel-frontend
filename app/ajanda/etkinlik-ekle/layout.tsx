import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Etkinlik Ekle",
  canonical: "/ajanda",
  follow: true,
});

export default function EventSubmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
