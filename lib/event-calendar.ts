export type CalendarEventInput = {
  title: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  location?: string | null;
  url?: string | null;
};

function parseEventDate(value: string): Date {
  const trimmed = value.trim();

  if (!trimmed) {
    return new Date(Number.NaN);
  }

  if (/Z$|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  // WordPress stores datetime-local values without a timezone. Turkey uses UTC+03:00 year-round.
  const normalized = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  return new Date(`${normalized}+03:00`);
}

function resolveDates(input: CalendarEventInput) {
  const start = parseEventDate(input.startDate);
  const explicitEnd = input.endDate ? parseEventDate(input.endDate) : null;
  const end = explicitEnd && !Number.isNaN(explicitEnd.getTime())
    ? explicitEnd
    : new Date(start.getTime() + 60 * 60 * 1000);

  return { start, end };
}

function formatGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function stripHtml(value?: string | null) {
  return (value || "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .trim();
}

export function buildGoogleCalendarUrl(input: CalendarEventInput) {
  const { start, end } = resolveDates(input);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: [stripHtml(input.description), input.url].filter(Boolean).join("\n\n"),
    location: input.location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(input: CalendarEventInput) {
  const { start, end } = resolveDates(input);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: input.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: [stripHtml(input.description), input.url].filter(Boolean).join("\n\n"),
    location: input.location || "",
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function buildIcsDataUrl(input: CalendarEventInput) {
  const { start, end } = resolveDates(input);
  const description = [stripHtml(input.description), input.url].filter(Boolean).join("\n\n");
  const uidSeed = `${input.title}-${input.startDate}-${input.url || "sektorel-ajanda"}`;
  const uid = `${Buffer.from(uidSeed).toString("base64url").slice(0, 40)}@sektorelajanda.com`;
  const now = formatGoogleDate(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sektorel Ajanda//Etkinlik Takvimi//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatGoogleDate(start)}`,
    `DTEND:${formatGoogleDate(end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(input.location || "")}`,
    input.url ? `URL:${input.url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
