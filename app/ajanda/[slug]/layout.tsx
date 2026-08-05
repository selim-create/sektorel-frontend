import type { Metadata } from "next";
import { gql } from "@apollo/client";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createContentMetadata, isValidDate, parseNumericPrice } from "@/lib/content-seo";
import { queryWithFallback } from "@/lib/graphql-client";
import { absoluteUrl, compactObject, stripHtml, truncateText } from "@/lib/site";

const EVENT_SEO_QUERY = gql`
  query EventSeo($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      eventDetails {
        eventType
        startDate
        endDate
        locationType
        venue
        address
        organizer
        price
        registrationLink
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
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    eventDetails?: {
      eventType?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      locationType?: string | null;
      venue?: string | null;
      address?: string | null;
      organizer?: string | null;
      price?: string | null;
      registrationLink?: string | null;
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
          url: details?.registrationLink || url,
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
            url: details?.registrationLink || url,
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

  return (
    <>
      <JsonLd data={[eventSchema, createBreadcrumbSchema(breadcrumbItems)]} />
      {children}
    </>
  );
}
