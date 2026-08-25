import type { Metadata } from "next";
import { gql } from "@apollo/client";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createContentMetadata, isValidDate, parseNumericPrice } from "@/lib/content-seo";
import { queryWithFallback } from "@/lib/graphql-client";
import type { RankMathSeo } from "@/lib/rank-math-seo";
import { absoluteUrl, compactObject, stripHtml, truncateText } from "@/lib/site";

const EVENT_SEO_QUERY = gql`
  query EventSeo($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      sektorelSeo {
        title
        description
        canonicalUrl
        robots
        openGraphTitle
        openGraphDescription
        openGraphImage
        twitterTitle
        twitterDescription
        twitterImage
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
      eventDetails {
        isOfficial
        eventType
        startDate
        endDate
        locationType
        venue
        address
        organizer
        price
        eventUrl
        registrationLink
        sourceUrl
        officialSourceUrl
      }
    }
  }
`;

type EventSeoData = {
  event?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    content?: string | null;
    sektorelSeo?: RankMathSeo | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    eventDetails?: {
      isOfficial?: boolean | null;
      eventType?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      locationType?: string | null;
      venue?: string | null;
      address?: string | null;
      organizer?: string | null;
      price?: string | null;
      eventUrl?: string | null;
      registrationLink?: string | null;
      sourceUrl?: string | null;
      officialSourceUrl?: string | null;
    } | null;
  } | null;
};

async function getEvent(slug: string) {
  const { data } = await queryWithFallback<EventSeoData>(
    { query: EVENT_SEO_QUERY, variables: { slug } },
    { event: null },
    `event seo ${slug}`,
  );
  return data.event ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  return createContentMetadata({
    title: event?.title,
    slug: event?.slug,
    routePrefix: "/ajanda",
    descriptionSource: event?.content,
    fallbackDescription: `${event?.title || "Etkinlik"} tarih, yer ve kayıt bilgileri.`,
    image: event?.featuredImage?.node?.sourceUrl,
    type: "website",
    seo: event?.sektorelSeo,
  });
}

export default async function EventLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event?.title || !event.slug) return children;

  const details = event.eventDetails;
  const url = absoluteUrl(`/ajanda/${event.slug}`);
  const isOnline = details?.locationType === "online";
  const price = parseNumericPrice(details?.price);

  const eventSchema = compactObject({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: event.title,
    description: truncateText(stripHtml(event.content) || `${event.title} etkinliği.`),
    startDate: isValidDate(details?.startDate) ? details?.startDate : undefined,
    endDate: isValidDate(details?.endDate) ? details?.endDate : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    image: event.featuredImage?.node?.sourceUrl ? [event.featuredImage.node.sourceUrl] : undefined,
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url: details?.registrationLink || details?.eventUrl || url,
        }
      : compactObject({
          "@type": "Place",
          name: details?.venue || undefined,
          address: details?.address
            ? {
                "@type": "PostalAddress",
                streetAddress: details.address,
                addressCountry: "TR",
              }
            : undefined,
        }),
    organizer: details?.organizer
      ? {
          "@type": "Organization",
          name: details.organizer,
        }
      : undefined,
    offers:
      price !== null || details?.registrationLink
        ? compactObject({
            "@type": "Offer",
            url: details?.registrationLink || details?.eventUrl || url,
            price: price ?? 0,
            priceCurrency: "TRY",
            availability: "https://schema.org/InStock",
            validFrom: isValidDate(details?.startDate) ? details?.startDate : undefined,
          })
        : undefined,
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Etkinlikler", path: "/ajanda" },
    { name: event.title, path: `/ajanda/${event.slug}` },
  ];

  const sourceCandidates = [
    details?.isOfficial && details?.officialSourceUrl
      ? { label: "Resmî Kaynak", url: details.officialSourceUrl }
      : null,
    details?.eventUrl ? { label: "Etkinlik Sitesi", url: details.eventUrl } : null,
    details?.sourceUrl ? { label: "Kaynak", url: details.sourceUrl } : null,
  ].filter((item): item is { label: string; url: string } => Boolean(item?.url));

  const seenUrls = new Set<string>();
  const sourceLinks = sourceCandidates.filter((item) => {
    const normalized = item.url.replace(/\/$/, "");
    if (seenUrls.has(normalized)) return false;
    seenUrls.add(normalized);
    return true;
  });

  return (
    <>
      <JsonLd data={[eventSchema, createBreadcrumbSchema(breadcrumbItems)]} />
      {children}
      {sourceLinks.length > 0 ? (
        <section className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Kaynak ve doğrulama</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Etkinlik bilgilerini doğrulamak veya güncel detayları incelemek için kaynak bağlantılarını kullanabilirsiniz.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sourceLinks.map((item) => (
                  <a
                    key={`${item.label}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition hover:border-primary hover:text-primary"
                  >
                    {item.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
