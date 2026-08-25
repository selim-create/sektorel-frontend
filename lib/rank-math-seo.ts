import type { Metadata } from "next";

export type RankMathSeo = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  robots?: Array<string | null> | null;
  openGraphTitle?: string | null;
  openGraphDescription?: string | null;
  openGraphImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
};

function text(value?: string | null) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function robotsMetadata(directives?: Array<string | null> | null): Metadata["robots"] | undefined {
  const values = new Set((directives ?? []).filter((value): value is string => Boolean(value)));
  if (values.size === 0) return undefined;

  return {
    index: values.has("noindex") ? false : values.has("index") ? true : undefined,
    follow: values.has("nofollow") ? false : values.has("follow") ? true : undefined,
    noarchive: values.has("noarchive") || undefined,
    nosnippet: values.has("nosnippet") || undefined,
    noimageindex: values.has("noimageindex") || undefined,
  };
}

export function applyRankMathMetadata(fallback: Metadata, seo?: RankMathSeo | null): Metadata {
  if (!seo) return fallback;

  const title = text(seo.title);
  const description = text(seo.description);
  const canonicalUrl = text(seo.canonicalUrl);
  const openGraphTitle = text(seo.openGraphTitle);
  const openGraphDescription = text(seo.openGraphDescription);
  const openGraphImage = text(seo.openGraphImage);
  const twitterTitle = text(seo.twitterTitle);
  const twitterDescription = text(seo.twitterDescription);
  const twitterImage = text(seo.twitterImage);
  const robots = robotsMetadata(seo.robots);

  const fallbackOpenGraph = fallback.openGraph && typeof fallback.openGraph === "object" ? fallback.openGraph : undefined;
  const fallbackTwitter = fallback.twitter && typeof fallback.twitter === "object" ? fallback.twitter : undefined;

  return {
    ...fallback,
    title: title ?? fallback.title,
    description: description ?? fallback.description,
    alternates: canonicalUrl
      ? { ...(fallback.alternates ?? {}), canonical: canonicalUrl }
      : fallback.alternates,
    robots: robots ?? fallback.robots,
    openGraph: fallbackOpenGraph || openGraphTitle || openGraphDescription || openGraphImage
      ? {
          ...(fallbackOpenGraph ?? {}),
          title: openGraphTitle ?? fallbackOpenGraph?.title,
          description: openGraphDescription ?? fallbackOpenGraph?.description,
          images: openGraphImage ? [{ url: openGraphImage }] : fallbackOpenGraph?.images,
        }
      : fallback.openGraph,
    twitter: fallbackTwitter || twitterTitle || twitterDescription || twitterImage
      ? {
          ...(fallbackTwitter ?? {}),
          title: twitterTitle ?? fallbackTwitter?.title,
          description: twitterDescription ?? fallbackTwitter?.description,
          images: twitterImage ? [twitterImage] : fallbackTwitter?.images,
        }
      : fallback.twitter,
  };
}
