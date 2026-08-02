import type { Metadata } from "next";
import { Building2, Star } from "lucide-react";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanyGrid from "@/components/companies/CompanyGrid";
import CompanyPagination from "@/components/companies/CompanyPagination";
import CompanySearch from "@/components/companies/CompanySearch";
import CompanySort from "@/components/companies/CompanySort";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_LOCATIONS, GET_COMPANIES_PAGINATED } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Firma Rehberi | Sektörel Ajanda",
  description:
    "Sektör ve şehir filtresiyle firmaları keşfedin, onaylı şirketleri öne çıkaran firma listesine göz atın.",
};

export const revalidate = 60;

type SearchParams = Promise<{
  after?: string | string[];
  location?: string | string[];
  q?: string | string[];
  sector?: string | string[];
  sort?: string | string[];
  verified?: string | string[];
}>;

type TaxonomyNode = {
  name?: string | null;
  slug?: string | null;
};

type Company = {
  id: string;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  date?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    mapLat?: string | null;
    mapLng?: string | null;
    coverImage?: string | null;
    website?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  sectors?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
  locations?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
};

type QueryData = {
  companies: {
    nodes: Company[];
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
  };
};

type LocationsData = {
  locations: {
    nodes: Array<{
      id?: string | null;
      name?: string | null;
      slug?: string | null;
      count?: number | null;
    } | null>;
  };
};

const EMPTY_DATA: QueryData = {
  companies: {
    nodes: [],
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
    },
  },
};

const EMPTY_LOCATIONS: LocationsData = {
  locations: {
    nodes: [],
  },
};

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getFilterOptions(companies: Company[], key: "sectors" | "locations") {
  const map = new Map<string, { slug: string; name: string; count: number }>();

  companies.forEach((company) => {
    (company[key]?.nodes ?? []).forEach((node) => {
      if (!node?.slug || !node.name) {
        return;
      }

      const existing = map.get(node.slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(node.slug, { slug: node.slug, name: node.name, count: 1 });
      }
    });
  });

  return [...map.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "tr"));
}

function getLocationOptions(nodes: LocationsData["locations"]["nodes"]) {
  return nodes
    .filter((node): node is NonNullable<(typeof nodes)[number]> => Boolean(node?.slug && node.name))
    .map((node) => ({
      slug: node.slug as string,
      name: node.name as string,
      count: Number(node.count ?? 0),
    }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "tr"));
}

function sortCompanies(companies: Company[], sort: string) {
  return [...companies].sort((left, right) => {
    if (sort === "alphabetical") {
      return (left.title || "").localeCompare(right.title || "", "tr");
    }

    if (sort === "oldest") {
      return new Date(left.date ?? 0).getTime() - new Date(right.date ?? 0).getTime();
    }

    if (sort === "verified") {
      const verifiedDiff = Number(Boolean(right.companyDetails?.isVerified)) - Number(Boolean(left.companyDetails?.isVerified));
      if (verifiedDiff !== 0) {
        return verifiedDiff;
      }
      return new Date(right.date ?? 0).getTime() - new Date(left.date ?? 0).getTime();
    }

    if (sort === "views") {
      return (right.content?.length ?? 0) - (left.content?.length ?? 0);
    }

    return new Date(right.date ?? 0).getTime() - new Date(left.date ?? 0).getTime();
  });
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const resolved = await searchParams;
  const q = getSingleValue(resolved.q).trim();
  const sector = getSingleValue(resolved.sector).trim();
  const location = getSingleValue(resolved.location).trim();
  const sort = getSingleValue(resolved.sort).trim() || "newest";
  const verified = getSingleValue(resolved.verified).trim();
  const after = getSingleValue(resolved.after).trim();

  const [{ data, hasError: hasCompanyError }, { data: allLocationsData, hasError: hasLocationError }] =
    await Promise.all([
      queryWithFallback<QueryData, { first: number; after?: string; search?: string }>(
        {
          query: GET_COMPANIES_PAGINATED,
          variables: {
            first: 50,
            ...(after ? { after } : {}),
            ...(q ? { search: q } : {}),
          },
        },
        EMPTY_DATA,
        "companies paginated listing",
      ),
      queryWithFallback<LocationsData>(
        {
          query: GET_ALL_LOCATIONS,
        },
        EMPTY_LOCATIONS,
        "all locations listing",
      ),
    ]);

  const hasError = hasCompanyError || hasLocationError;

  const allLocations = getLocationOptions(allLocationsData?.locations?.nodes ?? []);

  const companies = (data?.companies?.nodes ?? []).filter(
    (company): company is Company => Boolean(company?.id && company.slug?.trim()),
  );
  const locationsToDisplay = allLocations.length ? allLocations : getFilterOptions(companies, "locations");

  if (hasError && companies.length === 0) {
    return (
      <FallbackUI
        actionLabel="Ana sayfaya dön"
        href="/"
        message="Firma listesi şu anda alınamıyor. Lütfen kısa süre sonra tekrar deneyin."
        title="Firmalar yüklenemedi"
      />
    );
  }

  const normalizedQuery = q.toLocaleLowerCase("tr-TR");

  const filteredCompanies = companies.filter((company) => {
    const matchesSector =
      !sector || (company.sectors?.nodes ?? []).some((item) => item?.slug === sector);
    const matchesLocation =
      !location || (company.locations?.nodes ?? []).some((item) => item?.slug === location);
    const matchesVerified = verified !== "true" || Boolean(company.companyDetails?.isVerified);

    const searchableText = [
      company.title,
      company.content,
      ...(company.sectors?.nodes ?? []).map((item) => item?.name),
      ...(company.locations?.nodes ?? []).map((item) => item?.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr-TR");

    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesSector && matchesLocation && matchesVerified && matchesSearch;
  });

  const sortedCompanies = sortCompanies(filteredCompanies, sort);
  const featuredCompanies = sortedCompanies.filter((company) => company.companyDetails?.isVerified).slice(0, 4);
  const featuredIds = new Set(featuredCompanies.map((item) => item.id));
  const regularCompanies = sortedCompanies.filter((company) => !featuredIds.has(company.id));

  const activeFilterCount = [sector, location, q, verified === "true" ? "true" : ""].filter(Boolean).length;

  const currentParams = {
    ...(q ? { q } : {}),
    ...(sector ? { sector } : {}),
    ...(location ? { location } : {}),
    ...(sort && sort !== "newest" ? { sort } : {}),
    ...(verified === "true" ? { verified: "true" } : {}),
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
              <Building2 size={12} className="text-primary" />
              Firma Rehberi
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">Sektörel Firma Rehberi</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              Sektör, şehir ve doğrulama filtreleriyle işletmeleri keşfedin. Onaylı firmalar üstte,
              geri kalanlar detaylı listede sunulur.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-8 px-4 py-10">
        {hasError ? (
          <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı firma verileri alınamadı. Sayfa mevcut sonuçlarla gösteriliyor.
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border border-gray-200 bg-white p-5 shadow-sm">
          <CompanySearch location={location} q={q} sector={sector} sort={sort} verified={verified} />
          <CompanySort location={location} q={q} sector={sector} selectedSort={sort} verified={verified} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <CompanyFilters
            activeFilterCount={activeFilterCount}
            locations={locationsToDisplay}
            searchQuery={q}
            sectors={getFilterOptions(companies, "sectors")}
            selectedLocation={location}
            selectedSector={sector}
            selectedSort={sort}
            selectedVerified={verified}
          />

          <div className="space-y-8">
            {featuredCompanies.length ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  <h2 className="text-xl font-black text-secondary">Öne Çıkan Onaylı Firmalar</h2>
                </div>
                <CompanyGrid companies={featuredCompanies} featured />
              </section>
            ) : null}

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-secondary">Tüm Firmalar</h2>
                <p className="text-sm text-gray-500">{sortedCompanies.length} sonuç bulundu</p>
              </div>

              {regularCompanies.length ? (
                <CompanyGrid companies={regularCompanies} />
              ) : (
                <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                  <h3 className="text-2xl font-black text-secondary">Sonuç bulunamadı</h3>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                    Seçtiğiniz filtrelerle eşleşen firma bulunamadı. Filtreleri temizleyip tekrar deneyin.
                  </p>
                </div>
              )}
            </section>

            <CompanyPagination
              currentParams={currentParams}
              hasNextPage={data?.companies?.pageInfo?.hasNextPage}
              nextCursor={data?.companies?.pageInfo?.endCursor}
              showingCount={sortedCompanies.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
