import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gql } from "@apollo/client";
import { ArrowLeft, UserRound } from "lucide-react";
import NewsCard from "@/components/cards/NewsCard";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";

const GET_AUTHOR = gql`
  query SektorelNewsAuthor($slug: ID!, $after: String) {
    user(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      avatar { url }
      posts(first: 18, after: $after, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          content
          featuredImage { node { sourceUrl } }
          categories { nodes { id name slug } }
          author { node { name } }
        }
        pageInfo { endCursor hasNextPage }
      }
    }
  }
`;

type Post = {
  id: string; title?: string | null; slug?: string | null; excerpt?: string | null;
  date?: string | null; content?: string | null;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
  categories?: { nodes?: Array<{ id?: string | null; name?: string | null; slug?: string | null } | null> | null } | null;
  author?: { node?: { name?: string | null } | null } | null;
};
type Author = {
  name: string; slug: string; description?: string | null; avatar?: { url?: string | null } | null;
  posts?: { nodes?: Array<Post | null> | null; pageInfo?: { endCursor?: string | null; hasNextPage?: boolean | null } | null } | null;
};
type Result = { user?: Author | null };
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ after?: string | string[] }> };

async function getAuthor(slug: string, after?: string) {
  return queryWithFallback<Result>(
    { query: GET_AUTHOR, variables: { slug, after: after || null } },
    { user: null },
    `news author ${slug}`,
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getAuthor(slug);
  if (!data.user) return { title: "Yazar bulunamadı", robots: { index: false, follow: true } };
  return { title: `${data.user.name} | Yazar Yazıları`,
    description: `${data.user.name} tarafından Sektörel Ajanda'da yayımlanan haberler ve analizler.`,
    alternates: { canonical: `/yazar/${encodeURIComponent(slug)}` } };
}

export default async function NewsAuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const raw = (await searchParams).after;
  const after = (Array.isArray(raw) ? raw[0] : raw)?.trim() || "";
  const { data, hasError } = await getAuthor(slug, after);
  const author = data.user;
  if (!author) {
    if (!hasError) notFound();
    return <FallbackUI title="Yazar sayfası yüklenemedi" message="Yazar bilgileri şu anda alınamıyor." actionLabel="Haberlere dön" href="/haberler" />;
  }
  const posts = (author.posts?.nodes || []).filter((p): p is Post => Boolean(p?.id && p.slug));
  const pageInfo = author.posts?.pageInfo;
  const base = `/yazar/${encodeURIComponent(author.slug || slug)}`;
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="border-b border-gray-200 bg-white px-4 py-14">
        <div className="container mx-auto max-w-6xl">
          <Link href="/haberler" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary"><ArrowLeft size={15} /> Haberlere dön</Link>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {author.avatar?.url ? <img src={author.avatar.url} alt="" className="h-24 w-24 rounded-full object-cover" /> :
              <span className="grid h-24 w-24 place-items-center rounded-full bg-gray-100"><UserRound size={40} /></span>}
            <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Sektörel Ajanda Yazarı</p>
              <h1 className="mt-2 text-3xl font-black text-secondary md:text-5xl">{author.name}</h1>
              {author.description && <p className="mt-4 max-w-2xl text-gray-600">{author.description.replace(/<[^>]*>/g, "")}</p>}
            </div>
          </div>
        </div>
      </section>
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-7 text-xl font-black uppercase text-secondary">Yazarın Haberleri</h2>
        {hasError && <p className="mb-6 border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">Bazı haberler yüklenemedi.</p>}
        {posts.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => <NewsCard key={post.id} post={post} />)}
        </div> : <p className="bg-white p-10 text-gray-500">Bu yazara ait yayımlanmış haber bulunamadı.</p>}
        <nav className="mt-10 flex flex-wrap justify-center gap-4" aria-label="Yazar yazıları sayfalama">
          {after && <Link href={base} className="border border-gray-300 px-5 py-3 text-sm font-bold">İlk Sayfa</Link>}
          {pageInfo?.hasNextPage && pageInfo.endCursor && <Link href={`${base}?after=${encodeURIComponent(pageInfo.endCursor)}`} className="bg-secondary px-5 py-3 text-sm font-bold text-white">Daha Fazla Yükle</Link>}
        </nav>
      </main>
    </div>
  );
}
