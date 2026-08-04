import Link from "next/link";

type CompanyPaginationProps = {
  page: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentParams: Record<string, string>;
};

function pageHref(currentParams: Record<string, string>, page: number) {
  const params = new URLSearchParams(currentParams);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return query ? `/firmalar?${query}` : "/firmalar";
}

export default function CompanyPagination({
  page,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  currentParams,
}: CompanyPaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="mt-8 border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-500">Toplam {total} firma</p>
      </div>
    );
  }

  return (
    <nav className="mt-8 flex flex-col items-center gap-4 border-t border-gray-200 pt-6" aria-label="Firma sayfaları">
      <p className="text-sm text-gray-500">Sayfa {page} / {totalPages} · Toplam {total} firma</p>
      <div className="flex items-center gap-3">
        {hasPreviousPage ? (
          <Link className="border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary hover:border-primary hover:text-primary" href={pageHref(currentParams, page - 1)}>
            Önceki
          </Link>
        ) : null}
        {hasNextPage ? (
          <Link className="bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-primary-hover" href={pageHref(currentParams, page + 1)}>
            Sonraki
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
