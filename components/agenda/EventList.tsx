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

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

function buildHref(baseParams: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries({ ...baseParams, ...overrides }).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/ajanda?${params.toString()}`;
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages];
}

export default function EventList({
  events,
  currentPage,
  totalPages,
  baseParams,
  title,
  description,
}: EventListProps) {
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <section className="min-w-0 space-y-5">
      <div className="border border-gray-200 bg-white px-5 py-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Liste görünümü</p>
        <h2 className="mt-2 flex items-center gap-2 text-2xl font-black text-secondary">
          <CalendarRange size={22} className="shrink-0 text-primary" />
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
        <nav
          className="flex min-w-0 flex-col gap-3 border border-gray-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
          aria-label="Ajanda sayfaları"
        >
          <div className="shrink-0 text-sm font-medium text-gray-500">
            Sayfa {currentPage} / {totalPages}
          </div>

          <div className="min-w-0 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex w-max items-center gap-1.5 whitespace-nowrap">
              <Link
                href={buildHref(baseParams, {
                  page: currentPage > 1 ? String(currentPage - 1) : undefined,
                })}
                className={`inline-flex h-9 items-center gap-1 border px-2.5 text-[11px] font-black uppercase tracking-[0.12em] ${
                  currentPage > 1
                    ? "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                    : "pointer-events-none border-gray-100 text-gray-300"
                }`}
              >
                <ChevronLeft size={13} /> Önceki
              </Link>

              {paginationItems.map((item) => {
                if (typeof item !== "number") {
                  return (
                    <span key={item} className="inline-flex h-9 w-7 items-center justify-center text-xs font-black text-gray-400">
                      …
                    </span>
                  );
                }

                const isActive = item === currentPage;
                return (
                  <Link
                    key={item}
                    href={buildHref(baseParams, { page: item === 1 ? undefined : String(item) })}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-9 min-w-9 items-center justify-center border px-2 text-xs font-black ${
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}

              <Link
                href={buildHref(baseParams, {
                  page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages),
                })}
                className={`inline-flex h-9 items-center gap-1 border px-2.5 text-[11px] font-black uppercase tracking-[0.12em] ${
                  currentPage < totalPages
                    ? "border-gray-200 text-secondary transition hover:border-primary hover:text-primary"
                    : "pointer-events-none border-gray-100 text-gray-300"
                }`}
              >
                Sonraki <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
