"use client";

import { useRouter, useSearchParams } from "next/navigation";

type SearchSidebarProps = {
  searchQuery: string;
  activeTab: string;
};

const POPULAR_SEARCHES = [
  "inşaat",
  "tekstil",
  "yazılım",
  "gıda",
  "ihracat",
  "fuar",
  "lojistik",
  "enerji",
];

export default function SearchSidebar({ searchQuery, activeTab }: SearchSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function applySearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.push(`/ara?${params.toString()}`);
  }

  return (
    <aside className="space-y-6">
      {/* Aktif filtreler */}
      <div className="border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Aktif Filtre</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Arama:</span>
            <span className="font-bold text-secondary">
              {searchQuery || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tür:</span>
            <span className="font-bold capitalize text-secondary">
              {activeTab === "all"
                ? "Tümü"
                : activeTab === "companies"
                ? "Firmalar"
                : activeTab === "posts"
                ? "Haberler"
                : activeTab === "events"
                ? "Etkinlikler"
                : "İş İlanları"}
            </span>
          </div>
        </div>
        {searchQuery && (
          <button
            className="mt-4 w-full border border-gray-200 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:border-primary hover:text-primary"
            onClick={() => applySearch("")}
          >
            Filtreyi Temizle
          </button>
        )}
      </div>

      {/* Popüler aramalar */}
      <div className="border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Popüler Aramalar
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => applySearch(term)}
              className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                searchQuery === term
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
