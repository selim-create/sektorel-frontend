import { addHours, format, isValid } from "date-fns";
import { tr } from "date-fns/locale";

export type AgendaTaxonomy = {
  name: string;
  slug: string;
};

export type AgendaEvent = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string | null;
  imageUrl: string | null;
  sectorLabels: AgendaTaxonomy[];
  city: string | null;
  popularityScore: number;
  eventDetails: {
    eventType: string;
    isOfficial: boolean;
    startDate: string | null;
    endDate: string | null;
    locationType: string;
    venue: string | null;
    address: string | null;
    price: string | null;
    organizer: string | null;
    registrationLink: string | null;
    officialCategory: string | null;
    officialInstitution: string | null;
    officialSourceUrl: string | null;
  };
};

export const OFFICIAL_CALENDAR_CATEGORIES = [
  { value: "vergi", label: "Vergi" },
  { value: "sgk", label: "SGK" },
  { value: "beyanname", label: "Beyanname" },
  { value: "tesvik_destek", label: "Teşvik / Destek" },
  { value: "son_basvuru", label: "Son Başvuru" },
  { value: "resmi_yukumluluk", label: "Resmî Yükümlülük" },
] as const;

const TURKISH_CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkâri",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];

export function parseEventDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return isValid(date) ? date : null;
}

export function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(value?: string | null) {
  return (value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractLikelyCity(...values: Array<string | null | undefined>) {
  const searchable = values.filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");

  const matchedCity = TURKISH_CITIES.find((city) => searchable.includes(city.toLocaleLowerCase("tr-TR")));
  if (matchedCity) {
    return matchedCity;
  }

  const fallback = values
    .find((value) => Boolean(value?.trim()))
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .at(-1);

  return fallback || null;
}

export function parsePriceValue(value?: string | null) {
  if (!value) return 0;

  const normalized = value.toLocaleLowerCase("tr-TR");
  if (
    normalized.includes("ücretsiz") ||
    normalized.includes("free") ||
    normalized.includes("davet")
  ) {
    return 0;
  }

  const numeric = normalized.replace(/\./g, "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  return numeric ? Number(numeric[0]) : null;
}

export function getEventTypeTone(eventType?: string | null) {
  const normalized = (eventType ?? "Diğer").toLocaleLowerCase("tr-TR");

  if (normalized.includes("konferans") || normalized.includes("zirve") || normalized.includes("fuar")) {
    return "blue";
  }

  if (normalized.includes("seminer") || normalized.includes("webinar")) {
    return "orange";
  }

  if (normalized.includes("workshop") || normalized.includes("atölye")) {
    return "green";
  }

  if (normalized.includes("network")) {
    return "purple";
  }

  return "gray";
}

export function getEventTypeClasses(eventType?: string | null) {
  const tone = getEventTypeTone(eventType);

  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-700";
  if (tone === "orange") return "border-orange-200 bg-orange-50 text-orange-700";
  if (tone === "green") return "border-green-200 bg-green-50 text-green-700";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-700";
  return "border-gray-200 bg-gray-100 text-gray-600";
}

export function formatAgendaDate(value?: string | null) {
  const date = parseEventDate(value);
  return date ? format(date, "d MMMM yyyy", { locale: tr }) : "Tarih belirtilmedi";
}

export function formatAgendaDateShort(value?: string | null) {
  const date = parseEventDate(value);
  return date ? format(date, "d MMM", { locale: tr }) : "--";
}

export function formatAgendaTime(value?: string | null) {
  const date = parseEventDate(value);
  return date ? format(date, "HH:mm", { locale: tr }) : "--:--";
}

export function formatMonthValue(value: Date) {
  return format(value, "yyyy-MM");
}

export function formatGoogleCalendarDate(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(event: AgendaEvent) {
  const start = parseEventDate(event.eventDetails.startDate);
  if (!start) return null;

  const end = parseEventDate(event.eventDetails.endDate) ?? addHours(start, 2);
  const description = stripHtml(event.content) || event.excerpt || event.title;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: description,
    location: event.eventDetails.venue || event.eventDetails.address || "Online",
    dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getSearchableEventText(event: AgendaEvent) {
  return [
    event.title,
    event.content,
    event.excerpt,
    event.eventDetails.eventType,
    event.eventDetails.organizer,
    event.eventDetails.venue,
    event.eventDetails.address,
    event.eventDetails.officialInstitution,
    event.eventDetails.officialCategory,
    event.city,
    ...event.sectorLabels.map((item) => item.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("tr-TR");
}
