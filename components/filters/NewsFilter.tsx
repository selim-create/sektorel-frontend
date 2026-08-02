import Link from "next/link";
import { Filter, Search } from "lucide-react";

type CategoryOption = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
};

type NewsFilterProps = {
  categories: CategoryOption[];
  selectedCategory: string;
  selectedRange: string;
  selectedSort: string;
  searchQuery: string;
};

const DATE_OPTIONS = [
  { value: "all", label: "Tüm Zamanlar" },
  { value: "week", label: "Bu Hafta" },
  { value: "month", label: "Bu Ay" },
  { value: "year", label: "Bu Yıl" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "views", label: "En Çok Okunan" },
];

export default function NewsFilter({
  categories,
  selectedCategory,
  selectedRange,
  selectedSort,
  searchQuery,
}: NewsFilterProps) {
  return (
    <div className="border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Filtreler</p>
          <h2 className="mt-2 flex items-center gap-2 text-lg font-black text-secondary">
            <Filter size={18} className="text-primary" />
            Haber akışını özelleştirin
          </h2>
        </div>

        <Link
          className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-primary"
          href="/haberler"
        >
          Filtreleri Temizle
        </Link>
      </div>

      <form action="/haberler" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Kategori</span>
          <select
            className="h-12 border border-gray-200 bg-gray-50 px-4 text-sm text-secondary outline-none transition-colors focus:border-primary focus:bg-white"
            defaultValue={selectedCategory}
            name="category"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories
              .filter((category) => category.slug && category.name)
              .map((category) => (
                <option key={category.id ?? category.slug} value={category.slug ?? ""}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Tarih</span>
          <select
            className="h-12 border border-gray-200 bg-gray-50 px-4 text-sm text-secondary outline-none transition-colors focus:border-primary focus:bg-white"
            defaultValue={selectedRange}
            name="range"
          >
            {DATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sıralama</span>
          <select
            className="h-12 border border-gray-200 bg-gray-50 px-4 text-sm text-secondary outline-none transition-colors focus:border-primary focus:bg-white"
            defaultValue={selectedSort}
            name="sort"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Haberlerde Ara</span>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              className="h-12 w-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-secondary outline-none transition-colors focus:border-primary focus:bg-white"
              defaultValue={searchQuery}
              name="q"
              placeholder="Başlık, özet veya yazar ara"
              type="search"
            />
          </div>
        </label>

        <div className="md:col-span-2 xl:col-span-4 flex flex-wrap items-center gap-3 pt-2">
          <button
            className="bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-hover"
            type="submit"
          >
            Filtreyi Uygula
          </button>

          {searchQuery ? (
            <Link
              className="border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
              href={`/ara?q=${encodeURIComponent(searchQuery)}`}
            >
              Tüm Sitede Ara
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
