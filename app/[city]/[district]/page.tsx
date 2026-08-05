import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CitySectorLandingPage from "@/components/location/CitySectorLandingPage";
import DistrictLandingPage from "@/components/location/DistrictLandingPage";
import {
  createSectorLandingSegment,
  getCitySectorLanding,
  getSectorSlugFromLandingSegment,
} from "@/lib/city-sector-landings";
import { getDistrictLanding } from "@/lib/location-landings";
import { SITE_NAME, stripHtml, truncateText } from "@/lib/site";

type PageProps = {
  params: Promise<{ city: string; district: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

function getPage(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, district: secondSegment } = await params;
  const sectorSlug = getSectorSlugFromLandingSegment(secondSegment);

  if (sectorSlug) {
    const landing = await getCitySectorLanding(citySlug, secondSegment);
    if (!landing) {
      return {
        title: "Şehir veya sektör bulunamadı",
        robots: { index: false, follow: false },
      };
    }

    const { city, sector } = landing;
    const title = `${city.name} ${sector.name} Firmaları`;
    const description = truncateText(
      stripHtml(sector.description) ||
        `${city.name} genelinde ${sector.name} sektöründe faaliyet gösteren firmaları keşfedin.`,
    );
    const path = `/${city.slug}/${createSectorLandingSegment(sector.slug!)}`;

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
        images: sector.sectorDetails?.featuredImage
          ? [{ url: sector.sectorDetails.featuredImage, alt: title }]
          : undefined,
      },
      twitter: {
        card: sector.sectorDetails?.featuredImage ? "summary_large_image" : "summary",
        title,
        description,
        images: sector.sectorDetails?.featuredImage
          ? [sector.sectorDetails.featuredImage]
          : undefined,
      },
    };
  }

  const landing = await getDistrictLanding(citySlug, secondSegment);
  if (!landing) {
    return {
      title: "İlçe bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const { city, district } = landing;
  const title = `${district.name} Firmaları | ${city.name}`;
  const description = truncateText(
    stripHtml(district.description) ||
      `${city.name} ${district.name} ilçesindeki firmaları, sektörleri ve iş bağlantılarını keşfedin.`,
  );
  const path = `/${city.slug}/${district.slug}`;

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

export default async function LocationSecondLevelPage({ params, searchParams }: PageProps) {
  const [{ city: citySlug, district: secondSegment }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getPage(query.page);

  if (getSectorSlugFromLandingSegment(secondSegment)) {
    const landing = await getCitySectorLanding(citySlug, secondSegment);
    if (!landing) notFound();

    return (
      <CitySectorLandingPage
        city={landing.city}
        districts={landing.districts}
        sector={landing.sector}
        page={page}
      />
    );
  }

  const landing = await getDistrictLanding(citySlug, secondSegment);
  if (!landing) notFound();

  return (
    <DistrictLandingPage
      city={landing.city}
      district={landing.district}
      districts={landing.districts}
      page={page}
    />
  );
}
