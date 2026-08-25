"use client";

import { Calendar, ChevronDown, Download } from "lucide-react";
import EventReminderControl from "@/components/events/EventReminderControl";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  buildGoogleCalendarUrl,
  buildIcsDataUrl,
  buildOutlookCalendarUrl,
  type CalendarEventInput,
} from "@/lib/event-calendar";

type AddToCalendarMenuProps = CalendarEventInput & {
  fileName?: string;
};

function getEventSlug(url?: string | null) {
  if (!url) return null;

  const match = url.match(/\/ajanda\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function trackCalendarProvider(provider: "google" | "outlook" | "ics") {
  trackAnalyticsEvent("add_to_calendar", { provider });
}

export default function AddToCalendarMenu({
  fileName = "sektorel-ajanda-etkinlik.ics",
  ...event
}: AddToCalendarMenuProps) {
  const googleUrl = buildGoogleCalendarUrl(event);
  const outlookUrl = buildOutlookCalendarUrl(event);
  const icsUrl = buildIcsDataUrl(event);
  const eventSlug = getEventSlug(event.url);

  return (
    <div className="space-y-3">
      <details className="group relative z-[100]">
        <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-2 border border-gray-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
          <Calendar size={14} />
          Takvime Ekle
          <ChevronDown className="transition-transform group-open:rotate-180" size={14} />
        </summary>

        <div className="absolute inset-x-0 top-full z-[110] mt-2 overflow-hidden border border-gray-200 bg-white shadow-2xl">
          <a
            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
            href={googleUrl}
            onClick={() => trackCalendarProvider("google")}
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Calendar
            <Calendar size={15} />
          </a>
          <a
            className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
            href={outlookUrl}
            onClick={() => trackCalendarProvider("outlook")}
            rel="noopener noreferrer"
            target="_blank"
          >
            Outlook Takvimi
            <Calendar size={15} />
          </a>
          <a
            className="flex items-center justify-between px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
            download={fileName}
            href={icsUrl}
            onClick={() => trackCalendarProvider("ics")}
          >
            Apple / Diğer (.ics)
            <Download size={15} />
          </a>
        </div>
      </details>

      {eventSlug ? <EventReminderControl eventSlug={eventSlug} /> : null}
    </div>
  );
}
