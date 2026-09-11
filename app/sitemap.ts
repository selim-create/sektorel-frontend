import type { MetadataRoute } from "next";
import { GRAPHQL_ENDPOINT } from "@/lib/error-handler";
import { absoluteUrl } from "@/lib/site";

type SitemapNode = {
  slug?: string | null;
  modified?: string | null;
};

type ConnectionPageInfo = {
  hasNextPage?: boolean | null;
  endCursor?: string | null;
};

type ConnectionResponse = {
  data?: Record<
    string,
    {
      nodes?: SitemapNode[] | null;
      pageInfo?: ConnectionPageInfo | null;
    } | null
  >;
};

type LocationOption = {
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  type?: string | null;
  parentId?: number | null;
};

type LocationOptionsResponse = {
  data?: {
    sektorelLocationOptions?: Array<LocationOption | null> | null;
  };
};

type CompanySitemapNode = SitemapNode & {
  sectors?: {
    nodes?: Array<{ slug?: string | null } | null> | null;
  } | null;
  locations?: {
    nodes?: Array<{ slug?: string | null } | null> | null;
  } | null;
};

type CompanySitemapResponse = {
  data?: {
    companies?: {
      nodes?: Array<CompanySitemapNode | null> | null;
      pageInfo?: ConnectionPageInfo | null;
    } | null;
  };
};

type LocationSnapshot = {
  cities: Array<LocationOption & { slug: string }>;
  districts: Array<{
    citySlug: string;
    district: LocationOption & { slug: string };
  }>;
};

type ConnectionDefinition = {
  name: "sectors" | "posts" | "events" | "leads" | "jobs" | "categories" | "tags";
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  hasModified: boolean;
  whereClause?: string;
};

const SITEMAP_REVALIDATE_SECONDS = 3600;
const DISTRICT_BATCH_SIZE = 8;

const CONNECTIONS: ConnectionDefinition[] = [
  { name: "sectors", path: "/sektor", changeFrequency: "weekly", priority: 0.8, hasModified: false },
  { name: "posts", path: "/haber", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "events", path: "/ajanda", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "leads", path: "/firsatlar", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "jobs", path: "/kariyer", changeFrequency: "daily", priority: 0.7, hasModified: true },
  {
    name: "categories",
    path: "/haberler/kategori",
    changeFrequency: "daily",
    priority: 0.65,
    hasModified: false,
    whereClause: ", where: { hideEmpty: true }",
  },
  {
    name: "tags",
    path: "/haberler/etiket",
    changeFrequency: "daily",
    priority: 0.55,
    hasModified: false,
    whereClause: ", where: { hideEmpty: true }",
  },
];

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
  { url: absoluteUrl("/firmalar"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/sektorler"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/haberler"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/ajanda"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/firsatlar"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/kariyer"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/harita"), changeFrequency: "weekly", priority: 0.7 },
  { url: absoluteUrl("/hakkimizda"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/iletisim"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/reklam-verin"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/yardim"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/kullanim-kosullari"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/gizlilik-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/cerez-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/cerez-tercihleri"), changeFrequency: "yearly", priority: 0.2 },
  { url: absoluteUrl("/kvkk"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/aydinlatma-metni"), changeFrequency: "yearly", priority: 0.3 },
];

async function postGraphQL<TData>(
  query: string,
  variables: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Sitemap request failed: ${response.status}`);
  }

  return (await response.json()) as TData;
}

function getNextCursor(pageInfo?: ConnectionPageInfo | null, seenCursors?: Set<string>) {
  if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return null;
  if (seenCursors?.has(pageInfo.endCursor)) return null;
  return pageInfo.endCursor;
}

async function fetchConnection(definition: ConnectionDefinition) {
  const nodes: SitemapNode[] = [];
  const seenCursors = new Set<string>();
  let after: string | null = null;

  do {
    const nodeFields = definition.hasModified ? "slug modified" : "slug";
    const query = `
      query Sitemap${definition.name}($first: Int!, $after: String) {
        ${definition.name}(first: $first, after: $after${definition.whereClause ?? ""}) {
          nodes { ${nodeFields} }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    const payload: ConnectionResponse = await postGraphQL<ConnectionResponse>(query, {
      first: 100,
      after,
    });
    const connection = payload.data?.[definition.name];

    nodes.push(...(connection?.nodes ?? []));

    const nextCursor = getNextCursor(connection?.pageInfo, seenCursors);
    if (!nextCursor) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return nodes
    .filter((node): node is SitemapNode & { slug: string } => Boolean(node.slug))
    .map((node): MetadataRoute.Sitemap[number] => ({
      url: absoluteUrl(`${definition.path}/${node.slug}`),
      lastModified: node.modified ? new Date(node.modified) : undefined,
      changeFrequency: definition.changeFrequency,
      priority: definition.priority,
    }));
}

async function fetchCompanySitemapNodes() {
  const nodes: CompanySitemapNode[] = [];
  const seenCursors = new Set<string>();
  let after: string | null = null;

  do {
    const query = `
      query SitemapCompanies($first: Int!, $after: String) {
        companies(first: $first, after: $after) {
          nodes {
            slug
            modified
            sectors { nodes { slug } }
            locations { nodes { slug } }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    const payload = await postGraphQL<CompanySitemapResponse>(query, {
      first: 100,
      after,
    });
    const connection = payload.data?.companies;

    nodes.push(
      ...(connection?.nodes ?? []).filter(
        (node): node is CompanySitemapNode => Boolean(node),
      ),
    );

    const nextCursor = getNextCursor(connection?.pageInfo, seenCursors);
    if (!nextCursor) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return nodes;
}

function buildCompanyRoutes(companies: CompanySitemapNode[]): MetadataRoute.Sitemap {
  return companies
    .filter((company): company is CompanySitemapNode & { slug: string } => Boolean(company.slug))
    .map((company) => ({
      url: absoluteUrl(`/firma/${company.slug}`),
      lastModified: company.modified ? new Date(company.modified) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
}

async function fetchLocationOptions(type: "city" | "district", parentSlug?: string) {
  const query = `
    query SitemapLocationOptions($type: String!, $parentSlug: String, $first: Int!) {
      sektorelLocationOptions(type: $type, parentSlug: $parentSlug, first: $first) {
        databaseId
        name
        slug
        type
        parentId
      }
    }
  `;

  const payload = await postGraphQL<LocationOptionsResponse>(query, {
    type,
    parentSlug: parentSlug ?? null,
    first: 200,
  });

  return (payload.data?.sektorelLocationOptions ?? []).filter(
    (option): option is LocationOption & { slug: string } => Boolean(option?.slug),
  );
}

async function fetchLocationSnapshot(): Promise<LocationSnapshot> {
  const cities = await fetchLocationOptions("city");
  const districts: LocationSnapshot["districts"] = [];

  for (let index = 0; index < cities.length; index += DISTRICT_BATCH_SIZE) {
    const batch = cities.slice(index, index + DISTRICT_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((city) => fetchLocationOptions("district", city.slug)),
    );

    results.forEach((result, resultIndex) => {
      if (result.status !== "fulfilled") return;
      const city = batch[resultIndex];
      if (!city) return;

      result.value.forEach((district) => {
        districts.push({ citySlug: city.slug, district });
      });
    });
  }

  return { cities, districts };
}

function buildLocationRoutes(snapshot: LocationSnapshot): MetadataRoute.Sitemap {
  const cityRoutes: MetadataRoute.Sitemap = snapshot.cities.map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const districtRoutes: MetadataRoute.Sitemap = snapshot.districts.map(({ citySlug, district }) => ({
    url: absoluteUrl(`/${citySlug}/${district.slug}`),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...cityRoutes, ...districtRoutes];
}

function buildCitySectorRoutes(
  companies: CompanySitemapNode[],
  snapshot: LocationSnapshot,
): MetadataRoute.Sitemap {
  const citySlugs = new Set(snapshot.cities.map((city) => city.slug));
  const districtToCity = new Map(
    snapshot.districts.map(({ citySlug, district }) => [district.slug, citySlug]),
  );
  const combinations = new Set<string>();

  companies.forEach((company) => {
    const sectors = (company.sectors?.nodes ?? [])
      .map((sector) => sector?.slug)
      .filter((slug): slug is string => Boolean(slug));
    const locations = (company.locations?.nodes ?? [])
      .map((location) => location?.slug)
      .filter((slug): slug is string => Boolean(slug));
    const companyCities = new Set<string>();

    locations.forEach((locationSlug) => {
      if (citySlugs.has(locationSlug)) companyCities.add(locationSlug);
      const parentCity = districtToCity.get(locationSlug);
      if (parentCity) companyCities.add(parentCity);
    });

    companyCities.forEach((citySlug) => {
      sectors.forEach((sectorSlug) => {
        combinations.add(`${citySlug}/${sectorSlug}-firmalari`);
      });
    });
  });

  return Array.from(combinations).map((path) => ({
    url: absoluteUrl(`/${path}`),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const emptyLocations: LocationSnapshot = { cities: [], districts: [] };
  const [connectionResults, companies, locationSnapshot] = await Promise.all([
    Promise.allSettled(CONNECTIONS.map(fetchConnection)),
    fetchCompanySitemapNodes().catch(() => [] as CompanySitemapNode[]),
    fetchLocationSnapshot().catch(() => emptyLocations),
  ]);

  const dynamicRoutes = connectionResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
  const companyRoutes = buildCompanyRoutes(companies);
  const locationRoutes = buildLocationRoutes(locationSnapshot);
  const citySectorRoutes = buildCitySectorRoutes(companies, locationSnapshot);

  return [
    ...STATIC_ROUTES,
    ...dynamicRoutes,
    ...companyRoutes,
    ...locationRoutes,
    ...citySectorRoutes,
  ];
}
