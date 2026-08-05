import type { Metadata } from "next";

const title = "Firmalar Haritası";
const description =
  "Türkiye genelindeki firmaları interaktif harita üzerinde keşfedin; sektör ve şehir filtreleriyle aramanızı daraltın.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/harita" },
  openGraph: {
    type: "website",
    url: "/harita",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
