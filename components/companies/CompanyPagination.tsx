import Link from "next/link";

type CompanyPaginationProps = {
  showingCount: number;
  hasNextPage?: boolean;
  nextCursor?: string | null;
  currentParams: Record<string, string>;
};

export default function CompanyPagination({
  showingCount,
  hasNextPage,
  nextCursor,
  currentParams,
}: CompanyPaginationProps) {
  const params = new URLSearchParams(currentParams);

  if (nextCursor) {
    params.set("after", nextCursor);
  }

  const nextHref = `/firmalar?${params.toString()}`;

  return (
    <div className="mt-8 flex flex-col items-center gap-4 border-t border-gray-200 pt-6 text-center">
      <p className="text-sm text-gray-500">Gösterilen sonuç: {showingCount}</p>
      {hasNextPage && nextCursor ? (
        <Link
          className="inline-flex items-center justify-center bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-hover"
          href={nextHref}
        >
          Daha Fazla Yükle
        </Link>
      ) : (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Tüm sonuçlar yüklendi</p>
      )}
    </div>
  );
}
