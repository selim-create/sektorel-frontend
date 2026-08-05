import type { Metadata } from "next";
import { gql } from "@apollo/client";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createContentMetadata } from "@/lib/content-seo";
import { queryWithFallback } from "@/lib/graphql-client";
import { absoluteUrl, SITE_NAME, stripHtml, truncateText } from "@/lib/site";

const NEWS_SEO_QUERY = gql`
  query NewsSeo($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      excerpt
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

type NewsSeoData = {
  post?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    date?: string | null;
    modified?: string | null;
    excerpt?: string | null;
    content?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    author?: { node?: { name?: string | null } | null } | null;
    categories?: { nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null } | null;
  } | null;
};

async function getPost(slug: string) {
  const { data } = await queryWithFallback<NewsSeoData>(
    { query: NEWS_SEO_QUERY, variables: { slug } },
    { post: null },
    `news seo ${slug}`,
  );
  return data.post ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return createContentMetadata({
    title: post?.title,
    slug: post?.slug,
    routePrefix: "/haber",
    descriptionSource: post?.excerpt || post?.content,
    fallbackDescription: `${post?.title || "Haber"} hakkında güncel sektörel gelişmeler.`,
    image: post?.featuredImage?.node?.sourceUrl,
    type: "article",
    publishedTime: post?.date,
    modifiedTime: post?.modified,
    authors: post?.author?.node?.name ? [post.author.node.name] : undefined,
  });
}

export default async function NewsLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post?.title || !post.slug) return children;

  const category = post.categories?.nodes?.find((item) => item?.name);
  const url = absoluteUrl(`/haber/${post.slug}`);
  const image = post.featuredImage?.node?.sourceUrl || undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: post.title,
    description: truncateText(stripHtml(post.excerpt || post.content) || `${post.title} haberi.`),
    datePublished: post.date || undefined,
    dateModified: post.modified || post.date || undefined,
    mainEntityOfPage: url,
    image: image ? [image] : undefined,
    articleSection: category?.name || undefined,
    author: {
      "@type": "Person",
      name: post.author?.node?.name || "Sektörel Ajanda Editörü",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/sektorel-ajanda-logo.svg"),
      },
    },
  };

  const breadcrumbItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Haberler", path: "/haberler" },
    ...(category?.name && category.slug
      ? [{ name: category.name, path: `/haberler/kategori/${category.slug}` }]
      : []),
    { name: post.title, path: `/haber/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={[articleSchema, createBreadcrumbSchema(breadcrumbItems)]} />
      <Breadcrumbs
        items={breadcrumbItems.map((item, index) => ({
          label: item.name,
          href: index === breadcrumbItems.length - 1 ? undefined : item.path,
        }))}
      />
      {children}
    </>
  );
}
