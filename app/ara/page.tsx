import type { Metadata } from "next";
import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import {
  SEARCH_COMPANIES,
  SEARCH_EVENTS,
  SEARCH_JOBS,
  SEARCH_POSTS,
} from "@/lib/queries";
import { SEARCH_LEADS, SEARCH_SECTORS } from "@/lib/search-extra-queries";
import SearchBar from "@/components/search/SearchBar";
import SearchTabs, { type SearchTabKey } from "@/components/search/SearchTabs";
import SearchResults from "@/components/search/SearchResults";
import SearchSidebar from "@/components/search/SearchSidebar";
import RecentSearches from "@/components/search/RecentSearches";
import type { SearchResultItem } from "@/components/search/SearchCard";

export const revalidate = 30;

type SearchParams = Promise<{ q?: string | string[]; tab?: string | string[] }>;

const VALID_TABS: SearchTabKey[] = [
  "all",
  "companies",
  "sectors",
  "posts",
  "events",
  "leads",
  "jobs",
];

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getActiveTab(value?: string | string[]): SearchTabKey {
  const tab = getSingleValue(value) as SearchTabKey;
  return VALID_TABS.includes(tab) ? tab : "all";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = await searchParams;
  const searchQuery = getSingleValue(q).trim();

  return {
    title: searchQuery ? `"${searchQuery}" araması | Sektörel Ajanda` : "Arama | Sektörel Ajanda",
    description: searchQuery
      ? `"${searchQuery}" için firma, sektör, haber, etkinlik, fırsat ve iş ilanı sonuçları.`
      : "Firma, sektör, haber, etkinlik, fırsat ve iş ilanlarında arama yapın.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

type RawNode = {
  id?: string | null;
  databaseId?: number | null;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  excerpt?: string | null;
  date?: string | null;
  count?: number | null;
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
  leadDetails?: {
    leadType?: string | null;
    status?: string | null;
    budgetString?: string | null;
    expiryDate?: string | null;
    deliveryLocation?: string | null;
    offerCount?: number | null;
  } | null;
  sectors?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  locations?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  categories?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type CollectionData = Record<string, { nodes?: RawNode[] | null } | null | undefined>;

function validNodes(data: unknown, key: string) {
  const collection = (data as CollectionData | null)?.[key];
  return (collection?.nodes ?? []).filter((node): node is RawNode => Boolean(node));
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const searchQuery = getSingleValue(params.q).trim();
  const activeTab = getActiveTab(params.tab);

  if (!searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        <HeroSection searchQuery="" />
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            <Suspense><RecentSearches /></Suspense>
            <div className="border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
              <TrendingUp size={40} className="mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-black text-secondary">Ne aramak istersiniz?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Firma, sektör, haber, etkinlik, fırsat veya iş ilanı arayabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const variables = { variables: { search: searchQuery } };
  const [companiesResult, sectorsResult, postsResult, eventsResult, leadsResult, jobsResult] = await Promise.all([
    queryWithFallback({ query: SEARCH_COMPANIES, ...variables }, { companies: { nodes: [] } }, "search companies"),
    queryWithFallback({ query: SEARCH_SECTORS, ...variables }, { sectors: { nodes: [] } }, "search sectors"),
    queryWithFallback({ query: SEARCH_POSTS, ...variables }, { posts: { nodes: [] } }, "search posts"),
    queryWithFallback({ query: SEARCH_EVENTS, ...variables }, { events: { nodes: [] } }, "search events"),
    queryWithFallback({ query: SEARCH_LEADS, ...variables }, { leads: { nodes: [] } }, "search leads"),
    queryWithFallback({ query: SEARCH_JOBS, ...variables }, { jobs: { nodes: [] } }, "search jobs"),
  ]);

  const allFailed = [companiesResult, sectorsResult, postsResult, eventsResult, leadsResult, jobsResult].every(
    (result) => result.hasError,
  );

  if (allFailed) {
    return (
      <FallbackUI
        actionLabel="Ana sayfaya dön"
        href="/"
        message="Arama servisi geçici olarak erişilemiyor. Lütfen kısa süre sonra tekrar deneyin."
        title="Arama şu anda kullanılamıyor"
      />
    );
  }

  const companyItems: SearchResultItem[] = validNodes(companiesResult.data, "companies")
    .filter((node) => node.id && node.slug)
    .map((node) => ({
      type: "company",
      id: node.id as string,
      title: node.title || "İsimsiz firma",
      slug: node.slug as string,
      sector: node.sectors?.nodes?.[0]?.name ?? null,
      location: node.locations?.nodes?.[0]?.name ?? node.companyDetails?.address ?? null,
      isVerified: node.companyDetails?.isVerified ?? null,
      imageUrl: node.featuredImage?.node?.sourceUrl ?? null,
    }));

  const sectorItems: SearchResultItem[] = validNodes(sectorsResult.data, "sectors")
    .filter((node) => node.slug && (node.id || node.databaseId))
    .map((node) => ({
      type: "sector",
      id: node.id || String(node.databaseId),
      title: node.name || "İsimsiz sektör",
      slug: node.slug as string,
      description: node.description ?? null,
      companyCount: Number(node.count ?? 0),
    }));

  const postItems: SearchResultItem[] = validNodes(postsResult.data, "posts")
    .filter((node) => node.id && node.slug)
    .map((node) => ({
      type: "post",
      id: node.id as string,
      title: node.title || "Başlıksız haber",
      slug: node.slug as string,
      excerpt: node.excerpt ?? null,
      date: node.date ?? null,
      category: node.categories?.nodes?.[0]?.name ?? null,
      imageUrl: node.featuredImage?.node?.sourceUrl ?? null,
    }));

  const eventItems: SearchResultItem[] = validNodes(eventsResult.data, "events")
    .filter((node) => node.id && node.slug)
    .map((node) => ({
      type: "event",
      id: node.id as string,
      title: node.title || "Başlıksız etkinlik",
      slug: node.slug as string,
      eventType: node.eventDetails?.eventType ?? null,
      startDate: node.eventDetails?.startDate ?? null,
      venue: node.eventDetails?.venue ?? null,
      organizer: node.eventDetails?.organizer ?? null,
    }));

  const leadItems: SearchResultItem[] = validNodes(leadsResult.data, "leads")
    .filter((node) => node.id && node.slug)
    .map((node) => ({
      type: "lead",
      id: node.id as string,
      title: node.title || "Başlıksız fırsat",
      slug: node.slug as string,
      leadType: node.leadDetails?.leadType ?? null,
      status: node.leadDetails?.status ?? null,
      budget: node.leadDetails?.budgetString ?? null,
      location: node.leadDetails?.deliveryLocation ?? null,
      sector: node.sectors?.nodes?.[0]?.name ?? null,
      offerCount: Number(node.leadDetails?.offerCount ?? 0),
    }));

  const jobItems: SearchResultItem[] = validNodes(jobsResult.data, "jobs")
    .filter((node) => node.id && node.slug)
    .map((node) => ({
      type: "job",
      id: node.id as string,
      title: node.title || "Başlıksız ilan",
      slug: node.slug as string,
      companyName: node.jobDetails?.companyName ?? null,
      location: node.jobDetails?.location ?? null,
      workType: node.jobDetails?.workType ?? null,
      deadline: node.jobDetails?.deadline ?? null,
    }));

  const groups: Record<Exclude<SearchTabKey, "all">, SearchResultItem[]> = {
    companies: companyItems,
    sectors: sectorItems,
    posts: postItems,
    events: eventItems,
    leads: leadItems,
    jobs: jobItems,
  };

  const allItems = [
    ...companyItems,
    ...sectorItems,
    ...postItems,
    ...eventItems,
    ...leadItems,
    ...jobItems,
  ];

  const counts: Record<SearchTabKey, number> = {
    all: allItems.length,
    companies: companyItems.length,
    sectors: sectorItems.length,
    posts: postItems.length,
    events: eventItems.length,
    leads: leadItems.length,
    jobs: jobItems.length,
  };

  const filteredItems = activeTab === "all" ? allItems : groups[activeTab];
  const partialError = [companiesResult, sectorsResult, postsResult, eventsResult, leadsResult, jobsResult].some(
    (result) => result.hasError,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <HeroSection searchQuery={searchQuery} />
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {partialError ? (
          <div className="mb-6 border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı sonuçlar geçici olarak alınamadı. Sayfa mevcut verilerle gösteriliyor.
          </div>
        ) : null}
        <Suspense><SearchTabs activeTab={activeTab} counts={counts} searchQuery={searchQuery} /></Suspense>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <div className="space-y-6">
            <Suspense><SearchSidebar activeTab={activeTab} searchQuery={searchQuery} /></Suspense>
            <Suspense><RecentSearches /></Suspense>
          </div>
          <SearchResults activeTab={activeTab} items={filteredItems} searchQuery={searchQuery} totalCount={counts[activeTab]} />
        </div>
      </div>
    </div>
  );
}

function HeroSection({ searchQuery }: { searchQuery: string }) {
  return (
    <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-16 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="container relative z-10 mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300">
          <TrendingUp size={12} className="text-primary" /> Global Arama
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">Sektörel Ajanda</h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">Firma, sektör, haber, etkinlik, fırsat ve iş ilanlarını tek noktadan arayın.</p>
        <div className="mt-8"><Suspense><SearchBar defaultValue={searchQuery} /></Suspense></div>
      </div>
    </section>
  );
}
