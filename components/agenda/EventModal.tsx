"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin, X } from "lucide-react";
import type { AgendaEvent } from "@/lib/agenda";
import { formatAgendaDate, formatAgendaTime, getEventTypeClasses } from "@/lib/agenda";
import { getAgendaLocationLabel } from "@/lib/agenda-display";

type EventModalProps = {
  event: AgendaEvent | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !event) {
    return null;
  }

  const locationLabel = getAgendaLocationLabel(event.eventDetails, event.city);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/70 px-4 py-8" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto border border-gray-200 bg-white shadow-2xl"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <span className={`inline-flex border px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${getEventTypeClasses(event.eventDetails.eventType)}`}>
              {event.eventDetails.eventType || "Diğer"}
            </span>
            <h3 className="mt-3 text-2xl font-black text-secondary">{event.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-200 p-2 text-gray-500 transition hover:border-primary hover:text-primary"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="mb-2 flex items-center gap-2 font-bold text-secondary">
                <CalendarDays size={15} className="text-primary" />
                Tarih ve Saat
              </p>
              <p>{formatAgendaDate(event.eventDetails.startDate)}</p>
              <p>{formatAgendaTime(event.eventDetails.startDate)}</p>
            </div>
            <div className="border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="mb-2 flex items-center gap-2 font-bold text-secondary">
                <MapPin size={15} className="text-primary" />
                Konum
              </p>
              <p>{locationLabel}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/ajanda/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-primary-hover"
            >
              Detaya Git <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary transition hover:border-primary hover:text-primary"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
