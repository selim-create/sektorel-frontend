"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Filter, LayoutGrid, List, RotateCcw, Search } from "lucide-react";
import type { AgendaTaxonomy } from "@/lib/agenda";

type CurrentAgendaFilters = {
  view: string;
  q: string;
  type: string;
  sector: string;
  location: string;
  from: string;
  to: string;
  sort: string;
  priceMax: string;
  month: string;
  date: string;
};

type EventFiltersProps = {
  currentFilters: CurrentAgendaFilters;
  eventTypes: string[];
  sectorOptions: AgendaTaxonomy[];
  locationOptions: string[];
  resultCount: number;
  hasViewParam: boolean;
};

const VIEW_STORAGE_KEY = "agenda-view-preference";

export default function EventFilters({
  currentFilters,
  eventTypes,
  sectorOptions,
  locationOptions,
  resultCount,
  hasViewParam,
}: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState(currentFilters.view);
  const [query, setQuery] = useState(currentFilters.q);
  const [type, setType] = useState(currentFilters.type);
  const [sector, setSector] = useState(currentFilters.sector);
  const [location, setLocation] = useState(currentFilters.location);
  const [from, setFrom] = useState(currentFilters.from);
  const [to, setTo] = useState(currentFilters.to);
  const [sort, setSort] = useState(currentFilters.sort);
  const [priceMax, setPriceMax] = useState(currentFilters.priceMax || "50000");

  useEffect(() => {
    if (hasViewParam) {
      window.localStorage.setItem(VIEW_STORAGE_KEY, currentFilters.view);
      return;
    }

    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (storedView && storedView !== currentFilters.view) {
      const params = new URLSearchParams(window.location.search);
      params.set("view", storedView);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [currentFilters.view, hasViewParam, pathname, router]);

  const activeCount = useMemo(() => {
    return [query, type, sector, location, from, to].filter(Boolean).length + (priceMax !== "50000" ? 1 : 0);
  }, [from, location, priceMax, query, sector, to, type]);

  const submitFilters = (nextView = view) => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (type) params.set("type", type);
    if (sector) params.set("sector", sector);
    if (location) params.set("location", location);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (sort && sort !== "date-asc") params.set("sort", sort);
    if (priceMax && priceMax !== "50000") params.set("priceMax", priceMax);
    if (currentFilters.month) params.set("month", currentFilters.month);
    if (currentFilters.date) params.set("date", currentFilters.date);
    if (nextView && nextView !== "calendar") params.set("view", nextView);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery("");
    setType("");
    setSector("");
    setLocation("");
    setFrom("");
    setTo("");
    setSort("date-asc");
    setPriceMax("50000");

    const params = new URLSearchParams();
    if (currentFilters.month) params.set("month", currentFilters.month);
    if (view !== "calendar") params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const setNextView = (nextView: string) => {
    setView(nextView);
    window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    submitFilters(nextView);
  };

  return (
    <aside className="space-y-5">
      <div className="border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              <Filter size={14} /> Filtreler
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-500">{resultCount} etkinlik görüntüleniyor.</p>
          </div>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:text-primary"
            >
              <RotateCcw size={13} /> Sıfırla
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setNextView("calendar")}
            className={`inline-flex items-center justify-center gap-2 border px-3 py-3 text-xs font-black uppercase tracking-[0.2em] transition ${
              view === "calendar"
                ? "border-primary bg-primary text-white"
                : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            <LayoutGrid size={14} /> Takvim
          </button>
          <button
            type="button"
            onClick={() => setNextView("list")}
            className={`inline-flex items-center justify-center gap-2 border px-3 py-3 text-xs font-black uppercase tracking-[0.2em] transition ${
              view === "list"
                ? "border-primary bg-primary text-white"
                : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            <List size={14} /> Liste
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitFilters();
          }}
        >
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Etkinlik Ara</span>
            <div className="flex border border-gray-200 bg-gray-50">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Başlık, organizatör, mekan"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-secondary outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="px-4 text-gray-500 transition hover:text-primary" aria-label="Ara">
                <Search size={16} />
              </button>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Etkinlik Tipi</span>
            <select value={type} onChange={(event) => setType(event.target.value)} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none">
              <option value="">Tümü</option>
              {eventTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sektör</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none">
              <option value="">Tümü</option>
              {sectorOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Şehir</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none">
              <option value="">Tümü</option>
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Başlangıç</span>
              <input value={from} onChange={(event) => setFrom(event.target.value)} type="date" className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none" />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Bitiş</span>
              <input value={to} onChange={(event) => setTo(event.target.value)} type="date" className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none" />
            </label>
          </div>

          <label className="block space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Maksimum Ücret</span>
              <span className="text-xs font-bold text-primary">₺{Number(priceMax).toLocaleString("tr-TR")}</span>
            </div>
            <input
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              type="range"
              min="0"
              max="50000"
              step="500"
              className="w-full accent-[rgb(var(--primary))]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sıralama</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-secondary outline-none">
              <option value="date-asc">Tarih (Yaklaşan)</option>
              <option value="date-desc">Tarih (Uzak)</option>
              <option value="type">Etkinlik tipi</option>
              <option value="popularity">Öne çıkanlar</option>
            </select>
          </label>

          <button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-primary-hover">
            Filtreleri Uygula
          </button>
        </form>
      </div>
    </aside>
  );
}
