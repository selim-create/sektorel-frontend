import type { Metadata } from "next";

const title = "Hakkımızda";
const description =
  "Sektörel Ajanda'nın Türkiye iş dünyasını firmalar, sektörler, fırsatlar ve bilgiyle buluşturan dijital platform yaklaşımını keşfedin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    type: "website",
    url: "/hakkimizda",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
