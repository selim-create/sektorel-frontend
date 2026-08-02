import Link from "next/link";
import { CheckCircle2, Filter } from "lucide-react";

type FilterOption = {
  slug: string;
  name: string;
  count: number;
};

type CompanyFiltersProps = {
  sectors: FilterOption[];
  locations: FilterOption[];
  selectedSector?: string;
  selectedLocation?: string;
  selectedSort?: string;
  selectedVerified?: string;
  searchQuery?: string;
  activeFilterCount: number;
};

function buildHref(
  current: Record<string, string>,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(current);

  Object.entries(updates).forEach(([key, value]) => {
    if (!value || value === "all") {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  return query ? `/firmalar?${query}` : "/firmalar";
}

export default function CompanyFilters({
  sectors,
  locations,
  selectedSector,
  selectedLocation,
  selectedSort,
  selectedVerified,
  searchQuery,
  activeFilterCount,
}: CompanyFiltersProps) {
  const currentParams: Record<string, string> = {
    ...(selectedSort && selectedSort !== "newest" ? { sort: selectedSort } : {}),
    ...(selectedSector ? { sector: selectedSector } : {}),
    ...(selectedLocation ? { location: selectedLocation } : {}),
    ...(selectedVerified ? { verified: selectedVerified } : {}),
    ...(searchQuery ? { q: searchQuery } : {}),
  };

  return (
    <aside className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Filtreler</p>
          <h2 className="mt-2 flex items-center gap-2 text-lg font-black text-secondary">
            <Filter size={18} className="text-primary" />
            Firma sonuçları
          </h2>
        </div>
        <span className="bg-secondary px-2.5 py-1 text-xs font-bold text-white">{activeFilterCount}</span>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Doğrulama</p>
        <div className="space-y-2">
          <Link
            className={`flex items-center justify-between border px-3 py-2 text-sm transition-colors ${
              selectedVerified === "true"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-gray-200 text-secondary hover:border-primary"
            }`}
            href={buildHref(currentParams, { verified: selectedVerified === "true" ? undefined : "true" })}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={14} /> Onaylı Firmalar
            </span>
            <span>{selectedVerified === "true" ? "Açık" : "Kapalı"}</span>
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sektör</p>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <Link
              className={`flex items-center justify-between border px-3 py-2 text-sm transition-colors ${
                selectedSector === sector.slug
                  ? "border-primary bg-orange-50 text-primary"
                  : "border-gray-200 text-secondary hover:border-primary"
              }`}
              href={buildHref(currentParams, { sector: selectedSector === sector.slug ? undefined : sector.slug })}
              key={sector.slug}
            >
              <span>{sector.name}</span>
              <span className="text-xs text-gray-500">{sector.count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Şehir</p>
        <div className="space-y-2">
          {locations.map((location) => (
            <Link
              className={`flex items-center justify-between border px-3 py-2 text-sm transition-colors ${
                selectedLocation === location.slug
                  ? "border-primary bg-orange-50 text-primary"
                  : "border-gray-200 text-secondary hover:border-primary"
              }`}
              href={buildHref(currentParams, {
                location: selectedLocation === location.slug ? undefined : location.slug,
              })}
              key={location.slug}
            >
              <span>{location.name}</span>
              <span className="text-xs text-gray-500">{location.count}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link
        className="inline-flex w-full items-center justify-center border border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
        href="/firmalar"
      >
        Filtreleri Temizle
      </Link>
    </aside>
  );
}
