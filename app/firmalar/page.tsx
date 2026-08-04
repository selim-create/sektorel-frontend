import type { Metadata } from "next";
import { gql } from "@apollo/client";
import { Building2, Star } from "lucide-react";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompanyGrid from "@/components/companies/CompanyGrid";
import CompanyPagination from "@/components/companies/CompanyPagination";
import CompanySearch from "@/components/companies/CompanySearch";
import CompanySort from "@/components/companies/CompanySort";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_SECTORS } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Firma Rehberi | Sektörel Ajanda",
  description: "Sektör ve şehir filtresiyle firmaları keşfedin, onaylı şirketleri öne çıkaran firma listesine göz atın.",
};

export const revalidate = 60;

const DIRECTORY_QUERY = gql`
  query SektorelCompanyDirectory($search: String, $sector: String, $location: String, $verified: Boolean, $sort: String, $page: Int, $first: Int) {
    sektorelCompanyDirectory(search: $search, sector: $sector, location: $location, verified: $verified, sort: $sort, page: $page, first: $first) {
      total
      page
      perPage
      totalPages
      hasNextPage
      hasPreviousPage
      nodes {
        id
        title
        slug
        content
        date
        sektorelViewCount
        companyDetails {
          isVerified
          email
          phone
          address
          mapLat
          mapLng
          coverImage
          website
        }
        featuredImage { node { sourceUrl } }
        sectors { nodes { name slug } }
        locations { nodes { name slug } }
      }
    }
  }
`;

const CITY_OPTIONS_QUERY = gql`
  query SektorelDirectoryCities {
    sektorelLocationOptions(type: "city", first: 100) {
      databaseId
      name
      slug
    }
  }
`;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type TaxonomyNode = { name?: string | null; slug?: string | null };
type Company = {
  id: string;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  date?: string | null;
  sektorelViewCount?: number | null;
  companyDetails?: { isVerified?: boolean | null; email?: string | null; phone?: string | null; address?: string | null; mapLat?: string | null; mapLng?: string | null; coverImage?: string | null; website?: string | null } | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  sectors?: { nodes?: Array<TaxonomyNode | null> | null } | null;
  locations?: { nodes?: Array<TaxonomyNode | null> | null } | null;
};
type DirectoryData = { sektorelCompanyDirectory: { nodes: Company[]; total: number; page: number; perPage: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } };
type SectorData = { sectors: { nodes: Array<{ id?: string | null; name?: string | null; slug?: string | null; count?: number | null } | null> } };
type CityData = { sektorelLocationOptions: Array<{ databaseId: number; name: string; slug: string }> };

const EMPTY_DIRECTORY: DirectoryData = { sektorelCompanyDirectory: { nodes: [], total: 0, page: 1, perPage: 24, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
const EMPTY_SECTORS: SectorData = { sectors: { nodes: [] } };
const EMPTY_CITIES: CityData = { sektorelLocationOptions: [] };

function single(value?: string | string[]) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }
function optionList(nodes: Array<{ name?: string | null; slug?: string | null; count?: number | null } | null>) {
  return nodes.filter((node): node is NonNullable<typeof node> => Boolean(node?.name && node.slug)).map((node) => ({ name: node.name as string, slug: node.slug as string, count: Number(node.count ?? 0) }));
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const resolved = await searchParams;
  const q = single(resolved.q).trim();
  const sector = single(resolved.sector).trim();
  const location = single(resolved.location).trim();
  const sort = single(resolved.sort).trim() || "newest";
  const verified = single(resolved.verified).trim() === "true";
  const page = Math.max(1, Number.parseInt(single(resolved.page), 10) || 1);

  const [directoryResult, sectorResult, cityResult] = await Promise.all([
    queryWithFallback<DirectoryData>({ query: DIRECTORY_QUERY, variables: { search: q || null, sector: sector || null, location: location || null, verified, sort, page, first: 24 } }, EMPTY_DIRECTORY, "server company directory"),
    queryWithFallback<SectorData>({ query: GET_ALL_SECTORS }, EMPTY_SECTORS, "company directory sectors"),
    queryWithFallback<CityData>({ query: CITY_OPTIONS_QUERY }, EMPTY_CITIES, "company directory cities"),
  ]);

  const directory = directoryResult.data?.sektorelCompanyDirectory ?? EMPTY_DIRECTORY.sektorelCompanyDirectory;
  const companies = (directory.nodes ?? []).filter((company): company is Company => Boolean(company?.id && company.slug));
  const sectors = optionList(sectorResult.data?.sectors?.nodes ?? []);
  const cities = (cityResult.data?.sektorelLocationOptions ?? []).map((city) => ({ slug: city.slug, name: city.name, count: 0 }));
  const hasError = directoryResult.hasError || sectorResult.hasError || cityResult.hasError;

  if (directoryResult.hasError && companies.length === 0) {
    return <FallbackUI actionLabel="Ana sayfaya dön" href="/" message="Firma listesi şu anda alınamıyor. Lütfen kısa süre sonra tekrar deneyin." title="Firmalar yüklenemedi" />;
  }

  const featuredCompanies = companies.filter((company) => company.companyDetails?.isVerified).slice(0, 4);
  const featuredIds = new Set(featuredCompanies.map((company) => company.id));
  const regularCompanies = companies.filter((company) => !featuredIds.has(company.id));
  const activeFilterCount = [sector, location, q, verified ? "true" : ""].filter(Boolean).length;
  const currentParams = { ...(q ? { q } : {}), ...(sector ? { sector } : {}), ...(location ? { location } : {}), ...(sort !== "newest" ? { sort } : {}), ...(verified ? { verified: "true" } : {}) };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-16 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container relative z-10 mx-auto"><div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300"><Building2 size={12} className="text-primary" /> Firma Rehberi</div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">Sektörel Firma Rehberi</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">Sektör, şehir ve doğrulama filtreleriyle Türkiye genelindeki firmaları gerçek zamanlı olarak keşfedin.</p>
        </div></div>
      </section>

      <div className="container mx-auto space-y-8 px-4 py-10">
        {hasError ? <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">Bazı filtre seçenekleri alınamadı. Firma sonuçları mevcut verilerle gösteriliyor.</div> : null}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-gray-200 bg-white p-5 shadow-sm">
          <CompanySearch location={location} q={q} sector={sector} sort={sort} verified={verified ? "true" : ""} />
          <CompanySort location={location} q={q} sector={sector} selectedSort={sort} verified={verified ? "true" : ""} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <CompanyFilters activeFilterCount={activeFilterCount} locations={cities} searchQuery={q} sectors={sectors} selectedLocation={location} selectedSector={sector} selectedSort={sort} selectedVerified={verified ? "true" : ""} />
          <div className="space-y-8">
            {featuredCompanies.length ? <section className="space-y-4"><div className="flex items-center gap-2"><Star size={16} className="text-primary" /><h2 className="text-xl font-black text-secondary">Öne Çıkan Onaylı Firmalar</h2></div><CompanyGrid companies={featuredCompanies} featured /></section> : null}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black text-secondary">Tüm Firmalar</h2><p className="text-sm text-gray-500">{directory.total} sonuç bulundu</p></div>
              {regularCompanies.length ? <CompanyGrid companies={regularCompanies} /> : <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm"><h3 className="text-2xl font-black text-secondary">Sonuç bulunamadı</h3><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">Seçtiğiniz filtrelerle eşleşen firma bulunamadı. Filtreleri temizleyip tekrar deneyin.</p></div>}
            </section>
            <CompanyPagination currentParams={currentParams} hasNextPage={directory.hasNextPage} hasPreviousPage={directory.hasPreviousPage} page={directory.page} total={directory.total} totalPages={directory.totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
