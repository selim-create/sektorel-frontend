import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME, stripHtml, truncateText } from "@/lib/site";

type ContentMetadataInput = {
  title?: string | null;
  slug?: string | null;
  routePrefix: string;
  descriptionSource?: string | null;
  fallbackDescription: string;
  image?: string | null;
  type?: "article" | "website";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
};

export function createContentMetadata(input: ContentMetadataInput): Metadata {
  if (!input.title || !input.slug) {
    return {
      title: "İçerik bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `${input.routePrefix}/${input.slug}`;
  const description = truncateText(
    stripHtml(input.descriptionSource) || input.fallbackDescription,
  );
  const image = input.image || undefined;

  return {
    title: input.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: input.type ?? "website",
      url: canonicalPath,
      title: input.title,
      description,
      siteName: SITE_NAME,
      images: image ? [{ url: image, alt: input.title }] : undefined,
      publishedTime: input.publishedTime || undefined,
      modifiedTime: input.modifiedTime || undefined,
      authors: input.authors?.length ? input.authors : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: input.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function parseNumericPrice(value?: string | null) {
  if (!value) return null;
  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const price = Number(normalized);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function isValidDate(value?: string | null) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}
