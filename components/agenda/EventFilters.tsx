"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Filter,
  Landmark,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  getEventTypeLabel,
  OFFICIAL_CALENDAR_CATEGORIES,
  type AgendaTaxonomy,
} from "@/lib/agenda";

type CurrentAgendaFilters = {
  view: string;
  scope: string;
  officialCategory: string;
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
  locationOptions: AgendaTaxonomy[];
  resultCount: number;
  hasViewParam: boolean;
};

const VIEW_STORAGE_KEY = "agenda-view-preference";
const FIELD_CLASS =
  "min-w-0 w-full border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white";
const LABEL_CLASS = "text-[11px] font-black uppercase tracking-[0.22em] text-gray-500";

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
  const [scope, setScope] = useState(currentFilters.scope || "all");
  const [officialCategory, setOfficialCategory] = useState(currentFilters.officialCategory);
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
      if (storedView === "list") params.delete("view");
      else params.set("view", storedView);
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    }
  }, [currentFilters.view, hasViewParam, pathname, router]);

  const activeCount = useMemo(() => {
    return [query, type, sector, location, from, to, officialCategory].filter(Boolean).length +
      (scope !== "all" ? 1 : 0) +
      (priceMax !== "50000" ? 1 : 0);
  }, [from, location, officialCategory, priceMax, query, scope, sector, to, type]);

  const submitFilters = (nextView = view, nextScope = scope, nextOfficialCategory = officialCategory) => {
    const params = new URLSearchParams();

    if (nextScope && nextScope !== "all") params.set("scope", nextScope);
    if (nextScope === "official" && nextOfficialCategory) params.set("officialCategory", nextOfficialCategory);
    if (query.trim()) params.set("q", query.trim());
    if (type && nextScope !== "official") params.set("type", type);
    if (sector) params.set("sector", sector);
    if (location) params.set("location", location);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (sort && sort !== "date-asc") params.set("sort", sort);
    if (priceMax && priceMax !== "50000") params.set("priceMax", priceMax);
    if (currentFilters.month) params.set("month", currentFilters.month);
    if (currentFilters.date) params.set("date", currentFilters.date);
    if (nextView === "calendar") params.set("view", "calendar");

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const handleReset = () => {
    setScope("all");
    setOfficialCategory("");
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
    if (view === "calendar") params.set("view", "calendar");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const setNextView = (nextView: string) => {
    setView(nextView);
    window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    submitFilters(nextView);
  };

  const setNextScope = (nextScope: string) => {
    setScope(nextScope);
    const nextCategory = nextScope === "official" ? officialCategory : "";
    setOfficialCategory(nextCategory);
    if (nextScope === "official") setType("");
    submitFilters(view, nextScope, nextCategory);
  };

  return (
    <aside className="min-w-0 space-y-4 xl:sticky xl:top-28 xl:self-start">
      <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-gray-400">
                <Filter size={14} /> Ajanda Filtreleri
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                <strong className="text-secondary">{resultCount}</strong> kayıt kriterlere uyuyor.
              </p>
            </div>
            {activeCount > 0 ? (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-primary transition hover:text-primary-hover"
              >
                <RotateCcw size={13} /> Temizle
              </button>
            ) : null}
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className={LABEL_CLASS}>Kapsam</p>
            <div className="mt-2 grid gap-2">
              <button
                type="button"
                onClick={() => setNextScope("all")}
                className={`flex w-full items-center justify-between border px-3 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                  scope === "all"
                    ? "border-secondary bg-secondary text-white"
                    : "border-gray-200 bg-white text-secondary hover:border-secondary"
                }`}
              >
                Tüm Ajanda <span className="text-[10px] opacity-60">Hepsi</span>
              </button>
              <button
                type="button"
                onClick={() => setNextScope("events")}
                className={`flex w-full items-center justify-between border px-3 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                  scope === "events"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Etkinlikler</span>
                <span className="text-[10px] opacity-60">Sektörel</span>
              </button>
              <button
                type="button"
                onClick={() => setNextScope("official")}
                className={`flex w-full items-center justify-between border px-3 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                  scope === "official"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-200 bg-white text-secondary hover:border-red-500 hover:text-red-600"
                }`}
              >
                <span className="inline-flex items-center gap-2"><Landmark size={14} /> Resmî Takvim</span>
                <span className="text-[10px] opacity-60">Mali</span>
              </button>
            </div>
          </div>

          {scope === "official" ? (
            <label className="block min-w-0 space-y-2">
              <span className={LABEL_CLASS}>Resmî Takvim Kategorisi</span>
              <select
                value={officialCategory}
                onChange={(event) => {
                  const nextCategory = event.target.value;
                  setOfficialCategory(nextCategory);
                  submitFilters(view, "official", nextCategory);
                }}
                className={`${FIELD_CLASS} border-red-200 bg-red-50`}
              >
                <option value="">Tüm resmî kayıtlar</option>
                {OFFICIAL_CALENDAR_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div>
            <p className={LABEL_CLASS}>Görünüm</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNextView("list")}
                className={`inline-flex min-w-0 items-center justify-center gap-2 border px-3 py-3 text-xs font-black uppercase tracking-[0.15em] transition ${
                  view === "list"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                <List size={14} /> Liste
              </button>
              <button
                type="button"
                onClick={() => setNextView("calendar")}
                className={`inline-flex min-w-0 items-center justify-center gap-2 border px-3 py-3 text-xs font-black uppercase tracking-[0.15em] transition ${
                  view === "calendar"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                <LayoutGrid size={14} /> Takvim
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 text-xs font-black uppercase tracking-[0.26em] text-gray-400">
          <SlidersHorizontal size={14} /> Kriterler
        </div>

        <form
          className="min-w-0 space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            submitFilters();
          }}
        >
          <label className="block min-w-0 space-y-2">
            <span className={LABEL_CLASS}>Ajandada Ara</span>
            <div className="flex min-w-0 border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Başlık, kurum, organizatör"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-secondary outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="shrink-0 px-3 text-gray-500 transition hover:text-primary" aria-label="Ara">
                <Search size={16} />
              </button>
            </div>
          </label>

          {scope !== "official" ? (
            <label className="block min-w-0 space-y-2">
              <span className={LABEL_CLASS}>Etkinlik Tipi</span>
              <select value={type} onChange={(event) => setType(event.target.value)} className={FIELD_CLASS}>
                <option value="">Tümü</option>
                {eventTypes.map((item) => (
                  <option key={item} value={item}>
                    {getEventTypeLabel(item)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block min-w-0 space-y-2">
            <span className={LABEL_CLASS}>Sektör</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)} className={FIELD_CLASS}>
              <option value="">Tümü</option>
              {sectorOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0 space-y-2">
            <span className={LABEL_CLASS}>Şehir / Lokasyon</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className={FIELD_CLASS}>
              <option value="">Tümü</option>
              {locationOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <p className={LABEL_CLASS}>Tarih Aralığı</p>
            <label className="block min-w-0 space-y-1.5">
              <span className="text-xs font-semibold text-gray-500">Başlangıç</span>
              <input value={from} onChange={(event) => setFrom(event.target.value)} type="date" className={FIELD_CLASS} />
            </label>
            <label className="block min-w-0 space-y-1.5">
              <span className="text-xs font-semibold text-gray-500">Bitiş</span>
              <input value={to} onChange={(event) => setTo(event.target.value)} type="date" className={FIELD_CLASS} />
            </label>
          </div>

          {scope !== "official" ? (
            <label className="block min-w-0 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className={LABEL_CLASS}>Maksimum Ücret</span>
                <span className="shrink-0 text-xs font-black text-primary">₺{Number(priceMax).toLocaleString("tr-TR")}</span>
              </div>
              <input
                value={priceMax}
                onChange={(event) => setPriceMax(event.target.value)}
                type="range"
                min="0"
                max="50000"
                step="500"
                className="block w-full accent-[rgb(var(--primary))]"
              />
            </label>
          ) : null}

          <label className="block min-w-0 space-y-2">
            <span className={LABEL_CLASS}>Sıralama</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className={FIELD_CLASS}>
              <option value="date-asc">Tarih (Yaklaşan)</option>
              <option value="date-desc">Tarih (Uzak)</option>
              <option value="type">Kayıt tipi</option>
              <option value="popularity">Öne çıkanlar</option>
            </select>
          </label>

          <button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-primary-hover">
            Filtreleri Uygula
          </button>
        </form>
      </section>
    </aside>
  );
}
