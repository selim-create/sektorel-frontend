"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarPlus,
  ExternalLink,
  MapPin,
  Share2,
  Ticket,
  User2,
  Video,
} from "lucide-react";
import type { AgendaEvent } from "@/lib/agenda";
import {
  buildGoogleCalendarUrl,
  formatAgendaDate,
  formatAgendaTime,
  getEventTypeClasses,
} from "@/lib/agenda";
import EventDetailsPopover from "@/components/agenda/EventDetailsPopover";
import EventModal from "@/components/agenda/EventModal";

type EventCardProps = {
  event: AgendaEvent;
  compact?: boolean;
};

const STORAGE_KEY = "agenda-reminders";

export default function EventCard({ event, compact = false }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedItems = window.localStorage.getItem(STORAGE_KEY);
      if (!savedItems) {
        setIsSaved(false);
        return;
      }

      try {
        const parsed = JSON.parse(savedItems) as string[];
        setIsSaved(parsed.includes(event.slug));
      } catch {
        setIsSaved(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [event.slug]);

  const calendarUrl = useMemo(() => buildGoogleCalendarUrl(event), [event]);

  const toggleReminder = useCallback(() => {
    const savedItems = window.localStorage.getItem(STORAGE_KEY);
    const parsed = savedItems ? ((JSON.parse(savedItems) as string[]) ?? []) : [];
    const nextItems = parsed.includes(event.slug)
      ? parsed.filter((item) => item !== event.slug)
      : [...parsed, event.slug];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setIsSaved(nextItems.includes(event.slug));
  }, [event.slug]);

  const shareEvent = useCallback(async () => {
    const url = `${window.location.origin}/ajanda/${event.slug}`;

    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `${event.title} etkinliğine göz atın.`,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
  }, [event.slug, event.title]);

  return (
    <article className="group relative overflow-visible border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`grid gap-5 p-5 ${compact ? "md:grid-cols-[120px_minmax(0,1fr)]" : "lg:grid-cols-[160px_minmax(0,1fr)]"}`}>
        <div className="border border-gray-100 bg-gray-50 p-4 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Tarih</p>
          <p className="mt-3 text-3xl font-black text-secondary">{formatAgendaDate(event.eventDetails.startDate).split(" ")[0]}</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-primary">{formatAgendaDate(event.eventDetails.startDate).split(" ").slice(1, 3).join(" ")}</p>
          <p className="mt-3 text-xs font-medium text-gray-500">{formatAgendaTime(event.eventDetails.startDate)}</p>
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${getEventTypeClasses(event.eventDetails.eventType)}`}>
              {event.eventDetails.eventType || "Diğer"}
            </span>
            {event.eventDetails.isOfficial ? (
              <span className="inline-flex border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
                Resmi
              </span>
            ) : null}
            {event.sectorLabels[0] ? (
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                {event.sectorLabels[0].name}
              </span>
            ) : null}
          </div>

          <Link href={`/ajanda/${event.slug}`} className="mt-3 inline-flex items-start gap-2 text-left">
            <h3 className="text-xl font-black leading-tight text-secondary transition group-hover:text-primary">
              {event.title}
            </h3>
            <ExternalLink size={15} className="mt-1 text-gray-300 transition group-hover:text-primary" />
          </Link>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              {event.eventDetails.locationType === "online" ? <Video size={15} className="text-primary" /> : <MapPin size={15} className="text-primary" />}
              {event.eventDetails.venue || event.city || "Online"}
            </span>
            {event.eventDetails.organizer ? (
              <span className="flex items-center gap-2">
                <User2 size={15} className="text-primary" />
                {event.eventDetails.organizer}
              </span>
            ) : null}
            {event.eventDetails.price ? (
              <span className="flex items-center gap-2">
                <Ticket size={15} className="text-primary" />
                {event.eventDetails.price}
              </span>
            ) : null}
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">{event.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {calendarUrl ? (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
              >
                <CalendarPlus size={14} /> Takvime Ekle
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
            >
              Hızlı Bakış
            </button>
            <button
              type="button"
              onClick={() => {
                void shareEvent();
              }}
              className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
            >
              <Share2 size={14} /> Paylaş
            </button>
            <button
              type="button"
              onClick={toggleReminder}
              className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${
                isSaved
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              <Bell size={14} /> {isSaved ? "Hatırlatılıyor" : "Hatırlat"
              }
            </button>
          </div>

          <EventDetailsPopover event={event} />
        </div>
      </div>

      <EventModal event={event} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </article>
  );
}
