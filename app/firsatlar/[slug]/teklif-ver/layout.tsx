import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Teklif Ver",
    alternates: { canonical: `/firsatlar/${slug}` },
    robots: { index: false, follow: false },
  };
}

export default function OfferFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
