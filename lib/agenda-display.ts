export type AgendaLocationDetails = {
  locationType?: string | null;
  venue?: string | null;
  address?: string | null;
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function cleanAgendaText(value?: string | null) {
  const decoded = decodeHtmlEntities(value ?? "");

  return decoded
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPlausibleOnlineVenue(value: string) {
  if (!value) return false;

  const wordCount = value.split(/\s+/).filter(Boolean).length;
  return value.length <= 80 && wordCount <= 10;
}

export function getAgendaLocationLabel(
  details: AgendaLocationDetails,
  city?: string | null,
) {
  const venue = cleanAgendaText(details.venue);
  const address = cleanAgendaText(details.address);
  const cityLabel = cleanAgendaText(city);

  if ((details.locationType ?? "").toLocaleLowerCase("tr-TR") === "online") {
    return isPlausibleOnlineVenue(venue) ? venue : "Online";
  }

  return venue || cityLabel || address || "Konum belirtilmedi";
}
