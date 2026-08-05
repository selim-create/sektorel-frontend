import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Fırsat Oluştur",
  canonical: "/firsatlar",
  follow: true,
});

export default function OpportunityCreationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
