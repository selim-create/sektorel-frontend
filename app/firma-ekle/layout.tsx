import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Firma Ekle",
  canonical: "/firmalar",
  follow: true,
});

export default function CompanySubmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
