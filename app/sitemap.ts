import type { MetadataRoute } from "next";
import { GRAPHQL_ENDPOINT } from "@/lib/error-handler";
import { absoluteUrl } from "@/lib/site";

type SitemapNode = {
  slug?: string | null;
  modified?: string | null;
};

type ConnectionResponse = {
  data?: Record<
    string,
    {
      nodes?: SitemapNode[] | null;
      pageInfo?: {
        hasNextPage?: boolean | null;
        endCursor?: string | null;
      } | null;
    } | null
  >;
};

type ConnectionDefinition = {
  name: "companies" | "sectors" | "posts" | "events" | "leads" | "jobs";
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  hasModified: boolean;
};

const CONNECTIONS: ConnectionDefinition[] = [
  { name: "companies", path: "/firma", changeFrequency: "weekly", priority: 0.8, hasModified: true },
  { name: "sectors", path: "/sektor", changeFrequency: "weekly", priority: 0.8, hasModified: false },
  { name: "posts", path: "/haber", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "events", path: "/ajanda", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "leads", path: "/firsatlar", changeFrequency: "daily", priority: 0.7, hasModified: true },
  { name: "jobs", path: "/kariyer", changeFrequency: "daily", priority: 0.7, hasModified: true },
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
];

async function fetchConnection(definition: ConnectionDefinition) {
  const nodes: SitemapNode[] = [];
  let after: string | null = null;
  let page = 0;

  do {
    const nodeFields = definition.hasModified ? "slug modified" : "slug";
    const query = `
      query Sitemap${definition.name}($first: Int!, $after: String) {
        ${definition.name}(first: $first, after: $after) {
          nodes { ${nodeFields} }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { first: 100, after },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Sitemap ${definition.name} request failed: ${response.status}`);
    }

    const payload = (await response.json()) as ConnectionResponse;
    const connection = payload.data?.[definition.name];

    nodes.push(...(connection?.nodes ?? []));
    after = connection?.pageInfo?.hasNextPage
      ? connection.pageInfo.endCursor ?? null
      : null;
    page += 1;
  } while (after && page < 50);

  return nodes
    .filter((node): node is SitemapNode & { slug: string } => Boolean(node.slug))
    .map((node): MetadataRoute.Sitemap[number] => ({
      url: absoluteUrl(`${definition.path}/${node.slug}`),
      lastModified: node.modified ? new Date(node.modified) : undefined,
      changeFrequency: definition.changeFrequency,
      priority: definition.priority,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const results = await Promise.allSettled(CONNECTIONS.map(fetchConnection));
  const dynamicRoutes = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  return [...STATIC_ROUTES, ...dynamicRoutes];
}
