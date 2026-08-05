import Link from "next/link";
import { Building2, ChevronRight, MapPin } from "lucide-react";
import CompanyGrid from "@/components/companies/CompanyGrid";
import FallbackUI from "@/components/error/FallbackUI";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getLocationDirectory, type LocationOption, type LocationTerm } from "@/lib/location-landings";
import { absoluteUrl, stripHtml, truncateText } from "@/lib/site";

type DistrictLandingPageProps = {
  city: LocationTerm;
  district: LocationTerm;
  districts: LocationOption[];
  page: number;
};

function pageHref(city: string, district: string, page: number) {
  const path = `/${city}/${district}`;
  return page > 1 ? `${path}?page=${page}` : path;
}

export default async function DistrictLandingPage({
  city,
  district,
  districts,
  page,
}: DistrictLandingPageProps) {
  const { directory, hasError } = await getLocationDirectory(district.slug!, page);
  const path = `/${city.slug}/${district.slug}`;
  const pageUrl = absoluteUrl(path);
  const description = truncateText(
    stripHtml(district.description) || `${city.name} ${district.name} firma rehberi.`,
  );

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `${district.name} Firmaları`,
      description,
      url: pageUrl,
      numberOfItems: directory.total,
      isPartOf: { "@id": absoluteUrl(`/${city.slug}#collection`) },
      about: {
        "@type": "AdministrativeArea",
        name: `${district.name}, ${city.name}`,
        containedInPlace: {
          "@type": "City",
          name: city.name,
          url: absoluteUrl(`/${city.slug}`),
        },
        geo:
          district.locationDetails?.lat && district.locationDetails?.lng
            ? {
                "@type": "GeoCoordinates",
                latitude: district.locationDetails.lat,
                longitude: district.locationDetails.lng,
              }
            : undefined,
      },
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
          name: district.name,
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
          { label: district.name! },
        ]}
      />

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                <MapPin size={15} /> {city.name} İlçe Rehberi
              </div>
              <h1 className="text-3xl font-black tracking-tight text-secondary md:text-5xl">
                {district.name} Firmaları
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
                {description}
              </p>
            </div>
            <div className="border border-gray-200 bg-gray-50 px-6 py-5 text-center">
              <span className="block text-3xl font-black text-secondary">{directory.total}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Kayıtlı Firma</span>
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
            {districts.map((item) => {
              const active = item.slug === district.slug;
              return (
                <Link
                  key={item.databaseId ?? item.slug}
                  href={`/${city.slug}/${item.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-gray-50 px-2 py-3 text-sm font-semibold ${
                    active
                      ? "bg-orange-50 text-primary"
                      : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                  }`}
                >
                  {item.name}
                  <ChevronRight size={14} />
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="flex items-center gap-2 text-xl font-black text-secondary">
              <Building2 size={20} className="text-primary" /> {district.name} Firma Rehberi
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {city.name} / {district.name} lokasyonuna bağlı firmalar doğrulanmış kayıtlar öncelikli gösterilir.
            </p>
          </div>

          {hasError && directory.nodes.length === 0 ? (
            <FallbackUI
              title="Firma verileri yüklenemedi"
              message="İlçe firma listesi şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
              actionLabel={`${city.name} sayfasına dön`}
              href={`/${city.slug}`}
            />
          ) : directory.nodes.length ? (
            <>
              <CompanyGrid companies={directory.nodes} />
              <nav className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6" aria-label={`${district.name} firma sayfaları`}>
                {directory.hasPreviousPage ? (
                  <Link
                    href={pageHref(city.slug!, district.slug!, page - 1)}
                    className="border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:border-primary hover:text-primary"
                  >
                    Önceki
                  </Link>
                ) : <span />}
                <span className="text-sm text-gray-500">Sayfa {directory.page} / {Math.max(directory.totalPages, 1)}</span>
                {directory.hasNextPage ? (
                  <Link
                    href={pageHref(city.slug!, district.slug!, page + 1)}
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
              <h3 className="font-bold text-secondary">Henüz firma kaydı yok</h3>
              <p className="mt-2 text-sm text-gray-500">Bu ilçe için ilk firma kaydını oluşturabilirsiniz.</p>
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
