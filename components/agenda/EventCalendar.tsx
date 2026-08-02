import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { AgendaEvent } from "@/lib/agenda";
import { formatMonthValue, parseEventDate } from "@/lib/agenda";

type EventCalendarProps = {
  events: AgendaEvent[];
  monthDate: Date;
  selectedDate?: string;
  baseParams: Record<string, string | undefined>;
};

const WEEK_DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

function buildHref(baseParams: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries({ ...baseParams, ...overrides }).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/ajanda?${params.toString()}`;
}

export default function EventCalendar({ events, monthDate, selectedDate, baseParams }: EventCalendarProps) {
  const monthStart = startOfMonth(monthDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
  });

  const eventsByDay = new Map<string, AgendaEvent[]>();
  events.forEach((event) => {
    const date = parseEventDate(event.eventDetails.startDate);
    if (!date) return;

    const key = format(date, "yyyy-MM-dd");
    const existing = eventsByDay.get(key) ?? [];
    existing.push(event);
    eventsByDay.set(key, existing);
  });

  return (
    <section className="border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Takvim görünümü</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-black text-secondary">
            <CalendarDays className="text-primary" size={22} />
            {format(monthDate, "LLLL yyyy", { locale: tr })}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(baseParams, { month: formatMonthValue(subMonths(monthDate, 1)), date: undefined, page: undefined })}
            className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
          >
            <ChevronLeft size={14} /> Önceki
          </Link>
          <Link
            href={buildHref(baseParams, { month: formatMonthValue(new Date()), date: undefined, page: undefined })}
            className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
          >
            Bugün
          </Link>
          <Link
            href={buildHref(baseParams, { month: formatMonthValue(addMonths(monthDate, 1)), date: undefined, page: undefined })}
            className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
          >
            Sonraki <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="hidden grid-cols-7 border-b border-gray-100 bg-gray-50 text-center text-xs font-black uppercase tracking-[0.25em] text-gray-400 lg:grid">
        {WEEK_DAYS.map((label) => (
          <div key={label} className="border-r border-gray-100 px-2 py-3 last:border-r-0">
            {label}
          </div>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const isSelected = selectedDate ? key === selectedDate : false;

          return (
            <Link
              key={key}
              href={buildHref(baseParams, { date: key, view: "calendar", page: undefined })}
              className={`min-h-[130px] border-b border-r border-gray-100 p-3 transition hover:bg-orange-50 ${
                !isSameMonth(day, monthDate) ? "bg-gray-50 text-gray-300" : "bg-white text-secondary"
              } ${isSelected ? "ring-2 ring-inset ring-primary" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-8 w-8 items-center justify-center text-sm font-black ${
                    isToday(day)
                      ? "bg-primary text-white"
                      : isSameDay(day, new Date())
                      ? "border border-primary text-primary"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 ? (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {dayEvents.length} etkinlik
                  </span>
                ) : null}
              </div>

              <div className="mt-4 space-y-2">
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-none bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                    <p className="line-clamp-1">{event.title}</p>
                  </div>
                ))}
                {dayEvents.length > 0 ? <div className="h-2 w-2 rounded-full bg-primary" /> : null}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="space-y-3 p-5 lg:hidden">
        <p className="text-sm leading-7 text-gray-500">
          Mobil görünümde takvim yerine seçili ayın etkinlik listesi gösterilir. Masaüstünde tam aylık takvim ızgarası açılır.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {events.slice(0, 6).map((event) => {
            const date = parseEventDate(event.eventDetails.startDate);
            return (
              <Link
                key={event.id}
                href={buildHref(baseParams, {
                  date: date ? format(date, "yyyy-MM-dd") : undefined,
                  view: "calendar",
                  page: undefined,
                })}
                className="border border-gray-200 px-4 py-3 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
              >
                <span className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  {date ? format(date, "d MMMM", { locale: tr }) : "Tarih belirtilmedi"}
                </span>
                <span className="mt-2 block line-clamp-2">{event.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
