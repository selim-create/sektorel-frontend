import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsTaxonomyArchiveView from "@/components/news/NewsTaxonomyArchive";
import { getNewsTagArchive } from "@/lib/news-taxonomy";
import { applyRankMathMetadata } from "@/lib/rank-math-seo";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string | string[] }>;
};

function getAfter(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const after = getAfter((await searchParams).after).trim();
  const { archive } = await getNewsTagArchive(slug);
  const canonical = `/haberler/etiket/${encodeURIComponent(slug)}`;

  if (!archive) {
    return { title: "Haber Etiketi", robots: { index: false, follow: true } };
  }

  const name = archive.name?.trim() || slug;
  const description =
    archive.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
    `${name} etiketiyle yayınlanan güncel sektörel haberler.`;

  const metadata = applyRankMathMetadata(
    {
      title: `${name} Etiketli Haberler`,
      description,
      alternates: { canonical },
    },
    archive.sektorelSeo,
  );

  if (!after) return metadata;

  return {
    ...metadata,
    alternates: { ...(metadata.alternates ?? {}), canonical },
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const after = getAfter((await searchParams).after).trim();
  const { archive, hasError } = await getNewsTagArchive(slug, after);

  if (!archive) notFound();

  return (
    <NewsTaxonomyArchiveView
      after={after || undefined}
      archive={archive}
      archiveType="tag"
      hasError={hasError}
    />
  );
}
