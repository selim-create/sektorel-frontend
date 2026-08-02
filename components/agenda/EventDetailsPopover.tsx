import { CalendarDays, MapPin, User2 } from "lucide-react";
import type { AgendaEvent } from "@/lib/agenda";
import { formatAgendaDate, formatAgendaTime, stripHtml } from "@/lib/agenda";

type EventDetailsPopoverProps = {
  event: AgendaEvent;
};

export default function EventDetailsPopover({ event }: EventDetailsPopoverProps) {
  const description = stripHtml(event.content) || event.excerpt || "Detaylı açıklama için etkinlik sayfasını inceleyin.";

  return (
    <div className="pointer-events-none absolute left-0 top-full z-20 mt-3 hidden w-80 border border-gray-200 bg-white p-4 text-left shadow-2xl lg:block lg:translate-y-2 lg:opacity-0 lg:transition-all lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Hızlı Önizleme
        </p>
        <p className="text-sm font-bold text-secondary">{event.title}</p>
        <p className="line-clamp-3 text-sm leading-6 text-gray-500">{description}</p>
        <div className="space-y-2 border-t border-gray-100 pt-3 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays size={13} className="text-primary" />
            <span>
              {formatAgendaDate(event.eventDetails.startDate)} · {formatAgendaTime(event.eventDetails.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-primary" />
            <span>{event.eventDetails.venue || event.city || "Online"}</span>
          </div>
          {event.eventDetails.organizer ? (
            <div className="flex items-center gap-2">
              <User2 size={13} className="text-primary" />
              <span>{event.eventDetails.organizer}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
