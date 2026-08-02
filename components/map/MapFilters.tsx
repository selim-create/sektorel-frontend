"use client";

import { Filter, RotateCcw } from "lucide-react";

type FilterOption = {
  slug: string;
  name: string;
  count: number;
};

type MapFiltersProps = {
  locations: FilterOption[];
  sectors: FilterOption[];
  selectedLocation?: string;
  selectedSector?: string;
  verifiedOnly: boolean;
  totalCount: number;
  visibleCount: number;
  onClear: () => void;
  onLocationSelect: (slug?: string) => void;
  onSectorSelect: (slug?: string) => void;
  onVerifiedToggle: () => void;
};

function FilterItem({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-full items-center justify-between border px-3 py-2 text-left text-xs transition-colors ${
        active ? "border-primary bg-orange-50 text-primary" : "border-gray-200 text-secondary hover:border-primary"
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className="text-[10px] text-gray-500">{count}</span>
    </button>
  );
}

export default function MapFilters({
  locations,
  sectors,
  selectedLocation,
  selectedSector,
  verifiedOnly,
  totalCount,
  visibleCount,
  onClear,
  onLocationSelect,
  onSectorSelect,
  onVerifiedToggle,
}: MapFiltersProps) {
  return (
    <aside className="space-y-5 border-r border-gray-200 bg-white p-4 lg:w-[320px] lg:shrink-0 lg:overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-secondary">
          <Filter size={14} className="text-primary" /> Filtreler
        </h2>
        <span className="bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {visibleCount}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Doğrulama</p>
        <FilterItem active={verifiedOnly} count={visibleCount} label="Sadece Onaylı" onClick={onVerifiedToggle} />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Sektör</p>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <FilterItem
              active={selectedSector === sector.slug}
              count={sector.count}
              key={sector.slug}
              label={sector.name}
              onClick={() => onSectorSelect(selectedSector === sector.slug ? undefined : sector.slug)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Şehir</p>
        <div className="space-y-2">
          <FilterItem
            active={!selectedLocation}
            count={totalCount}
            label="Türkiye Geneli"
            onClick={() => onLocationSelect(undefined)}
          />
          {locations.map((location) => (
            <FilterItem
              active={selectedLocation === location.slug}
              count={location.count}
              key={location.slug}
              label={location.name}
              onClick={() => onLocationSelect(selectedLocation === location.slug ? undefined : location.slug)}
            />
          ))}
        </div>
      </div>

      <button
        className="inline-flex w-full items-center justify-center gap-2 border border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary hover:border-primary hover:text-primary"
        onClick={onClear}
        type="button"
      >
        <RotateCcw size={12} /> Filtreleri Temizle
      </button>
    </aside>
  );
}
