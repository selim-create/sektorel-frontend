import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "İş Başvurusu",
    alternates: { canonical: `/kariyer/${slug}` },
    robots: { index: false, follow: false },
  };
}

export default function ApplicationFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
