import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

type NewsCardProps = {
  post: {
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
};

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value?: string | null) {
  if (!value) return "Tarih belirtilmedi";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih belirtilmedi";

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateReadTime(value?: string | null) {
  const wordCount = stripHtml(value).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} dk`;
}

export default function NewsCard({ post }: NewsCardProps) {
  const slug = post.slug?.trim();
  const title = post.title?.trim() || "Başlıksız haber";
  const excerpt = stripHtml(post.excerpt || post.content).slice(0, 180);
  const imageUrl = post.featuredImage?.node?.sourceUrl?.trim();
  const categoryBadges = (post.categories?.nodes ?? [])
    .filter((category): category is NonNullable<typeof category> => Boolean(category?.slug && category?.name))
    .slice(0, 2);

  if (!slug) {
    return null;
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">
      <Link className="relative block h-56 overflow-hidden bg-gray-100" href={`/haber/${slug}`}>
        <Image
          alt={title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
          src={imageUrl || `https://placehold.co/960x640/f3f4f6/111827?text=${encodeURIComponent(title)}`}
          unoptimized={!imageUrl}
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {categoryBadges.map((category) => (
            <Link
              className="bg-orange-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white"
              href={`/haberler?category=${encodeURIComponent(category.slug ?? "")}`}
              key={category.id ?? `${slug}-${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <Link className="block" href={`/haber/${slug}`}>
          <h2 className="text-xl font-black leading-tight text-secondary transition-colors group-hover:text-primary">
            {title}
          </h2>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wide text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} /> {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {calculateReadTime(post.content || post.excerpt)}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={12} /> {post.author?.node?.name || "Editör"}
          </span>
        </div>

        <p className="mt-4 flex-1 text-sm leading-6 text-gray-600">
          {excerpt || "Bu haber için kısa özet bilgisi henüz paylaşılmadı."}
        </p>

        <Link
          className="mt-6 inline-flex items-center gap-2 self-start border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
          href={`/haber/${slug}`}
        >
          Oku Devam Et
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
