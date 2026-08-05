import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "İş İlanı Ver",
  canonical: "/kariyer",
  follow: true,
});

export default function JobSubmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
