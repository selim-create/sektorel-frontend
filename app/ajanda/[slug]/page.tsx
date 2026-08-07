import Link from "next/link";
import { gql } from "@apollo/client";
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Ticket,
  User,
  Video,
} from "lucide-react";
import AddToCalendarMenu from "@/components/events/AddToCalendarMenu";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";

const GET_EVENT_DATA = gql`
  query GetEventData($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      eventDetails {
        isOfficial
        eventType
        startDate
        endDate
        locationType
        venue
        address
        organizer
        price
        registrationLink
        schedule {
          time
          title
        }
        speakers {
          name
          title
          company
          image
        }
      }
    }
  }
`;

type ScheduleItem = {
  time?: string | null;
  title?: string | null;
};

type Speaker = {
  name?: string | null;
  title?: string | null;
  company?: string | null;
  image?: string | null;
};

type EventDetails = {
  isOfficial?: boolean | null;
  eventType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  locationType?: "physical" | "online" | string | null;
  venue?: string | null;
  address?: string | null;
  organizer?: string | null;
  price?: string | null;
  registrationLink?: string | null;
  schedule?: Array<ScheduleItem | null> | null;
  speakers?: Array<Speaker | null> | null;
};

type EventData = {
  event?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    content?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    eventDetails?: EventDetails | null;
  } | null;
};

function validItems<T>(items?: Array<T | null> | null): T[] {
  return (items ?? []).filter((item): item is T => Boolean(item));
}

function safeDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, hasError } = await queryWithFallback<EventData>(
    {
      query: GET_EVENT_DATA,
      variables: { slug },
    },
    { event: null },
    `event detail ${slug}`,
  );

  const event = data?.event;

  if (!event?.title) {
    return hasError ? (
      <FallbackUI
        actionLabel="Ajandaya dön"
        href="/ajanda"
        message="Etkinlik detayları şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        title="Etkinlik verisi yüklenemedi"
      />
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Etkinlik Bulunamadı</h1>
          <p className="mb-4 text-gray-500">Aradığınız etkinlik süresi dolmuş veya kaldırılmış olabilir.</p>
          <Link className="flex items-center justify-center gap-2 font-bold text-primary hover:underline" href="/ajanda">
            <ArrowLeft size={16} /> Ajandaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const details = event.eventDetails ?? {};
  const startDate = safeDate(details.startDate);
  const endDate = safeDate(details.endDate);
  const formattedDate = startDate
    ? startDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "Tarih belirtilmedi";
  const formattedTime = startDate
    ? startDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "Saat belirtilmedi";
  const endFormattedDate = endDate
    ? endDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
    : null;
  const schedule = validItems(details.schedule);
  const speakers = validItems(details.speakers);
  const coverImage =
    event.featuredImage?.node?.sourceUrl ||
    `https://placehold.co/1200x500/111827/FFF?text=${encodeURIComponent(event.title)}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const eventUrl = `${siteUrl}/ajanda/${event.slug || slug}`;
  const location = [details.venue, details.address].filter(Boolean).join(", ") ||
    (details.locationType === "online" ? "Online" : "Konum belirtilmedi");
  const calendarFileName = `${event.slug || slug}.ics`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="relative bg-secondary text-white">
        <div className="absolute inset-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={event.title} className="h-full w-full object-cover" src={coverImage} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 pb-12 pt-32">
          <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link className="transition hover:text-white" href="/">Anasayfa</Link>
            <ChevronRight size={12} />
            <Link className="transition hover:text-white" href="/ajanda">Ajanda</Link>
            <ChevronRight size={12} />
            <span className="text-primary">{details.eventType || "Etkinlik"}</span>
          </div>

          <div className="flex flex-col items-end justify-between gap-8 md:flex-row">
            <div>
              <div className={`mb-4 inline-flex items-center gap-2 border px-3 py-1 text-xs font-bold uppercase tracking-widest ${details.isOfficial ? "border-red-500/50 bg-red-500/20 text-red-400" : "border-primary/50 bg-primary/20 text-primary"}`}>
                {details.isOfficial ? <AlertCircle size={12} /> : <Calendar size={12} />}
                {details.eventType || "Etkinlik"}
              </div>
              <h1 className="max-w-4xl text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                {event.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/10 p-2"><Calendar size={16} /></div>
                  <span>{formattedDate} {endFormattedDate ? `- ${endFormattedDate}` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/10 p-2"><MapPin size={16} /></div>
                  <span>{details.venue || (details.locationType === "online" ? "Online Platform" : "Konum Belirtilmedi")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          <main className="w-full space-y-12 lg:w-2/3">
            <section className="border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-black uppercase tracking-tight text-secondary">
                <span className="block h-6 w-1.5 bg-primary" /> Etkinlik Hakkında
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-600 prose-a:text-primary prose-headings:font-bold prose-headings:text-secondary prose-li:marker:text-primary"
                dangerouslySetInnerHTML={{ __html: event.content || "<p>Detaylı açıklama bulunmamaktadır.</p>" }}
              />
            </section>

            {!details.isOfficial && schedule.length > 0 ? (
              <section className="border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-black uppercase tracking-tight text-secondary">
                  <span className="block h-6 w-1.5 bg-primary" /> Program Akışı
                </h2>
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent md:before:mx-auto md:before:translate-x-0">
                  {schedule.map((item, index) => (
                    <div className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse" key={`${item.time}-${item.title}-${index}`}>
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-primary text-white shadow md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
                        <Clock size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] rounded border border-gray-100 bg-gray-50 p-4 shadow-sm md:w-[calc(50%-2.5rem)]">
                        <time className="mb-1 block text-xs font-bold text-primary">{item.time}</time>
                        <div className="text-sm font-bold text-secondary">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {!details.isOfficial && speakers.length > 0 ? (
              <section>
                <h2 className="mb-6 flex items-center gap-2 text-xl font-black uppercase tracking-tight text-secondary">
                  <span className="block h-6 w-1.5 bg-primary" /> Konuşmacılar
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {speakers.map((speaker, index) => (
                    <div className="group flex items-center gap-4 border border-gray-200 bg-white p-4 transition-colors hover:border-primary" key={`${speaker.name}-${index}`}>
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-200">
                        {speaker.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={speaker.name || "Konuşmacı"} className="h-full w-full object-cover transition-transform group-hover:scale-110" src={speaker.image} />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400"><User size={24} /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary">{speaker.name}</h4>
                        <span className="block text-xs text-gray-500">{speaker.title}</span>
                        <span className="text-xs font-bold text-primary">{speaker.company}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </main>

          <aside className="w-full space-y-6 lg:w-1/3">
            <div className={`sticky top-24 border bg-white p-6 shadow-sm ${details.isOfficial ? "border-red-200 border-t-4 border-t-red-500" : "border-gray-200 border-t-4 border-t-primary"}`}>
              <h3 className="mb-6 flex items-center justify-between border-b border-gray-100 pb-2 text-sm font-black uppercase tracking-widest text-secondary">
                Etkinlik Detayları
                {details.isOfficial ? <AlertCircle className="text-red-500" size={18} /> : null}
              </h3>

              <ul className="mb-8 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 shrink-0 text-gray-400" size={16} />
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Tarih</span>
                    <span className="font-medium text-secondary">{formattedDate}</span>
                    {endFormattedDate ? <span className="ml-1 text-xs text-gray-400">- {endFormattedDate}</span> : null}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 shrink-0 text-gray-400" size={16} />
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Saat</span>
                    <span className="font-medium text-secondary">{formattedTime}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  {details.locationType === "online" ? <Video className="mt-0.5 shrink-0 text-gray-400" size={16} /> : <MapPin className="mt-0.5 shrink-0 text-gray-400" size={16} />}
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Lokasyon</span>
                    <span className="block font-medium text-secondary">{details.venue || (details.locationType === "online" ? "Online" : "Belirtilmedi")}</span>
                    {details.address ? <span className="text-xs text-gray-500">{details.address}</span> : null}
                  </div>
                </li>
                {!details.isOfficial && details.price ? (
                  <li className="flex items-start gap-3">
                    <Ticket className="mt-0.5 shrink-0 text-gray-400" size={16} />
                    <div>
                      <span className="block text-xs font-bold uppercase text-gray-400">Giriş Ücreti</span>
                      <span className="font-bold text-primary">{details.price}</span>
                    </div>
                  </li>
                ) : null}
              </ul>

              <div className="space-y-3">
                {details.registrationLink && !details.isOfficial ? (
                  <a className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl" href={details.registrationLink} rel="noopener noreferrer" target="_blank">
                    <Ticket size={18} /> Online Kayıt Ol
                  </a>
                ) : details.isOfficial ? (
                  <div className="flex w-full items-center justify-center gap-2 bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
                    <Info size={18} /> Resmi Takvim
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center gap-2 bg-gray-300 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Kayıt Gerekmiyor
                  </div>
                )}

                {details.startDate ? (
                  <AddToCalendarMenu
                    description={event.content}
                    endDate={details.endDate}
                    fileName={calendarFileName}
                    location={location}
                    startDate={details.startDate}
                    title={event.title}
                    url={eventUrl}
                  />
                ) : null}
              </div>
            </div>

            {!details.isOfficial && details.organizer ? (
              <div className="border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Organizatör</h3>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-bold text-gray-400">
                    <Building size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary">{details.organizer}</h4>
                    <span className="text-xs text-gray-500">Etkinlik Sahibi</span>
                  </div>
                </div>
              </div>
            ) : null}

            {details.locationType === "physical" ? (
              <div className="group relative h-48 cursor-pointer overflow-hidden border border-gray-300 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                    <MapPin size={16} /> Haritada Göster
                  </span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
