import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronRight, MapPin } from "lucide-react";
import CompanyGrid from "@/components/companies/CompanyGrid";
import FallbackUI from "@/components/error/FallbackUI";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  getCityLanding,
  getLocationDirectory,
} from "@/lib/location-landings";
import { absoluteUrl, SITE_NAME, stripHtml, truncateText } from "@/lib/site";

type PageProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

function getPage(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function cityPageHref(city: string, page: number) {
  return page > 1 ? `/${city}?page=${page}` : `/${city}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const landing = await getCityLanding(citySlug);

  if (!landing) {
    return {
      title: "Şehir bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const { city } = landing;
  const title = `${city.name} Firmaları ve Sektörel Rehber`;
  const description = truncateText(
    stripHtml(city.description) ||
      `${city.name} genelindeki firmaları, sektörleri ve iş dünyası bağlantılarını keşfedin.`,
  );
  const path = `/${city.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityLandingPage({ params, searchParams }: PageProps) {
  const [{ city: citySlug }, query] = await Promise.all([params, searchParams]);
  const landing = await getCityLanding(citySlug);

  if (!landing) notFound();

  const page = getPage(query.page);
  const { city, districts } = landing;
  const { directory, hasError } = await getLocationDirectory(city.slug!, page);
  const cityPath = `/${city.slug}`;
  const cityUrl = absoluteUrl(cityPath);
  const description = truncateText(
    stripHtml(city.description) || `${city.name} firma ve sektör rehberi.`,
  );

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${cityUrl}#collection`,
      name: `${city.name} Firmaları`,
      description,
      url: cityUrl,
      numberOfItems: directory.total,
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: {
        "@type": "City",
        name: city.name,
        geo:
          city.locationDetails?.lat && city.locationDetails?.lng
            ? {
                "@type": "GeoCoordinates",
                latitude: city.locationDetails.lat,
                longitude: city.locationDetails.lng,
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
          item: cityUrl,
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
          { label: city.name! },
        ]}
      />

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                <MapPin size={15} /> Şehir Rehberi
              </div>
              <h1 className="text-3xl font-black tracking-tight text-secondary md:text-5xl">
                {city.name} Firmaları
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
            <MapPin size={16} className="text-primary" /> İlçeler
          </h2>
          {districts.length ? (
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
          ) : (
            <p className="mt-4 text-sm text-gray-500">Bu şehir için ilçe kaydı bulunmuyor.</p>
          )}
        </aside>

        <main>
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-secondary">
                <Building2 size={20} className="text-primary" /> {city.name} Firma Rehberi
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Şehir ve bağlı ilçelerdeki firmalar doğrulanmış kayıtlar öncelikli gösterilir.
              </p>
            </div>
          </div>

          {hasError && directory.nodes.length === 0 ? (
            <FallbackUI
              title="Firma verileri yüklenemedi"
              message="Şehir firma listesi şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
              actionLabel="Firma rehberine dön"
              href="/firmalar"
            />
          ) : directory.nodes.length ? (
            <>
              <CompanyGrid companies={directory.nodes} />
              <nav className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6" aria-label={`${city.name} firma sayfaları`}>
                {directory.hasPreviousPage ? (
                  <Link
                    href={cityPageHref(city.slug!, page - 1)}
                    className="border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:border-primary hover:text-primary"
                  >
                    Önceki
                  </Link>
                ) : <span />}
                <span className="text-sm text-gray-500">Sayfa {directory.page} / {Math.max(directory.totalPages, 1)}</span>
                {directory.hasNextPage ? (
                  <Link
                    href={cityPageHref(city.slug!, page + 1)}
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
              <p className="mt-2 text-sm text-gray-500">Bu şehir için ilk firma kaydını oluşturabilirsiniz.</p>
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
