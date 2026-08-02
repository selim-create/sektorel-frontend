import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type NewsPaginationProps = {
  currentAfter?: string;
  nextAfter?: string | null;
  hasNextPage?: boolean;
  currentParams: Record<string, string>;
};

function buildHref(
  currentParams: Record<string, string>,
  updates: Partial<Record<"after", string | undefined>>,
) {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
      return;
    }

    params.delete(key);
  });

  const queryString = params.toString();
  return queryString ? `/haberler?${queryString}` : "/haberler";
}

export default function NewsPagination({
  currentAfter,
  nextAfter,
  hasNextPage,
  currentParams,
}: NewsPaginationProps) {
  if (!currentAfter && !hasNextPage) {
    return null;
  }

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-8">
      {currentAfter ? (
        <Link
          className="inline-flex items-center gap-2 border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
          href={buildHref(currentParams, { after: undefined })}
        >
          <ArrowLeft size={14} />
          İlk Sayfa
        </Link>
      ) : null}

      {hasNextPage && nextAfter ? (
        <Link
          className="inline-flex items-center gap-2 bg-secondary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary"
          href={buildHref(currentParams, { after: nextAfter })}
        >
          Daha Fazla Yükle
          <ArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}
