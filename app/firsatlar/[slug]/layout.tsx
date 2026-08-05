import type { Metadata } from "next";
import { gql } from "@apollo/client";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createContentMetadata, isValidDate } from "@/lib/content-seo";
import { queryWithFallback } from "@/lib/graphql-client";
import { absoluteUrl, compactObject, stripHtml, truncateText } from "@/lib/site";

const LEAD_SEO_QUERY = gql`
  query LeadSeo($slug: ID!) {
    lead(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      leadDetails {
        leadType
        status
        budgetString
        expiryDate
        deliveryLocation
      }
      sectors {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

type LeadSeoData = {
  lead?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    date?: string | null;
    content?: string | null;
    leadDetails?: {
      leadType?: string | null;
      status?: string | null;
      budgetString?: string | null;
      expiryDate?: string | null;
      deliveryLocation?: string | null;
    } | null;
    sectors?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  } | null;
};

async function getLead(slug: string) {
  const { data } = await queryWithFallback<LeadSeoData>(
    { query: LEAD_SEO_QUERY, variables: { slug } },
    { lead: null },
    `lead seo ${slug}`,
  );
  return data.lead ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lead = await getLead(slug);
  return createContentMetadata({
    title: lead?.title,
    slug: lead?.slug,
    routePrefix: "/firsatlar",
    descriptionSource: lead?.content,
    fallbackDescription: `${lead?.title || "Ticari fırsat"} için detay ve teklif bilgileri.`,
    type: "website",
  });
}

export default async function LeadLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lead = await getLead(slug);
  if (!lead?.title || !lead.slug) return children;

  const details = lead.leadDetails;
  const sector = lead.sectors?.nodes?.find((item) => item?.name);
  const url = absoluteUrl(`/firsatlar/${lead.slug}`);

  const opportunitySchema = compactObject({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#opportunity`,
    name: lead.title,
    description: truncateText(stripHtml(lead.content) || `${lead.title} ticari fırsatı.`),
    url,
    category: sector?.name || details?.leadType || undefined,
    areaServed: details?.deliveryLocation
      ? {
          "@type": "Place",
          name: details.deliveryLocation,
        }
      : undefined,
    provider: {
      "@type": "Organization",
      name: "Sektörel Ajanda",
      url: absoluteUrl("/"),
    },
    offers: compactObject({
      "@type": "Offer",
      url,
      availability:
        details?.status === "closed"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      priceSpecification: details?.budgetString
        ? {
            "@type": "PriceSpecification",
            description: details.budgetString,
          }
        : undefined,
      validThrough: isValidDate(details?.expiryDate) ? details?.expiryDate : undefined,
    }),
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Fırsatlar", path: "/firsatlar" },
    ...(sector?.name && sector.slug ? [{ name: sector.name, path: `/sektor/${sector.slug}` }] : []),
    { name: lead.title, path: `/firsatlar/${lead.slug}` },
  ];

  return (
    <>
      <JsonLd data={[opportunitySchema, createBreadcrumbSchema(breadcrumbItems)]} />
      {children}
    </>
  );
}
