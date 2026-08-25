import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsTaxonomyArchiveView from "@/components/news/NewsTaxonomyArchive";
import { getNewsCategoryArchive } from "@/lib/news-taxonomy";
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
  const { archive } = await getNewsCategoryArchive(slug);
  const canonical = `/haberler/kategori/${encodeURIComponent(slug)}`;

  if (!archive) {
    return { title: "Haber Kategorisi", robots: { index: false, follow: true } };
  }

  const name = archive.name?.trim() || slug;
  const description =
    archive.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
    `${name} kategorisindeki güncel sektörel haberler ve gelişmeler.`;

  const metadata = applyRankMathMetadata(
    {
      title: `${name} Haberleri`,
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const after = getAfter((await searchParams).after).trim();
  const { archive, hasError } = await getNewsCategoryArchive(slug, after);

  if (!archive) notFound();

  return (
    <NewsTaxonomyArchiveView
      after={after || undefined}
      archive={archive}
      archiveType="category"
      hasError={hasError}
    />
  );
}
