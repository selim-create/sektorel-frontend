import { gql } from "@apollo/client";
import { getCityLanding, type LocationDirectory } from "@/lib/location-landings";
import { queryWithFallback } from "@/lib/graphql-client";

const SECTOR_SUFFIX = "-firmalari";

export type SectorLandingTerm = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  count?: number | null;
  sectorDetails?: {
    featuredImage?: string | null;
  } | null;
};

const SECTOR_LANDING_QUERY = gql`
  query CitySectorLanding($slug: ID!) {
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

const CITY_SECTOR_DIRECTORY_QUERY = gql`
  query CitySectorCompanyDirectory(
    $location: String!
    $sector: String!
    $page: Int!
    $first: Int!
  ) {
    sektorelCompanyDirectory(
      location: $location
      sector: $sector
      page: $page
      first: $first
      sort: "verified"
    ) {
      total
      page
      perPage
      totalPages
      hasNextPage
      hasPreviousPage
      nodes {
        id
        title
        slug
        companyDetails {
          isVerified
          email
          phone
          address
          website
        }
        featuredImage {
          node {
            sourceUrl
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
  }
`;

type SectorLandingData = {
  sector?: SectorLandingTerm | null;
};

type DirectoryData = {
  sektorelCompanyDirectory?: LocationDirectory | null;
};

const EMPTY_DIRECTORY: LocationDirectory = {
  nodes: [],
  total: 0,
  page: 1,
  perPage: 24,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function getSectorSlugFromLandingSegment(segment: string) {
  if (!segment.endsWith(SECTOR_SUFFIX)) return null;
  const sectorSlug = segment.slice(0, -SECTOR_SUFFIX.length);
  return sectorSlug || null;
}

export function createSectorLandingSegment(sectorSlug: string) {
  return `${sectorSlug}${SECTOR_SUFFIX}`;
}

export async function getCitySectorLanding(citySlug: string, segment: string) {
  const sectorSlug = getSectorSlugFromLandingSegment(segment);
  if (!sectorSlug) return null;

  const [cityLanding, sectorResult] = await Promise.all([
    getCityLanding(citySlug),
    queryWithFallback<SectorLandingData>(
      {
        query: SECTOR_LANDING_QUERY,
        variables: { slug: sectorSlug },
      },
      { sector: null },
      `city sector landing ${citySlug}/${sectorSlug}`,
    ),
  ]);

  const sector = sectorResult.data.sector;
  if (!cityLanding || !sector?.name || !sector.slug) return null;

  return {
    ...cityLanding,
    sector,
    segment: createSectorLandingSegment(sector.slug),
  };
}

export async function getCitySectorDirectory(
  location: string,
  sector: string,
  page = 1,
  first = 24,
) {
  const { data, hasError } = await queryWithFallback<DirectoryData>(
    {
      query: CITY_SECTOR_DIRECTORY_QUERY,
      variables: {
        location,
        sector,
        page: Math.max(1, page),
        first: Math.min(Math.max(first, 1), 48),
      },
    },
    { sektorelCompanyDirectory: EMPTY_DIRECTORY },
    `city sector directory ${location}/${sector}`,
  );

  return {
    directory: data.sektorelCompanyDirectory ?? EMPTY_DIRECTORY,
    hasError,
  };
}
