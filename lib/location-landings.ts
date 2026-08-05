import { gql } from "@apollo/client";
import { queryWithFallback } from "@/lib/graphql-client";

export type LocationTerm = {
  id?: string | null;
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  count?: number | null;
  locationDetails?: {
    type?: string | null;
    lat?: string | null;
    lng?: string | null;
  } | null;
};

export type LocationOption = {
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  type?: string | null;
  parentId?: number | null;
};

export type DirectoryCompany = {
  id: string;
  title?: string | null;
  slug?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  sectors?: {
    nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
  locations?: {
    nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
};

export type LocationDirectory = {
  nodes: DirectoryCompany[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const CITY_LANDING_QUERY = gql`
  query CityLanding($slug: ID!, $parentSlug: String!) {
    location(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      count
      locationDetails {
        type
        lat
        lng
      }
    }
    districts: sektorelLocationOptions(
      type: "district"
      parentSlug: $parentSlug
      first: 200
    ) {
      databaseId
      name
      slug
      type
      parentId
    }
  }
`;

const DISTRICT_LANDING_QUERY = gql`
  query DistrictLanding(
    $citySlug: ID!
    $districtSlug: ID!
    $parentSlug: String!
  ) {
    city: location(id: $citySlug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      count
      locationDetails {
        type
        lat
        lng
      }
    }
    district: location(id: $districtSlug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      count
      locationDetails {
        type
        lat
        lng
      }
    }
    districts: sektorelLocationOptions(
      type: "district"
      parentSlug: $parentSlug
      first: 200
    ) {
      databaseId
      name
      slug
      type
      parentId
    }
  }
`;

const LOCATION_DIRECTORY_QUERY = gql`
  query LocationCompanyDirectory(
    $location: String!
    $page: Int!
    $first: Int!
  ) {
    sektorelCompanyDirectory(
      location: $location
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

type CityLandingData = {
  location?: LocationTerm | null;
  districts?: Array<LocationOption | null> | null;
};

type DistrictLandingData = {
  city?: LocationTerm | null;
  district?: LocationTerm | null;
  districts?: Array<LocationOption | null> | null;
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

function cleanOptions(options?: Array<LocationOption | null> | null) {
  return (options ?? [])
    .filter((option): option is LocationOption => Boolean(option?.name && option.slug))
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "tr"));
}

export async function getCityLanding(slug: string) {
  const { data } = await queryWithFallback<CityLandingData>(
    {
      query: CITY_LANDING_QUERY,
      variables: { slug, parentSlug: slug },
    },
    { location: null, districts: [] },
    `city landing ${slug}`,
  );

  const city = data.location;
  if (!city?.name || !city.slug || city.locationDetails?.type !== "city") {
    return null;
  }

  return {
    city,
    districts: cleanOptions(data.districts),
  };
}

export async function getDistrictLanding(citySlug: string, districtSlug: string) {
  const { data } = await queryWithFallback<DistrictLandingData>(
    {
      query: DISTRICT_LANDING_QUERY,
      variables: { citySlug, districtSlug, parentSlug: citySlug },
    },
    { city: null, district: null, districts: [] },
    `district landing ${citySlug}/${districtSlug}`,
  );

  const city = data.city;
  const district = data.district;
  const districts = cleanOptions(data.districts);
  const belongsToCity = districts.some((item) => item.slug === district?.slug);

  if (
    !city?.name ||
    !city.slug ||
    city.locationDetails?.type !== "city" ||
    !district?.name ||
    !district.slug ||
    district.locationDetails?.type !== "district" ||
    !belongsToCity
  ) {
    return null;
  }

  return { city, district, districts };
}

export async function getLocationDirectory(location: string, page = 1, first = 24) {
  const { data, hasError } = await queryWithFallback<DirectoryData>(
    {
      query: LOCATION_DIRECTORY_QUERY,
      variables: {
        location,
        page: Math.max(1, page),
        first: Math.min(Math.max(first, 1), 48),
      },
    },
    { sektorelCompanyDirectory: EMPTY_DIRECTORY },
    `location directory ${location}`,
  );

  return {
    directory: data.sektorelCompanyDirectory ?? EMPTY_DIRECTORY,
    hasError,
  };
}
