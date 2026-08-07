import type { Metadata } from "next";
import Link from "next/link";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfToday,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  BellRing,
  Calendar,
  CalendarRange,
  ChevronRight,
  MapPin,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import EventCalendar from "@/components/agenda/EventCalendar";
import EventFilters from "@/components/agenda/EventFilters";
import EventList from "@/components/agenda/EventList";
import FallbackUI from "@/components/error/FallbackUI";
import {
  type AgendaEvent,
  type AgendaTaxonomy,
  extractLikelyCity,
  formatMonthValue,
  getSearchableEventText,
  parseEventDate,
  parsePriceValue,
  slugify,
  stripHtml,
} from "@/lib/agenda";
import { GET_AGENDA_EVENTS_PAGINATED } from "@/lib/agenda-queries";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_SECTORS } from "@/lib/queries";

export const revalidate = 60;

const EVENTS_FALLBACK = {
  events: {
    nodes: [] as EventNode[],
    pageInfo: {
      endCursor: null as string | null,
      hasNextPage: false,
    },
  },
};

const SECTORS_FALLBACK = {
  sectors: {
    nodes: [] as SectorNode[],
  },
};

type SearchParams = Promise<{
  view?: string | string[];
  scope?: string | string[];
  officialCategory?: string | string[];
  month?: string | string[];
  type?: string | string[];
  sector?: string | string[];
  location?: string | string[];
  from?: string | string[];
  to?: string | string[];
  q?: string | string[];
  sort?: string | string[];
  page?: string | string[];
  priceMax?: string | string[];
  date?: string | string[];
}>;

type EventNode = {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  date?: string | null;
  eventDetails?: {
    eventType?: string | null;
    isOfficial?: boolean | null;
    startDate?: string | null;
    endDate?: string | null;
    locationType?: string | null;
    venue?: string | null;
    address?: string | null;
    price?: string | null;
    organizer?: string | null;
    registrationLink?: string | null;
    officialCategory?: string | null;
    officialInstitution?: string | null;
    officialSourceUrl?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
};

type EventsQueryData = {
  events?: {
    nodes?: EventNode[] | null;
    pageInfo?: {
      endCursor?: string | null;
      hasNextPage?: boolean | null;
    } | null;
  } | null;
};

type SectorNode = {
  name?: string | null;
  slug?: string | null;
};

type SectorsQueryData = {
  sectors?: {
    nodes?: SectorNode[] | null;
  } | null;
};

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getValidMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    return formatMonthValue(new Date());
  }

  const [year, month] = value.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    return formatMonthValue(new Date());
  }

  return value;
}

function getMonthDate(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function buildSectorMatches(text: string, sectors: AgendaTaxonomy[]) {
  return sectors.filter((sector) => text.includes(sector.name.toLocaleLowerCase("tr-TR")));
}

function normalizeEvent(node: EventNode, sectors: AgendaTaxonomy[]): AgendaEvent | null {
  if (!node.id || !node.slug) {
    return null;
  }

  const details = node.eventDetails ?? {};
  const excerpt = stripHtml(node.content).slice(0, 220) || "Etkinlik detayları yakında paylaşılacak.";
  const searchableText = [
    node.title,
    node.content,
    details.eventType,
    details.organizer,
    details.venue,
    details.address,
    details.officialCategory,
    details.officialInstitution,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("tr-TR");

  const sectorLabels = buildSectorMatches(searchableText, sectors);
  const city = extractLikelyCity(details.venue, details.address, node.content);
  const popularityScore =
    (details.isOfficial ? 1500 : 0) +
    (node.featuredImage?.node?.sourceUrl ? 400 : 0) +
    (details.organizer ? 120 : 0) +
    excerpt.length;

  return {
    id: node.id,
    title: node.title?.trim() || "Başlıksız etkinlik",
    slug: node.slug,
    content: node.content || "",
    excerpt,
    date: node.date ?? null,
    imageUrl: node.featuredImage?.node?.sourceUrl ?? null,
    sectorLabels,
    city,
    popularityScore,
    eventDetails: {
      eventType: details.eventType?.trim() || "Diğer",
      isOfficial: Boolean(details.isOfficial),
      startDate: details.startDate ?? node.date ?? null,
      endDate: details.endDate ?? null,
      locationType: details.locationType?.trim() || "physical",
      venue: details.venue?.trim() || null,
      address: details.address?.trim() || null,
      price: details.price?.trim() || null,
      organizer: details.organizer?.trim() || null,
      registrationLink: details.registrationLink?.trim() || null,
      officialCategory: details.officialCategory?.trim() || null,
      officialInstitution: details.officialInstitution?.trim() || null,
      officialSourceUrl: details.officialSourceUrl?.trim() || null,
    },
  };
}

function sortEvents(events: AgendaEvent[], sort: string) {
  return [...events].sort((left, right) => {
    const leftDate = parseEventDate(left.eventDetails.startDate)?.getTime() ?? 0;
    const rightDate = parseEventDate(right.eventDetails.startDate)?.getTime() ?? 0;

    if (sort === "date-desc") {
      return rightDate - leftDate;
    }

    if (sort === "type") {
      return left.eventDetails.eventType.localeCompare(right.eventDetails.eventType, "tr");
    }

    if (sort === "popularity") {
      return right.popularityScore - left.popularityScore || leftDate - rightDate;
    }

    return leftDate - rightDate;
  });
}

async function fetchAllEvents() {
  const collected: EventNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let hasError = false;
  let safetyCounter = 0;

  while (hasNextPage && safetyCounter < 5 && collected.length < 300) {
    safetyCounter += 1;

    const result: { data: EventsQueryData; hasError: boolean } = await queryWithFallback<
      EventsQueryData,
      { first: number; after: string | null }
    >(
      {
        query: GET_AGENDA_EVENTS_PAGINATED,
        variables: { first: 100, after },
      },
      EVENTS_FALLBACK,
      `agenda listing page ${safetyCounter}`,
    );

    hasError = hasError || result.hasError;

    const nodes: EventNode[] = result.data?.events?.nodes ?? [];
    const pageInfo: { endCursor?: string | null; hasNextPage?: boolean | null } | null | undefined =
      result.data?.events?.pageInfo;

    collected.push(...nodes);
    after = pageInfo?.endCursor ?? null;
    hasNextPage = Boolean(pageInfo?.hasNextPage && after);
  }

  return {
    nodes: collected,
    hasError,
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const monthValue = getValidMonth(getSingleValue(params.month) || formatMonthValue(new Date()));
  const monthLabel = format(getMonthDate(monthValue), "LLLL yyyy", { locale: tr });
  const scope = getSingleValue(params.scope);

  if (scope === "official") {
    return {
      title: `Resmî ve Mali Takvim | ${monthLabel} | Sektörel Ajanda`,
      description: "Vergi, SGK, beyanname, teşvik ve resmî yükümlülük tarihlerini Sektörel Ajanda üzerinden takip edin.",
    };
  }

  return {
    title: `Etkinlik Ajandası | ${monthLabel} | Sektörel Ajanda`,
    description:
      "Sektörel etkinlik takvimi üzerinde konferans, seminer, workshop ve networking etkinliklerini filtreleyerek takip edin.",
  };
}

export default async function AgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const viewParam = getSingleValue(resolvedSearchParams.view);
  const view = viewParam === "list" ? "list" : "calendar";
  const scopeParam = getSingleValue(resolvedSearchParams.scope);
  const scope = scopeParam === "official" || scopeParam === "events" ? scopeParam : "all";
  const officialCategory = getSingleValue(resolvedSearchParams.officialCategory);
  const monthValue = getValidMonth(getSingleValue(resolvedSearchParams.month) || formatMonthValue(new Date()));
  const type = getSingleValue(resolvedSearchParams.type);
  const sector = getSingleValue(resolvedSearchParams.sector);
  const location = getSingleValue(resolvedSearchParams.location);
  const from = getSingleValue(resolvedSearchParams.from);
  const to = getSingleValue(resolvedSearchParams.to);
  const q = getSingleValue(resolvedSearchParams.q).trim();
  const sort = getSingleValue(resolvedSearchParams.sort) || "date-asc";
  const selectedDate = getSingleValue(resolvedSearchParams.date);
  const currentPage = Math.max(1, Number.parseInt(getSingleValue(resolvedSearchParams.page) || "1", 10) || 1);
  const priceMax = getSingleValue(resolvedSearchParams.priceMax) || "50000";
  const monthDate = getMonthDate(monthValue);

  const [eventsResult, sectorsResult] = await Promise.all([
    fetchAllEvents(),
    queryWithFallback<SectorsQueryData>({ query: GET_ALL_SECTORS }, SECTORS_FALLBACK, "agenda sectors"),
  ]);

  const sectorCatalog = (sectorsResult.data?.sectors?.nodes ?? [])
    .filter((item): item is SectorNode & { name: string; slug: string } => Boolean(item?.name && item.slug))
    .map((item) => ({ name: item.name, slug: item.slug }));

  const normalizedEvents = eventsResult.nodes
    .map((node) => normalizeEvent(node, sectorCatalog))
    .filter((item): item is AgendaEvent => Boolean(item))
    .filter((item) => Boolean(parseEventDate(item.eventDetails.startDate)));

  if ((eventsResult.hasError || sectorsResult.hasError) && normalizedEvents.length === 0) {
    return (
      <FallbackUI
        title="Etkinlik ajandası yüklenemedi"
        message="Etkinlik verileri şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        actionLabel="Ana sayfaya dön"
        href="/"
      />
    );
  }

  const today = startOfToday();
  const normalizedQuery = q.toLocaleLowerCase("tr-TR");
  const maxPriceValue = Number(priceMax) || 50000;
  const fromDate = from ? startOfDay(parseISO(from)) : null;
  const toDate = to ? endOfDay(parseISO(to)) : null;

  const filteredEvents = normalizedEvents.filter((event) => {
    const startDate = parseEventDate(event.eventDetails.startDate);
    if (!startDate) return false;

    if (scope === "official" && !event.eventDetails.isOfficial) {
      return false;
    }

    if (scope === "events" && event.eventDetails.isOfficial) {
      return false;
    }

    if (scope === "official" && officialCategory && event.eventDetails.officialCategory !== officialCategory) {
      return false;
    }

    if (type && scope !== "official" && event.eventDetails.eventType !== type) {
      return false;
    }

    if (sector && !event.sectorLabels.some((item) => item.slug === sector)) {
      return false;
    }

    if (location) {
      const locationSlug = slugify(location);
      const eventLocationSlug = slugify(event.city || event.eventDetails.venue || "");
      if (!eventLocationSlug || eventLocationSlug !== locationSlug) {
        return false;
      }
    }

    if (normalizedQuery && !getSearchableEventText(event).includes(normalizedQuery)) {
      return false;
    }

    if (fromDate && isBefore(startDate, fromDate)) {
      return false;
    }

    if (toDate && isAfter(startDate, toDate)) {
      return false;
    }

    if (scope !== "official") {
      const parsedPrice = parsePriceValue(event.eventDetails.price);
      if (parsedPrice !== null && parsedPrice > maxPriceValue) {
        return false;
      }
    }

    return true;
  });

  const featuredEvents = sortEvents(
    filteredEvents.filter((event) => {
      const startDate = parseEventDate(event.eventDetails.startDate);
      return Boolean(startDate && !isBefore(startDate, today));
    }),
    "popularity",
  ).slice(0, 4);

  const upcomingEvents = sortEvents(
    filteredEvents.filter((event) => {
      const startDate = parseEventDate(event.eventDetails.startDate);
      return Boolean(startDate && !isBefore(startDate, today));
    }),
    sort,
  );

  const archiveEvents = sortEvents(
    filteredEvents.filter((event) => {
      const startDate = parseEventDate(event.eventDetails.startDate);
      return Boolean(startDate && isBefore(startDate, today));
    }),
    "date-desc",
  );

  const selectedDayEvents = selectedDate
    ? sortEvents(
        filteredEvents.filter((event) => {
          const startDate = parseEventDate(event.eventDetails.startDate);
          return Boolean(startDate && isSameDay(startDate, parseISO(selectedDate)));
        }),
        sort,
      )
    : [];

  const calendarEvents = sortEvents(
    filteredEvents.filter((event) => {
      const startDate = parseEventDate(event.eventDetails.startDate);
      return Boolean(startDate && isSameMonth(startDate, monthDate));
    }),
    "date-asc",
  );

  const listSource = selectedDate ? selectedDayEvents : upcomingEvents;
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(listSource.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedList = listSource.slice((safePage - 1) * pageSize, safePage * pageSize);

  const eventTypes = Array.from(
    new Set(normalizedEvents.filter((event) => !event.eventDetails.isOfficial).map((event) => event.eventDetails.eventType)),
  ).sort((left, right) => left.localeCompare(right, "tr"));
  const matchedSectors = Array.from(
    new Map(filteredEvents.flatMap((event) => event.sectorLabels).map((item) => [item.slug, item])).values(),
  ).sort((left, right) => left.name.localeCompare(right.name, "tr"));
  const locationOptions = Array.from(new Set(normalizedEvents.map((event) => event.city).filter(Boolean) as string[])).sort((left, right) =>
    left.localeCompare(right, "tr"),
  );

  const baseParams = {
    ...(scope !== "all" ? { scope } : {}),
    ...(scope === "official" && officialCategory ? { officialCategory } : {}),
    ...(q ? { q } : {}),
    ...(type && scope !== "official" ? { type } : {}),
    ...(sector ? { sector } : {}),
    ...(location ? { location } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(sort !== "date-asc" ? { sort } : {}),
    ...(priceMax !== "50000" && scope !== "official" ? { priceMax } : {}),
    ...(view === "list" ? { view } : {}),
    month: monthValue,
    ...(selectedDate ? { date: selectedDate } : {}),
  };

  const selectedDayLabel = selectedDate
    ? format(parseISO(selectedDate), "d MMMM yyyy, EEEE", { locale: tr })
    : null;

  const listTitle = selectedDayLabel
    ? `${selectedDayLabel} Kayıtları`
    : scope === "official"
      ? "Yaklaşan resmî ve mali tarihler"
      : scope === "events"
        ? "Yaklaşan etkinlikler"
        : view === "list"
          ? "Tüm yaklaşan ajanda kayıtları"
          : "Yaklaşan ajanda kayıtları";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-16 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300">
                <Calendar size={12} className="text-primary" />
                Sektörel İş ve Resmî Takvim
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">İş Ajandası</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
                Konferanslardan workshop’lara; vergi, SGK, beyanname ve teşvik tarihlerinden networking buluşmalarına kadar iş dünyasının kritik tarihlerini tek yerde izleyin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/ajanda/olustur"
                className="inline-flex items-center gap-2 bg-primary px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-primary-hover"
              >
                <Plus size={16} /> Etkinlik Gönder
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Yaklaşan</p>
              <p className="mt-3 text-3xl font-black">{upcomingEvents.length}</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Bu ay</p>
              <p className="mt-3 text-3xl font-black">{calendarEvents.length}</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Resmî Takvim</p>
              <p className="mt-3 text-3xl font-black">{normalizedEvents.filter((event) => event.eventDetails.isOfficial).length}</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Şehir</p>
              <p className="mt-3 text-3xl font-black">{locationOptions.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-10 px-4 py-10">
        {eventsResult.hasError || sectorsResult.hasError ? (
          <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı etkinlik verileri geçici olarak alınamadı. Sayfa mevcut içeriklerle gösteriliyor.
          </div>
        ) : null}

        {featuredEvents.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                  <Sparkles size={14} className="text-primary" /> Öne Çıkan Ajanda Kayıtları
                </p>
                <h2 className="mt-2 text-2xl font-black text-secondary">Gündemdeki kritik tarihler</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-gray-500">
                İlk bakışta kaçırmamanız gereken önemli etkinlikler ve resmî duyurular.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredEvents.map((event) => (
                <article key={event.id} className="border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] ${event.eventDetails.isOfficial ? "text-red-600" : "text-primary"}`}>
                    <Star size={13} /> {event.eventDetails.isOfficial ? event.eventDetails.officialInstitution || "Resmî Takvim" : event.eventDetails.eventType}
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-xl font-black text-secondary">{event.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">{event.excerpt}</p>
                  <div className="mt-5 space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2"><CalendarRange size={15} className="text-primary" /> {format(parseEventDate(event.eventDetails.startDate)!, "d MMMM yyyy", { locale: tr })}</p>
                    <p className="flex items-center gap-2"><MapPin size={15} className="text-primary" /> {event.eventDetails.isOfficial ? event.eventDetails.officialInstitution || "Türkiye" : event.eventDetails.venue || event.city || "Online"}</p>
                  </div>
                  <Link href={`/ajanda/${event.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-secondary transition hover:text-primary">
                    İncele <ChevronRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-6">
            <EventFilters
              currentFilters={{
                view,
                scope,
                officialCategory,
                q,
                type,
                sector,
                location,
                from,
                to,
                sort,
                priceMax,
                month: monthValue,
                date: selectedDate,
              }}
              eventTypes={eventTypes}
              sectorOptions={matchedSectors.length > 0 ? matchedSectors : sectorCatalog}
              locationOptions={locationOptions}
              resultCount={filteredEvents.length}
              hasViewParam={Boolean(viewParam)}
            />

            <section className="space-y-4 border border-gray-200 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                <BellRing size={14} /> Arşiv / Son Kayıtlar
              </p>
              <div className="space-y-4">
                {archiveEvents.slice(0, 5).map((event) => (
                  <Link key={event.id} href={`/ajanda/${event.slug}`} className="block border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      {format(parseEventDate(event.eventDetails.startDate)!, "d MMM yyyy", { locale: tr })}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-secondary transition hover:text-primary">{event.title}</p>
                  </Link>
                ))}
                {archiveEvents.length === 0 ? (
                  <p className="text-sm leading-7 text-gray-500">Henüz arşivde gösterilecek tamamlanmış kayıt bulunmuyor.</p>
                ) : null}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {view !== "list" ? (
              <EventCalendar
                events={calendarEvents}
                monthDate={monthDate}
                selectedDate={selectedDate}
                baseParams={baseParams}
              />
            ) : null}

            <EventList
              events={paginatedList}
              currentPage={safePage}
              totalPages={totalPages}
              baseParams={baseParams}
              title={listTitle}
              description={
                selectedDayLabel
                  ? "Takvimde seçtiğiniz güne ait ajanda kayıtları aşağıda listelenir."
                  : scope === "official"
                    ? "Vergi, SGK, beyanname, teşvik ve diğer resmî yükümlülük tarihlerini yaklaşan tarihe göre takip edin."
                    : scope === "events"
                      ? "Fuar, webinar, konferans, eğitim ve diğer sektörel etkinlikleri yaklaşan tarihe göre keşfedin."
                      : "Takvim üzerinde işaretli günler arasından seçim yapabilir veya yaklaşan ajanda kayıtlarını aşağıdan inceleyebilirsiniz."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
