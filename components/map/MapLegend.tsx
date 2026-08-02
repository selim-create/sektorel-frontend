"use client";

type LegendItem = {
  key: string;
  name: string;
  color: string;
};

type MapLegendProps = {
  items: LegendItem[];
};

export default function MapLegend({ items }: MapLegendProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="absolute bottom-3 left-3 z-[500] max-w-xs border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Sektör Renkleri</p>
      <div className="mt-2 space-y-1.5">
        {items.slice(0, 6).map((item) => (
          <div className="flex items-center gap-2 text-xs text-secondary" key={item.key}>
            <span className="inline-block size-2.5" style={{ backgroundColor: item.color }} />
            <span className="line-clamp-1">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
