import type { Metadata } from "next";
import { gql } from "@apollo/client";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { queryWithFallback } from "@/lib/graphql-client";
import {
  absoluteUrl,
  SITE_NAME,
  stripHtml,
  truncateText,
} from "@/lib/site";

const SECTOR_SEO_QUERY = gql`
  query SectorSeo($slug: ID!) {
    sector(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      count
      sectorDetails {
        featuredImage
      }
    }
  }
`;

type SectorSeoData = {
  sector?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
    description?: string | null;
    count?: number | null;
    sectorDetails?: {
      featuredImage?: string | null;
    } | null;
  } | null;
};

async function getSector(slug: string) {
  const { data } = await queryWithFallback<SectorSeoData>(
    {
      query: SECTOR_SEO_QUERY,
      variables: { slug },
    },
    { sector: null },
    `sector seo ${slug}`,
  );

  return data.sector ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSector(slug);

  if (!sector?.name || !sector.slug) {
    return {
      title: "Sektör bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const description = truncateText(
    stripHtml(sector.description) ||
      `${sector.name} sektöründeki firmaları, haberleri, etkinlikleri ve ticari fırsatları keşfedin.`,
  );
  const canonicalPath = `/sektor/${sector.slug}`;
  const image = sector.sectorDetails?.featuredImage || undefined;

  return {
    title: `${sector.name} Sektörü`,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: `${sector.name} Sektörü`,
      description,
      siteName: SITE_NAME,
      images: image ? [{ url: image, alt: sector.name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${sector.name} Sektörü`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SectorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = await getSector(slug);

  if (!sector?.name || !sector.slug) {
    return children;
  }

  const sectorUrl = absoluteUrl(`/sektor/${sector.slug}`);
  const description = truncateText(
    stripHtml(sector.description) || `${sector.name} sektör sayfası.`,
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${sectorUrl}#collection`,
    name: `${sector.name} Sektörü`,
    url: sectorUrl,
    description,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    about: {
      "@type": "Thing",
      name: sector.name,
    },
    numberOfItems: Number(sector.count ?? 0),
    primaryImageOfPage: sector.sectorDetails?.featuredImage
      ? {
          "@type": "ImageObject",
          url: sector.sectorDetails.featuredImage,
        }
      : undefined,
  };

  const breadcrumbSchema = {
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
        name: "Sektörler",
        item: absoluteUrl("/sektorler"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: sector.name,
        item: sectorUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />
      <Breadcrumbs
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sektörler", href: "/sektorler" },
          { label: sector.name },
        ]}
      />
      {children}
    </>
  );
}
