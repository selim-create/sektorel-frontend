import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Arama",
  canonical: "/ara",
  follow: true,
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
