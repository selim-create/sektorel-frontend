import { gql } from "@apollo/client";
import { queryWithFallback } from "@/lib/graphql-client";
import type { RankMathSeo } from "@/lib/rank-math-seo";

export type NewsArchivePost = {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

export type NewsTaxonomyArchive = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  count?: number | null;
  sektorelSeo?: RankMathSeo | null;
  posts?: {
    nodes?: Array<NewsArchivePost | null> | null;
    pageInfo?: {
      endCursor?: string | null;
      hasNextPage?: boolean | null;
    } | null;
  } | null;
};

type CategoryArchiveData = {
  category?: NewsTaxonomyArchive | null;
};

type TagArchiveData = {
  tag?: NewsTaxonomyArchive | null;
};

type ArchiveVariables = {
  slug: string;
  after?: string | null;
};

const POST_FIELDS = gql`
  fragment NewsTaxonomyPostFields on Post {
    id
    title
    slug
    excerpt
    date
    content
    featuredImage {
      node {
        sourceUrl
      }
    }
    categories {
      nodes {
        id
        name
        slug
      }
    }
    author {
      node {
        name
      }
    }
  }
`;

const SEO_FIELDS = gql`
  fragment NewsTaxonomySeoFields on SektorelSeo {
    title
    description
    canonicalUrl
    robots
    openGraphTitle
    openGraphDescription
    openGraphImage
    twitterTitle
    twitterDescription
    twitterImage
  }
`;

const GET_CATEGORY_ARCHIVE = gql`
  ${POST_FIELDS}
  ${SEO_FIELDS}
  query GetNewsCategoryArchive($slug: ID!, $after: String) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      count
      sektorelSeo {
        ...NewsTaxonomySeoFields
      }
      posts(first: 24, after: $after) {
        nodes {
          ...NewsTaxonomyPostFields
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const GET_TAG_ARCHIVE = gql`
  ${POST_FIELDS}
  ${SEO_FIELDS}
  query GetNewsTagArchive($slug: ID!, $after: String) {
    tag(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      count
      sektorelSeo {
        ...NewsTaxonomySeoFields
      }
      posts(first: 24, after: $after) {
        nodes {
          ...NewsTaxonomyPostFields
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export async function getNewsCategoryArchive(slug: string, after?: string) {
  const { data, hasError } = await queryWithFallback<CategoryArchiveData, ArchiveVariables>(
    {
      query: GET_CATEGORY_ARCHIVE,
      variables: { slug, after: after || null },
    },
    { category: null },
    "news category archive",
  );

  return { archive: data.category ?? null, hasError };
}

export async function getNewsTagArchive(slug: string, after?: string) {
  const { data, hasError } = await queryWithFallback<TagArchiveData, ArchiveVariables>(
    {
      query: GET_TAG_ARCHIVE,
      variables: { slug, after: after || null },
    },
    { tag: null },
    "news tag archive",
  );

  return { archive: data.tag ?? null, hasError };
}
