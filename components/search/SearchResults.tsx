import SearchCard, { type SearchResultItem } from "@/components/search/SearchCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type SearchResultsProps = {
  items: SearchResultItem[];
  activeTab: string;
  searchQuery: string;
  totalCount: number;
};

export default function SearchResults({ items, searchQuery, totalCount }: SearchResultsProps) {
  if (items.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
        <h2 className="text-2xl font-black text-secondary">Sonuç bulunamadı</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
          <strong>&quot;{searchQuery}&quot;</strong> için herhangi bir sonuç bulunamadı. Farklı bir arama
          terimi deneyin ya da filtreleri temizleyin.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
          <span className="font-medium">Popüler aramalar:</span>
          {["inşaat", "fuar", "ihracat", "tekstil", "yazılım"].map((term) => (
            <Link
              key={term}
              href={`/ara?q=${encodeURIComponent(term)}`}
              className="border border-gray-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
        Toplam {totalCount} sonuç
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <SearchCard key={`${item.type}-${item.id}`} item={item} searchQuery={searchQuery} />
        ))}
      </div>

      {totalCount > items.length && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/firmalar?q=${encodeURIComponent(searchQuery)}`}
            className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            Daha Fazla Sonuç
            <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
