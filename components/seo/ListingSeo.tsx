import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type ListingSeoInput = {
  title: string;
  description: string;
  path: string;
  collectionName: string;
};

export function createListingMetadata({ title, description, path }: ListingSeoInput): Metadata {
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

export default function ListingSeo({
  title,
  description,
  path,
  collectionName,
}: ListingSeoInput) {
  const pageUrl = absoluteUrl(path);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        name: collectionName,
        headline: title,
        description,
        url: pageUrl,
        isPartOf: {
          "@id": absoluteUrl("/#website"),
        },
      }}
    />
  );
}
