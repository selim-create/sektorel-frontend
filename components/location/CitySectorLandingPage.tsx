import Link from "next/link";
import { Building2, ChevronRight, Layers3, MapPin } from "lucide-react";
import CompanyGrid from "@/components/companies/CompanyGrid";
import FallbackUI from "@/components/error/FallbackUI";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  createSectorLandingSegment,
  getCitySectorDirectory,
  type SectorLandingTerm,
} from "@/lib/city-sector-landings";
import type { LocationOption, LocationTerm } from "@/lib/location-landings";
import { absoluteUrl, stripHtml, truncateText } from "@/lib/site";

type CitySectorLandingPageProps = {
  city: LocationTerm;
  districts: LocationOption[];
  sector: SectorLandingTerm;
  page: number;
};

function pageHref(citySlug: string, sectorSlug: string, page: number) {
  const path = `/${citySlug}/${createSectorLandingSegment(sectorSlug)}`;
  return page > 1 ? `${path}?page=${page}` : path;
}

export default async function CitySectorLandingPage({
  city,
  districts,
  sector,
  page,
}: CitySectorLandingPageProps) {
  const { directory, hasError } = await getCitySectorDirectory(
    city.slug!,
    sector.slug!,
    page,
  );
  const path = `/${city.slug}/${createSectorLandingSegment(sector.slug!)}`;
  const pageUrl = absoluteUrl(path);
  const description = truncateText(
    stripHtml(sector.description) ||
      `${city.name} genelinde ${sector.name} sektöründe faaliyet gösteren firmaları ve iş bağlantılarını keşfedin.`,
  );

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `${city.name} ${sector.name} Firmaları`,
      description,
      url: pageUrl,
      numberOfItems: directory.total,
      isPartOf: { "@id": absoluteUrl(`/${city.slug}#collection`) },
      about: [
        {
          "@type": "City",
          name: city.name,
          url: absoluteUrl(`/${city.slug}`),
        },
        {
          "@type": "Thing",
          name: sector.name,
          url: absoluteUrl(`/sektor/${sector.slug}`),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: city.name,
          item: absoluteUrl(`/${city.slug}`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${sector.name} Firmaları`,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <JsonLd data={schemas} />
      <Breadcrumbs
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: city.name!, href: `/${city.slug}` },
          { label: `${sector.name} Firmaları` },
        ]}
      />

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                <Layers3 size={15} /> {city.name} Sektör Rehberi
              </div>
              <h1 className="text-3xl font-black tracking-tight text-secondary md:text-5xl">
                {city.name} {sector.name} Firmaları
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
                {description}
              </p>
            </div>
            <div className="border border-gray-200 bg-gray-50 px-6 py-5 text-center">
              <span className="block text-3xl font-black text-secondary">
                {directory.total}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Kayıtlı Firma
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-10 px-4 py-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 border-b border-gray-100 pb-4 text-sm font-black uppercase tracking-widest text-secondary">
            <MapPin size={16} className="text-primary" /> {city.name} İlçeleri
          </h2>
          <nav className="mt-4 max-h-[520px] space-y-1 overflow-y-auto pr-1" aria-label={`${city.name} ilçeleri`}>
            {districts.map((district) => (
              <Link
                key={district.databaseId ?? district.slug}
                href={`/${city.slug}/${district.slug}`}
                className="flex items-center justify-between border-b border-gray-50 px-2 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-primary"
              >
                {district.name}
                <ChevronRight size={14} />
              </Link>
            ))}
          </nav>
          <Link
            href={`/sektor/${sector.slug}`}
            className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5 text-sm font-bold text-primary"
          >
            {sector.name} sektörünü incele
            <ChevronRight size={15} />
          </Link>
        </aside>

        <main>
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="flex items-center gap-2 text-xl font-black text-secondary">
              <Building2 size={20} className="text-primary" /> {city.name} {sector.name} Firma Rehberi
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Şehir ve sektör filtrelerine uyan firmalar, doğrulanmış kayıtlar öncelikli olacak şekilde gösterilir.
            </p>
          </div>

          {hasError && directory.nodes.length === 0 ? (
            <FallbackUI
              title="Firma verileri yüklenemedi"
              message="Şehir ve sektör firma listesi şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
              actionLabel={`${city.name} sayfasına dön`}
              href={`/${city.slug}`}
            />
          ) : directory.nodes.length ? (
            <>
              <CompanyGrid companies={directory.nodes} />
              <nav className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6" aria-label={`${city.name} ${sector.name} firma sayfaları`}>
                {directory.hasPreviousPage ? (
                  <Link
                    href={pageHref(city.slug!, sector.slug!, page - 1)}
                    className="border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:border-primary hover:text-primary"
                  >
                    Önceki
                  </Link>
                ) : <span />}
                <span className="text-sm text-gray-500">Sayfa {directory.page} / {Math.max(directory.totalPages, 1)}</span>
                {directory.hasNextPage ? (
                  <Link
                    href={pageHref(city.slug!, sector.slug!, page + 1)}
                    className="bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary-hover"
                  >
                    Sonraki
                  </Link>
                ) : <span />}
              </nav>
            </>
          ) : (
            <div className="border border-dashed border-gray-300 bg-white p-12 text-center">
              <Building2 className="mx-auto mb-4 text-gray-300" size={40} />
              <h3 className="font-bold text-secondary">Bu kombinasyonda firma bulunamadı</h3>
              <p className="mt-2 text-sm text-gray-500">Bu şehir ve sektör için ilk firma kaydını oluşturabilirsiniz.</p>
              <Link href="/firma-ekle" className="mt-5 inline-flex bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-white">
                Firma Ekle
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
