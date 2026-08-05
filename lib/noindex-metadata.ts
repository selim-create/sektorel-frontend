import type { Metadata } from "next";

type NoIndexMetadataOptions = {
  title: string;
  canonical?: string;
  follow?: boolean;
};

export function createNoIndexMetadata({
  title,
  canonical,
  follow = false,
}: NoIndexMetadataOptions): Metadata {
  return {
    title,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: false,
      follow,
      googleBot: {
        index: false,
        follow,
        noimageindex: true,
      },
    },
  };
}
