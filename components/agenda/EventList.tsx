import Link from "next/link";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import type { AgendaEvent } from "@/lib/agenda";
import EventCard from "@/components/agenda/EventCard";

type EventListProps = {
  events: AgendaEvent[];
  currentPage: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
  title: string;
  description: string;
};

function buildHref(baseParams: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries({ ...baseParams, ...overrides }).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/ajanda?${params.toString()}`;
}

export default function EventList({
  events,
  currentPage,
  totalPages,
  baseParams,
  title,
  description,
}: EventListProps) {
  return (
    <section className="space-y-5">
      <div className="border border-gray-200 bg-white px-5 py-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Liste görünümü</p>
        <h2 className="mt-2 flex items-center gap-2 text-2xl font-black text-secondary">
          <CalendarRange size={22} className="text-primary" />
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-500">{description}</p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm leading-7 text-gray-500 shadow-sm">
          Seçtiğiniz kriterlerle eşleşen etkinlik bulunamadı. Filtreleri temizleyip tekrar deneyin.
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex flex-col gap-3 border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-gray-500">
            Sayfa {currentPage} / {totalPages}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref(baseParams, {
                page: currentPage > 1 ? String(currentPage - 1) : undefined,
              })}
              className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] ${
                currentPage > 1
                  ? "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                  : "pointer-events-none border-gray-100 text-gray-300"
              }`}
            >
              <ChevronLeft size={14} /> Önceki
            </Link>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <Link
                  key={page}
                  href={buildHref(baseParams, { page: page === 1 ? undefined : String(page) })}
                  className={`inline-flex h-10 w-10 items-center justify-center border text-xs font-black ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
            <Link
              href={buildHref(baseParams, {
                page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages),
              })}
              className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] ${
                currentPage < totalPages
                  ? "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                  : "pointer-events-none border-gray-100 text-gray-300"
              }`}
            >
              Sonraki <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
