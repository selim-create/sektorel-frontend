import type { Metadata } from "next";
import { gql } from "@apollo/client";
import JsonLd from "@/components/seo/JsonLd";
import { queryWithFallback } from "@/lib/graphql-client";
import {
  absoluteUrl,
  compactObject,
  SITE_NAME,
  stripHtml,
  truncateText,
} from "@/lib/site";

const COMPANY_SEO_QUERY = gql`
  query CompanySeo($slug: ID!) {
    company(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      companyDetails {
        email
        phone
        website
        address
        mapLat
        mapLng
        coverImage
        social {
          linkedin
          facebook
          twitter
          instagram
        }
      }
      sectors {
        nodes {
          name
          slug
        }
      }
      locations {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

type CompanySeoData = {
  company?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    content?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    companyDetails?: {
      email?: string | null;
      phone?: string | null;
      website?: string | null;
      address?: string | null;
      mapLat?: string | number | null;
      mapLng?: string | number | null;
      coverImage?: string | null;
      social?: {
        linkedin?: string | null;
        facebook?: string | null;
        twitter?: string | null;
        instagram?: string | null;
      } | null;
    } | null;
    sectors?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
    locations?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  } | null;
};

async function getCompany(slug: string) {
  const { data } = await queryWithFallback<CompanySeoData>(
    {
      query: COMPANY_SEO_QUERY,
      variables: { slug },
    },
    { company: null },
    `company seo ${slug}`,
  );

  return data.company ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company?.title || !company.slug) {
    return {
      title: "Firma bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const sector = company.sectors?.nodes?.find((item) => item?.name)?.name;
  const location = company.locations?.nodes?.find((item) => item?.name)?.name;
  const plainContent = stripHtml(company.content);
  const description = truncateText(
    plainContent ||
      `${company.title}${sector ? `, ${sector} sektöründe` : ""}${location ? ` ${location} bölgesinde` : ""} faaliyet gösteren firma profili.`,
  );
  const canonicalPath = `/firma/${company.slug}`;
  const image =
    company.companyDetails?.coverImage ||
    company.featuredImage?.node?.sourceUrl ||
    undefined;

  return {
    title: company.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "profile",
      url: canonicalPath,
      title: company.title,
      description,
      siteName: SITE_NAME,
      images: image ? [{ url: image, alt: company.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: company.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company?.title || !company.slug) {
    return children;
  }

  const details = company.companyDetails;
  const location = company.locations?.nodes?.find((item) => item?.name)?.name;
  const sector = company.sectors?.nodes?.find((item) => item?.name)?.name;
  const latitude = Number(details?.mapLat);
  const longitude = Number(details?.mapLng);
  const sameAs = [
    details?.social?.linkedin,
    details?.social?.facebook,
    details?.social?.twitter,
    details?.social?.instagram,
  ].filter((value): value is string => Boolean(value));
  const companyUrl = absoluteUrl(`/firma/${company.slug}`);

  const localBusinessSchema = compactObject({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${companyUrl}#business`,
    name: company.title,
    url: companyUrl,
    description: truncateText(stripHtml(company.content) || `${company.title} firma profili.`),
    image:
      details?.coverImage || company.featuredImage?.node?.sourceUrl || undefined,
    logo: company.featuredImage?.node?.sourceUrl || undefined,
    telephone: details?.phone || undefined,
    email: details?.email || undefined,
    sameAs,
    knowsAbout: sector ? [sector] : undefined,
    address: details?.address
      ? compactObject({
          "@type": "PostalAddress",
          streetAddress: details.address,
          addressLocality: location || undefined,
          addressCountry: "TR",
        })
      : undefined,
    geo:
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          }
        : undefined,
  });

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
        name: "Firma Rehberi",
        item: absoluteUrl("/firmalar"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: company.title,
        item: companyUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[localBusinessSchema, breadcrumbSchema]} />
      {children}
    </>
  );
}
