import { gql } from "@apollo/client";
import { queryWithFallback } from "@/lib/graphql-client";

export type DirectoryFacet = {
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  type?: "sector" | "city" | string | null;
  count?: number | null;
};

type DirectoryFacetData = {
  sektorelDirectoryFacets?: Array<DirectoryFacet | null> | null;
};

const DIRECTORY_FACETS_QUERY = gql`
  query DirectoryFacets($location: String, $sector: String, $first: Int) {
    sektorelDirectoryFacets(location: $location, sector: $sector, first: $first) {
      databaseId
      name
      slug
      type
      count
    }
  }
`;

function cleanFacets(items?: Array<DirectoryFacet | null> | null) {
  return (items ?? []).filter(
    (item): item is DirectoryFacet & { name: string; slug: string } =>
      Boolean(item?.name && item.slug),
  );
}

export async function getCitySectorFacets(citySlug: string, first = 24) {
  const { data, hasError } = await queryWithFallback<DirectoryFacetData>(
    {
      query: DIRECTORY_FACETS_QUERY,
      variables: { location: citySlug, sector: null, first },
    },
    { sektorelDirectoryFacets: [] },
    `directory facets city ${citySlug}`,
  );

  return {
    facets: cleanFacets(data.sektorelDirectoryFacets),
    hasError,
  };
}

export async function getSectorCityFacets(sectorSlug: string, first = 24) {
  const { data, hasError } = await queryWithFallback<DirectoryFacetData>(
    {
      query: DIRECTORY_FACETS_QUERY,
      variables: { location: null, sector: sectorSlug, first },
    },
    { sektorelDirectoryFacets: [] },
    `directory facets sector ${sectorSlug}`,
  );

  return {
    facets: cleanFacets(data.sektorelDirectoryFacets),
    hasError,
  };
}
