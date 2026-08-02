import type { Metadata } from "next";
import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import {
  SEARCH_COMPANIES,
  SEARCH_POSTS,
  SEARCH_EVENTS,
  SEARCH_JOBS,
} from "@/lib/queries";
import SearchBar from "@/components/search/SearchBar";
import SearchTabs from "@/components/search/SearchTabs";
import SearchResults from "@/components/search/SearchResults";
import SearchSidebar from "@/components/search/SearchSidebar";
import RecentSearches from "@/components/search/RecentSearches";
import type { SearchResultItem } from "@/components/search/SearchCard";

export const revalidate = 30;

type SearchParams = Promise<{ q?: string; tab?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" araması | Sektörel Ajanda` : "Arama | Sektörel Ajanda",
    description: q
      ? `"${q}" için firmalar, haberler, etkinlikler ve iş ilanlarında arama sonuçları.`
      : "Firmalar, haberler, etkinlikler ve iş ilanlarında arama yapın.",
  };
}

type TabKey = "all" | "companies" | "posts" | "events" | "jobs";

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, tab } = await searchParams;
  const searchQuery = getSingleValue(q).trim();
  const activeTab = (getSingleValue(tab) || "all") as TabKey;

  // Empty state when no query provided
  if (!searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        <HeroSection searchQuery="" />
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            <Suspense>
              <RecentSearches />
            </Suspense>
            <div className="border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
              <TrendingUp size={40} className="mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-black text-secondary">
                Ne aramak istersiniz?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Yukarıdaki arama kutusuna firma adı, haber başlığı, etkinlik veya iş
                ilanı girebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all content types in parallel
  const variables = { variables: { search: searchQuery } };

  const [
    { data: companiesData, hasError: companiesError },
    { data: postsData, hasError: postsError },
    { data: eventsData, hasError: eventsError },
    { data: jobsData, hasError: jobsError },
  ] = await Promise.all([
    queryWithFallback(
      { query: SEARCH_COMPANIES, ...variables },
      { companies: { nodes: [] } },
      "search companies",
    ),
    queryWithFallback(
      { query: SEARCH_POSTS, ...variables },
      { posts: { nodes: [] } },
      "search posts",
    ),
    queryWithFallback(
      { query: SEARCH_EVENTS, ...variables },
      { events: { nodes: [] } },
      "search events",
    ),
    queryWithFallback(
      { query: SEARCH_JOBS, ...variables },
      { jobs: { nodes: [] } },
      "search jobs",
    ),
  ]);

  const hasError = companiesError && postsError && eventsError && jobsError;

  if (hasError) {
    return (
      <FallbackUI
        title="Arama şu anda kullanılamıyor"
        message="Arama servisi geçici olarak erişilemiyor. Lütfen kısa süre sonra tekrar deneyin."
        actionLabel="Ana sayfaya dön"
        href="/"
      />
    );
  }

  // Map raw data to SearchResultItem[]
  type RawNode = {
    id?: string | null;
    slug?: string | null;
    title?: string | null;
    excerpt?: string | null;
    date?: string | null;
    content?: string | null;
    companyDetails?: {
      isVerified?: boolean | null;
      address?: string | null;
    } | null;
    jobDetails?: {
      companyName?: string | null;
      location?: string | null;
      workType?: string | null;
      deadline?: string | null;
    } | null;
    eventDetails?: {
      eventType?: string | null;
      startDate?: string | null;
      venue?: string | null;
      organizer?: string | null;
    } | null;
    sectors?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
    locations?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
    categories?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  };

  type RawCompaniesData = { companies?: { nodes?: RawNode[] | null } | null };
  type RawPostsData = { posts?: { nodes?: RawNode[] | null } | null };
  type RawEventsData = { events?: { nodes?: RawNode[] | null } | null };
  type RawJobsData = { jobs?: { nodes?: RawNode[] | null } | null };

  const companyItems: SearchResultItem[] = (
    (companiesData as RawCompaniesData)?.companies?.nodes ?? []
  )
    .filter((n): n is RawNode & { id: string; slug: string } => Boolean(n?.id && n?.slug))
    .map((n): SearchResultItem => ({
      type: "company",
      id: n.id,
      title: n.title || "İsimsiz firma",
      slug: n.slug,
      sector: n.sectors?.nodes?.[0]?.name ?? null,
      location:
        n.locations?.nodes?.[0]?.name ?? n.companyDetails?.address ?? null,
      isVerified: n.companyDetails?.isVerified ?? null,
      imageUrl: n.featuredImage?.node?.sourceUrl ?? null,
    }));

  const postItems: SearchResultItem[] = (
    (postsData as RawPostsData)?.posts?.nodes ?? []
  )
    .filter((n): n is RawNode & { id: string; slug: string } => Boolean(n?.id && n?.slug))
    .map((n): SearchResultItem => ({
      type: "post",
      id: n.id,
      title: n.title || "Başlıksız haber",
      slug: n.slug,
      excerpt: n.excerpt ?? null,
      date: n.date ?? null,
      category: n.categories?.nodes?.[0]?.name ?? null,
      imageUrl: n.featuredImage?.node?.sourceUrl ?? null,
    }));

  const eventItems: SearchResultItem[] = (
    (eventsData as RawEventsData)?.events?.nodes ?? []
  )
    .filter((n): n is RawNode & { id: string; slug: string } => Boolean(n?.id && n?.slug))
    .map((n): SearchResultItem => ({
      type: "event",
      id: n.id,
      title: n.title || "Başlıksız etkinlik",
      slug: n.slug,
      eventType: n.eventDetails?.eventType ?? null,
      startDate: n.eventDetails?.startDate ?? null,
      venue: n.eventDetails?.venue ?? null,
      organizer: n.eventDetails?.organizer ?? null,
    }));

  const jobItems: SearchResultItem[] = (
    (jobsData as RawJobsData)?.jobs?.nodes ?? []
  )
    .filter((n): n is RawNode & { id: string; slug: string } => Boolean(n?.id && n?.slug))
    .map((n): SearchResultItem => ({
      type: "job",
      id: n.id,
      title: n.title || "Başlıksız ilan",
      slug: n.slug,
      companyName: n.jobDetails?.companyName ?? null,
      location: n.jobDetails?.location ?? null,
      workType: n.jobDetails?.workType ?? null,
      deadline: n.jobDetails?.deadline ?? null,
    }));

  const counts = {
    all: companyItems.length + postItems.length + eventItems.length + jobItems.length,
    companies: companyItems.length,
    posts: postItems.length,
    events: eventItems.length,
    jobs: jobItems.length,
  };

  // Filter by active tab
  const filteredItems: SearchResultItem[] =
    activeTab === "all"
      ? [...companyItems, ...postItems, ...eventItems, ...jobItems]
      : activeTab === "companies"
      ? companyItems
      : activeTab === "posts"
      ? postItems
      : activeTab === "events"
      ? eventItems
      : jobItems;

  const partialError =
    companiesError || postsError || eventsError || jobsError;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <HeroSection searchQuery={searchQuery} />

      <div className="container mx-auto max-w-6xl px-4 py-10">
        {partialError && (
          <div className="mb-6 border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı sonuçlar geçici olarak alınamadı. Sayfa mevcut verilerle gösteriliyor.
          </div>
        )}

        <Suspense>
          <SearchTabs
            activeTab={activeTab}
            counts={counts}
            searchQuery={searchQuery}
          />
        </Suspense>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <Suspense>
              <SearchSidebar searchQuery={searchQuery} activeTab={activeTab} />
            </Suspense>
            <Suspense>
              <RecentSearches />
            </Suspense>
          </div>

          {/* Results */}
          <SearchResults
            items={filteredItems}
            activeTab={activeTab}
            searchQuery={searchQuery}
            totalCount={counts[activeTab]}
          />
        </div>
      </div>
    </div>
  );
}

function HeroSection({ searchQuery }: { searchQuery: string }) {
  return (
    <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-16 text-white">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container relative z-10 mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300">
          <TrendingUp size={12} className="text-primary" />
          Global Arama
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
          Sektörel Ajanda
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          Firmalar, haberler, etkinlikler ve daha fazlasını ara.
        </p>
        <div className="mt-8">
          <Suspense>
            <SearchBar defaultValue={searchQuery} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}