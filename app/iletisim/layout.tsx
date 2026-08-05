import type { Metadata } from "next";

const title = "İletişim";
const description = "Sektörel Ajanda ile sorularınız, önerileriniz, firma kayıtları ve iş birliği talepleriniz için iletişime geçin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/iletisim" },
  openGraph: {
    type: "website",
    url: "/iletisim",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
