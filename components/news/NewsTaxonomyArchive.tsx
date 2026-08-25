import Link from "next/link";
import { ArrowLeft, ArrowRight, Hash, Layers } from "lucide-react";
import NewsCard from "@/components/cards/NewsCard";
import FallbackUI from "@/components/error/FallbackUI";
import type { NewsTaxonomyArchive } from "@/lib/news-taxonomy";

type NewsTaxonomyArchiveProps = {
  archive: NewsTaxonomyArchive;
  archiveType: "category" | "tag";
  after?: string;
  hasError?: boolean;
};

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function NewsTaxonomyArchiveView({
  archive,
  archiveType,
  after,
  hasError = false,
}: NewsTaxonomyArchiveProps) {
  const slug = archive.slug?.trim() || "";
  const name = archive.name?.trim() || slug;
  const posts = (archive.posts?.nodes ?? []).filter(
    (post): post is NonNullable<typeof post> => Boolean(post?.id && post.slug?.trim()),
  );
  const pageInfo = archive.posts?.pageInfo;
  const basePath =
    archiveType === "category"
      ? `/haberler/kategori/${encodeURIComponent(slug)}`
      : `/haberler/etiket/${encodeURIComponent(slug)}`;
  const icon = archiveType === "category" ? <Layers size={18} /> : <Hash size={18} />;
  const eyebrow = archiveType === "category" ? "Haber Kategorisi" : "Haber Etiketi";
  const description =
    stripHtml(archive.description) ||
    (archiveType === "category"
      ? `${name} kategorisindeki güncel sektörel haberler ve gelişmeler.`
      : `${name} etiketiyle yayınlanan güncel sektörel haberler.`);

  if (hasError && posts.length === 0) {
    return (
      <FallbackUI
        actionLabel="Tüm haberlere dön"
        href="/haberler"
        message="Bu haber arşivi şu anda yüklenemiyor. Lütfen kısa süre sonra tekrar deneyin."
        title="Haber arşivi alınamadı"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="border-b border-gray-800 bg-secondary px-4 py-14 text-white">
        <div className="container mx-auto">
          <Link
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white"
            href="/haberler"
          >
            <ArrowLeft size={13} /> Tüm Haberlere Dön
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-gray-300">
            {icon} {eyebrow}
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">{name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">{description}</p>
          {typeof archive.count === "number" ? (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {archive.count} haber
            </p>
          ) : null}
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {hasError ? (
          <div className="mb-8 border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Arşiv verilerinin bir bölümü geçici olarak alınamadı. Mevcut içerikler gösteriliyor.
          </div>
        ) : null}

        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black text-secondary">Henüz haber yok</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Bu arşivde yayınlanmış bir haber bulunmuyor.
            </p>
          </div>
        )}

        {after || pageInfo?.hasNextPage ? (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-8">
            {after ? (
              <Link
                className="inline-flex items-center gap-2 border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
                href={basePath}
              >
                <ArrowLeft size={14} /> İlk Sayfa
              </Link>
            ) : null}
            {pageInfo?.hasNextPage && pageInfo.endCursor ? (
              <Link
                className="inline-flex items-center gap-2 bg-secondary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary"
                href={`${basePath}?after=${encodeURIComponent(pageInfo.endCursor)}`}
              >
                Daha Fazla Yükle <ArrowRight size={14} />
              </Link>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}
