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
  selectedLocations: string[];
  selectedSectors: string[];
  verifiedOnly: boolean;
  visibleCount: number;
  onClear: () => void;
  onLocationToggle: (slug: string) => void;
  onSectorToggle: (slug: string) => void;
  onVerifiedToggle: () => void;
};

function CheckboxItem({
  checked,
  count,
  label,
  onChange,
}: {
  checked: boolean;
  count: number;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between border border-gray-200 px-3 py-2 text-xs text-secondary hover:border-primary">
      <span className="inline-flex items-center gap-2">
        <input checked={checked} className="size-3.5 accent-primary" onChange={onChange} type="checkbox" />
        {label}
      </span>
      <span className="text-[10px] text-gray-500">{count}</span>
    </label>
  );
}

export default function MapFilters({
  locations,
  sectors,
  selectedLocations,
  selectedSectors,
  verifiedOnly,
  visibleCount,
  onClear,
  onLocationToggle,
  onSectorToggle,
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
        <CheckboxItem checked={verifiedOnly} count={visibleCount} label="Sadece Onaylı" onChange={onVerifiedToggle} />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Sektör</p>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <CheckboxItem
              checked={selectedSectors.includes(sector.slug)}
              count={sector.count}
              key={sector.slug}
              label={sector.name}
              onChange={() => onSectorToggle(sector.slug)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Şehir</p>
        <div className="space-y-2">
          {locations.map((location) => (
            <CheckboxItem
              checked={selectedLocations.includes(location.slug)}
              count={location.count}
              key={location.slug}
              label={location.name}
              onChange={() => onLocationToggle(location.slug)}
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
