import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Search, TrendingUp, User } from "lucide-react";
import FallbackUI from "@/components/error/FallbackUI";
import NewsCard from "@/components/cards/NewsCard";
import NewsFilter from "@/components/filters/NewsFilter";
import NewsPagination from "@/components/filters/NewsPagination";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_POSTS } from "@/lib/queries";

type SearchParams = Promise<{
  after?: string | string[];
  category?: string | string[];
  q?: string | string[];
  range?: string | string[];
  sort?: string | string[];
}>;

type Post = {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

type Category = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
};

export const metadata: Metadata = {
  title: "Sektörel Haberler | Sektörel Ajanda",
  description:
    "Sektörel Haberler sayfasında en güncel iş dünyası haberlerini, sektör gelişmelerini ve şirket gündemini filtreleyerek keşfedin.",
};

export const revalidate = 60;

const EMPTY_DATA = {
  posts: {
    nodes: [] as Post[],
    pageInfo: {
      endCursor: null as string | null,
      hasNextPage: false,
    },
  },
  categories: {
    nodes: [] as Category[],
  },
};

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value?: string | null) {
  if (!value) return "Tarih belirtilmedi";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih belirtilmedi";

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function matchesDateRange(postDate?: string | null, range = "all") {
  if (range === "all" || !postDate) {
    return true;
  }

  const date = new Date(postDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  const threshold = new Date(now);

  if (range === "week") {
    threshold.setDate(now.getDate() - 7);
    return date >= threshold;
  }

  if (range === "month") {
    threshold.setMonth(now.getMonth() - 1);
    return date >= threshold;
  }

  if (range === "year") {
    threshold.setFullYear(now.getFullYear() - 1);
    return date >= threshold;
  }

  return true;
}

function getPopularityScore(post: Post) {
  const contentLength = stripHtml(post.content).length;
  const excerptLength = stripHtml(post.excerpt).length;
  const categoryCount = post.categories?.nodes?.filter(Boolean).length ?? 0;
  const publishTime = post.date ? new Date(post.date).getTime() : 0;

  return contentLength + excerptLength + categoryCount * 25 + publishTime / 1_000_000_000;
}

function sortPosts(posts: Post[], sort: string) {
  return [...posts].sort((left, right) => {
    if (sort === "oldest") {
      return new Date(left.date ?? 0).getTime() - new Date(right.date ?? 0).getTime();
    }

    if (sort === "views") {
      return getPopularityScore(right) - getPopularityScore(left);
    }

    return new Date(right.date ?? 0).getTime() - new Date(left.date ?? 0).getTime();
  });
}

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = getSingleValue(resolvedSearchParams.category) || "all";
  const range = getSingleValue(resolvedSearchParams.range) || "all";
  const sort = getSingleValue(resolvedSearchParams.sort) || "newest";
  const q = getSingleValue(resolvedSearchParams.q).trim();
  const after = getSingleValue(resolvedSearchParams.after).trim();

  const { data, hasError } = await queryWithFallback(
    {
      query: GET_ALL_POSTS,
      variables: after ? { after } : undefined,
    },
    EMPTY_DATA,
    "news listing",
  );

  const posts = (data?.posts?.nodes ?? []).filter(
    (post): post is Post => Boolean(post?.id && post.slug?.trim()),
  );
  const categories = (data?.categories?.nodes ?? []).filter(
    (item): item is Category => Boolean(item?.slug && item?.name),
  );

  const normalizedQuery = q.toLocaleLowerCase("tr-TR");
  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      category === "all" ||
      (post.categories?.nodes ?? []).some((item) => item?.slug === category);

    const dateMatch = matchesDateRange(post.date, range);

    const searchableText = [
      post.title,
      post.excerpt,
      post.content,
      post.author?.node?.name,
      ...(post.categories?.nodes ?? []).map((item) => item?.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr-TR");

    const searchMatch = !normalizedQuery || searchableText.includes(normalizedQuery);

    return categoryMatch && dateMatch && searchMatch;
  });

  const sortedPosts = sortPosts(filteredPosts, sort);
  const [featuredPost, ...remainingPosts] = sortedPosts;

  if (hasError && posts.length === 0) {
    return (
      <FallbackUI
        actionLabel="Ana sayfaya dön"
        href="/"
        message="Haber akışı şu anda yüklenemiyor. Lütfen kısa süre sonra tekrar deneyin."
        title="Sektörel haberler alınamadı"
      />
    );
  }

  const currentParams = {
    ...(category !== "all" ? { category } : {}),
    ...(range !== "all" ? { range } : {}),
    ...(sort !== "newest" ? { sort } : {}),
    ...(q ? { q } : {}),
    ...(after ? { after } : {}),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-16 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300">
              <TrendingUp size={12} className="text-primary" />
              Güncel sektör akışı
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
              Sektörel Haberler
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              İş dünyasındaki gelişmeleri, şirket duyurularını ve sektör odaklı analizleri
              filtreleyerek tek sayfada takip edin.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-10 px-4 py-10">
        {hasError ? (
          <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı haber verileri geçici olarak alınamadı. Sayfa mevcut içeriklerle gösteriliyor.
          </div>
        ) : null}

        <NewsFilter
          categories={categories}
          searchQuery={q}
          selectedCategory={category}
          selectedRange={range}
          selectedSort={sort}
        />

        {featuredPost ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
            <article className="group overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl">
              <div className="grid h-full md:grid-cols-2">
                <Link
                  className="relative block min-h-[280px] overflow-hidden bg-gray-100"
                  href={`/haber/${featuredPost.slug}`}
                >
                  <Image
                    alt={featuredPost.title || "Öne çıkan haber"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    src={
                      featuredPost.featuredImage?.node?.sourceUrl ||
                      `https://placehold.co/1200x900/111827/ffffff?text=${encodeURIComponent(
                        featuredPost.title || "Sektörel Haber",
                      )}`
                    }
                  />
                </Link>

                <div className="flex flex-col justify-between p-8">
                  <div>
                    <span className="inline-flex bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                      Öne çıkan haber
                    </span>
                    <h2 className="mt-5 text-3xl font-black leading-tight text-secondary">
                      <Link className="transition-colors hover:text-primary" href={`/haber/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {formatDate(featuredPost.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User size={12} /> {featuredPost.author?.node?.name || "Editör"}
                      </span>
                    </div>
                    <p className="mt-6 text-sm leading-7 text-gray-600">
                      {stripHtml(featuredPost.excerpt || featuredPost.content).slice(0, 240) ||
                        "Bu haber için özet içerik henüz paylaşılmadı."}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                    <div className="flex flex-wrap gap-2">
                      {(featuredPost.categories?.nodes ?? [])
                        .filter((item): item is NonNullable<typeof item> => Boolean(item?.name && item?.slug))
                        .slice(0, 3)
                        .map((item) => (
                          <Link
                            className="bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:bg-primary hover:text-white"
                            href={`/haberler?category=${encodeURIComponent(item.slug ?? "")}`}
                            key={item.id ?? item.slug}
                          >
                            {item.name}
                          </Link>
                        ))}
                    </div>

                    <Link
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:text-primary"
                      href={`/haber/${featuredPost.slug}`}
                    >
                      Oku Devam Et
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="space-y-4 border border-gray-200 bg-white p-6 shadow-sm">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Arama</p>
                <h2 className="mt-2 text-xl font-black text-secondary">Global aramaya geçin</h2>
              </div>

              <div className="rounded-none border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <Search size={16} className="text-primary" />
                  {q ? `“${q}” için sonuçlar daraltıldı.` : "Belirli şirketleri ve haberleri tüm sitede arayın."}
                </div>

                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:text-primary"
                  href={q ? `/ara?q=${encodeURIComponent(q)}` : "/ara"}
                >
                  Global aramayı aç
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="rounded-none border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                  Sonuç özeti
                </p>
                <p className="mt-3 text-3xl font-black text-secondary">{sortedPosts.length}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Seçili filtrelerle eşleşen haber sayısı. Daha fazla içerik için sayfanın altındaki
                  yükleme bağlantısını kullanabilirsiniz.
                </p>
              </div>
            </aside>
          </section>
        ) : (
          <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black text-secondary">Sonuç bulunamadı</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Seçtiğiniz kategori, tarih aralığı veya arama kriterine uygun haber bulunamadı.
              Farklı filtreler deneyebilir ya da tüm haber akışına geri dönebilirsiniz.
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
              href="/haberler"
            >
              Tüm Haberleri Göster
              <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {remainingPosts.length ? (
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Haber Akışı</p>
                <h2 className="mt-2 text-2xl font-black text-secondary">En güncel gelişmeler</h2>
              </div>
              <p className="text-sm text-gray-500">
                Masaüstünde 3, tablette 2 ve mobilde 1 sütunlu akışla okunur deneyim.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : null}

        <NewsPagination
          currentAfter={after}
          currentParams={currentParams}
          hasNextPage={data?.posts?.pageInfo?.hasNextPage}
          nextAfter={data?.posts?.pageInfo?.endCursor}
        />
      </div>
    </div>
  );
}
