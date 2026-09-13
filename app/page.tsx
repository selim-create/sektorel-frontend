import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { gql } from "@apollo/client";
import {
  ArrowRight,
  Armchair,
  BadgeCheck,
  Banknote,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Factory,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Landmark,
  Layers,
  Lightbulb,
  MapPin,
  Megaphone,
  Newspaper,
  Package,
  Palette,
  Pickaxe,
  Plane,
  Search,
  Settings,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sprout,
  Stethoscope,
  Store,
  TrendingUp,
  Truck,
  Utensils,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { queryWithFallback } from "@/lib/graphql-client";

const HOME_TITLE = "Sektörel Ajanda | Türkiye'nin İş Dünyası Platformu";
const HOME_DESCRIPTION =
  "Şirketleri, sektörleri, iş dünyası haberlerini, etkinlikleri, ticari fırsatları ve kariyer ilanlarını tek akışta keşfedin.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export const revalidate = 60;

const EDITORIAL_DESKS = [
  { label: "Şirketler", slug: "sirketler-yatirimlar" },
  { label: "Sanayi & Üretim", slug: "sanayi-uretim" },
  { label: "KOBİ & Girişim", slug: "kobi-girisimcilik" },
  { label: "Teknoloji", slug: "teknoloji-dijital-donusum" },
  { label: "Finansman", slug: "finans-bankacilik" },
  { label: "İhracat", slug: "dis-ticaret-ihracat" },
  { label: "Teşvik & Mevzuat", slug: "mevzuat-tesvikler" },
  { label: "İnsan & Yönetim", slug: "istihdam-insan-kaynaklari" },
  { label: "Ekonomi", slug: "ekonomi-piyasalar" },
] as const;

const SECTOR_ICONS: Record<string, LucideIcon> = {
  Armchair,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  Car,
  Cpu,
  Factory,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Landmark,
  Layers,
  Lightbulb,
  Megaphone,
  Package,
  Palette,
  Pickaxe,
  Plane,
  Settings,
  Shirt,
  ShoppingBag,
  Sprout,
  Stethoscope,
  Store,
  Truck,
  Utensils,
  Wheat,
  Zap,
};

type Sector = {
  id: string;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
  sectorDetails?: {
    iconName?: string | null;
  } | null;
};

type Company = {
  id: string;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    address?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  sectors?: {
    nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
  locations?: {
    nodes?: Array<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
};

type EventItem = {
  id: string;
  title?: string | null;
  slug?: string | null;
  eventDetails?: {
    eventType?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    locationType?: string | null;
    venue?: string | null;
    organizer?: string | null;
  } | null;
};

type PostItem = {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

type Lead = {
  id: string;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  leadDetails?: {
    leadType?: string | null;
    status?: string | null;
    budgetString?: string | null;
    expiryDate?: string | null;
    deliveryLocation?: string | null;
    isPremium?: boolean | null;
  } | null;
  sectors?: {
    nodes?: Array<{ name?: string | null } | null> | null;
  } | null;
};

type Job = {
  id: string;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  jobDetails?: {
    companyName?: string | null;
    location?: string | null;
    workType?: string | null;
    isFeatured?: boolean | null;
    deadline?: string | null;
  } | null;
};

type HomeData = {
  sectors: { nodes: Sector[] };
  companies: { nodes: Company[] };
  events: { nodes: EventItem[] };
  posts: { nodes: PostItem[] };
  leads: { nodes: Lead[] };
  jobs: { nodes: Job[] };
};

const GET_HOME_PAGE = gql`
  query GetHomePage {
    sectors(first: 12, where: { parent: 0, orderby: COUNT, order: DESC }) {
      nodes {
        id
        name
        slug
        count
        sectorDetails {
          iconName
        }
      }
    }
    companies(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        companyDetails {
          isVerified
          address
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        sectors {
          nodes {
            name
            slug
          }
        }
        locations {
          nodes {
            name
            slug
          }
        }
      }
    }
    events(first: 30, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        eventDetails {
          eventType
          startDate
          endDate
          locationType
          venue
          organizer
        }
      }
    }
    posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
    leads(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        leadDetails {
          leadType
          status
          budgetString
          expiryDate
          deliveryLocation
          isPremium
        }
        sectors {
          nodes {
            name
          }
        }
      }
    }
    jobs(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        jobDetails {
          companyName
          location
          workType
          isFeatured
          deadline
        }
      }
    }
  }
`;

const EMPTY_HOME_DATA: HomeData = {
  sectors: { nodes: [] },
  companies: { nodes: [] },
  events: { nodes: [] },
  posts: { nodes: [] },
  leads: { nodes: [] },
  jobs: { nodes: [] },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const EVENT_MONTH_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  month: "short",
  timeZone: "UTC",
});

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value?: string | null) {
  if (!value) return "Tarih belirtilmedi";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih belirtilmedi";
  return DATE_FORMATTER.format(date);
}

function getSectorIcon(iconName?: string | null): LucideIcon {
  const normalizedName = iconName?.trim().replace(/Icon$/, "");
  return (normalizedName && SECTOR_ICONS[normalizedName]) || Layers;
}

function getInitials(value?: string | null) {
  const words = (value ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word.charAt(0).toLocaleUpperCase("tr-TR")).join("") || "SA";
}

function getPrimaryCategory(post: PostItem) {
  return (post.categories?.nodes ?? []).find((category) => category?.name && category?.slug) ?? null;
}

function getUpcomingEvents(events: EventItem[]) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const datedEvents = events
    .map((event) => {
      const startDate = event.eventDetails?.startDate ? new Date(event.eventDetails.startDate) : null;
      const endDate = event.eventDetails?.endDate ? new Date(event.eventDetails.endDate) : startDate;

      return {
        event,
        startDate,
        endDate,
      };
    })
    .filter(
      (item): item is { event: EventItem; startDate: Date; endDate: Date } =>
        Boolean(
          item.startDate &&
            item.endDate &&
            !Number.isNaN(item.startDate.getTime()) &&
            !Number.isNaN(item.endDate.getTime()),
        ),
    );

  const upcoming = datedEvents
    .filter((item) => item.endDate >= today)
    .sort((left, right) => left.startDate.getTime() - right.startDate.getTime())
    .map((item) => item.event);

  if (upcoming.length) {
    return upcoming.slice(0, 4);
  }

  return datedEvents
    .sort((left, right) => right.startDate.getTime() - left.startDate.getTime())
    .map((item) => item.event)
    .slice(0, 4);
}

export default async function Home() {
  const { data, hasError } = await queryWithFallback<HomeData>(
    { query: GET_HOME_PAGE },
    EMPTY_HOME_DATA,
    "homepage platform",
  );

  const sectors = data?.sectors?.nodes ?? [];
  const companies = data?.companies?.nodes ?? [];
  const events = data?.events?.nodes ?? [];
  const posts = data?.posts?.nodes ?? [];
  const leads = data?.leads?.nodes ?? [];
  const jobs = data?.jobs?.nodes ?? [];

  const [leadStory, ...secondaryStories] = posts.filter((post) => post.slug).slice(0, 5);
  const homepageSectors = sectors.filter((sector) => sector.slug && sector.name).slice(0, 10);
  const homepageCompanies = [...companies]
    .filter((company) => company.slug && company.title)
    .sort(
      (left, right) =>
        Number(Boolean(right.companyDetails?.isVerified)) -
        Number(Boolean(left.companyDetails?.isVerified)),
    )
    .slice(0, 4);
  const upcomingEvents = getUpcomingEvents(events.filter((event) => event.slug && event.title));
  const homepageLeads = leads.filter((lead) => lead.slug && lead.title).slice(0, 3);
  const homepageJobs = jobs.filter((job) => job.slug && job.title).slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden border border-gray-800 bg-secondary text-white">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 grid gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:px-14">
          <div>
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-gray-300">
              <Sparkles size={13} className="text-primary" />
              Türkiye iş dünyasının canlı akışı
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              İş dünyasını tek ekranda
              <span className="block text-primary">takip edin.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
              Şirketler, sektörler, yatırımlar, teşvikler, etkinlikler, ticari fırsatlar ve kariyer
              hareketleri tek bir güncel platformda buluşuyor.
            </p>

            <form action="/ara" className="mt-9 flex max-w-2xl flex-col border border-white/15 bg-white p-2 shadow-2xl sm:flex-row" method="get">
              <label className="flex min-h-14 flex-1 items-center gap-3 px-4" htmlFor="homepage-search">
                <Search className="shrink-0 text-primary" size={20} />
                <input
                  className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-gray-400"
                  id="homepage-search"
                  name="q"
                  placeholder="Firma, sektör, haber veya etkinlik ara..."
                  type="search"
                />
              </label>
              <button
                className="min-h-12 bg-primary px-7 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-hover sm:min-h-14"
                type="submit"
              >
                Keşfet
              </button>
            </form>
          </div>

          <div className="border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-400">Platform</p>
            <h2 className="mt-2 text-xl font-black">İş dünyasının dört ana akışı</h2>

            <div className="mt-6 grid grid-cols-2 gap-px bg-white/10">
              {[
                { href: "/haberler", label: "Gündem", detail: "Haber & analiz", icon: Newspaper },
                { href: "/ajanda", label: "Ajanda", detail: "Etkinlik & fuar", icon: CalendarDays },
                { href: "/firmalar", label: "Firmalar", detail: "Şirket rehberi", icon: Building2 },
                { href: "/firsatlar", label: "Fırsatlar", detail: "Ticari talepler", icon: CircleDollarSign },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className="group bg-secondary p-5 transition-colors hover:bg-white hover:text-secondary"
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="text-primary" size={20} />
                    <span className="mt-5 block text-sm font-black">{item.label}</span>
                    <span className="mt-1 block text-[11px] text-gray-400 group-hover:text-gray-500">{item.detail}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 px-6 py-5 md:px-10 lg:px-14">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">Gündem Masaları</span>
            {EDITORIAL_DESKS.map((desk) => (
              <Link
                className="border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-gray-300 transition-colors hover:border-primary hover:text-white"
                href={`/haberler/kategori/${desk.slug}`}
                key={desk.slug}
              >
                {desk.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {hasError ? (
        <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
          Bazı canlı veriler geçici olarak alınamadı. Ana sayfa erişilebilen içeriklerle gösteriliyor.
        </div>
      ) : null}

      <section>
        <div className="mb-7 flex flex-col gap-4 border-b-2 border-secondary pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
              <TrendingUp size={14} /> Gündem
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-secondary">İş dünyasında bugün</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Resmî kaynaklar, kurumlar ve sektörlerden gelen güncel gelişmeleri tek editoryal akışta takip edin.
            </p>
          </div>
          <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary" href="/haberler">
            Tüm haberler <ArrowRight size={15} />
          </Link>
        </div>

        {leadStory ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
            <article className="group relative min-h-[440px] overflow-hidden border border-gray-200 bg-secondary">
              {leadStory.featuredImage?.node?.sourceUrl ? (
                <Image
                  alt={leadStory.title || "Öne çıkan haber"}
                  className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                  fill
                  priority
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  src={leadStory.featuredImage.node.sourceUrl}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-slate-800 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-7 md:p-9">
                {getPrimaryCategory(leadStory) ? (
                  <Link
                    className="inline-flex bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white"
                    href={`/haberler/kategori/${getPrimaryCategory(leadStory)?.slug}`}
                  >
                    {getPrimaryCategory(leadStory)?.name}
                  </Link>
                ) : null}
                <h3 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white md:text-4xl">
                  <Link href={`/haber/${leadStory.slug}`}>{leadStory.title}</Link>
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">
                  {stripHtml(leadStory.excerpt).slice(0, 220) || "İş dünyasındaki son gelişmenin ayrıntılarını okuyun."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  <span>{formatDate(leadStory.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  <span>{leadStory.author?.node?.name || "Sektörel Ajanda"}</span>
                </div>
              </div>
            </article>

            <div className="divide-y divide-gray-200 border border-gray-200 bg-white">
              {secondaryStories.length ? (
                secondaryStories.map((post, index) => {
                  const category = getPrimaryCategory(post);
                  return (
                    <article className="group p-5 transition-colors hover:bg-gray-50" key={post.id}>
                      <div className="flex gap-4">
                        <span className="text-2xl font-black text-gray-200">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
                            {category ? <span className="text-primary">{category.name}</span> : null}
                            <span className="text-gray-400">{formatDate(post.date)}</span>
                          </div>
                          <h3 className="mt-2 text-base font-black leading-snug text-secondary transition-colors group-hover:text-primary">
                            <Link href={`/haber/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                            {stripHtml(post.excerpt).slice(0, 130)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="p-8 text-sm text-gray-500">Yeni haberler hazırlandıkça burada görünecek.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
            <Newspaper className="mx-auto text-gray-300" size={34} />
            <h3 className="mt-4 text-lg font-black text-secondary">Gündem akışı hazırlanıyor</h3>
            <p className="mt-2 text-sm text-gray-500">Yayınlanan yeni haberler otomatik olarak bu alana taşınacak.</p>
          </div>
        )}
      </section>

      <section className="border border-gray-800 bg-secondary px-6 py-9 text-white md:px-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
              <CalendarDays size={14} /> Yaklaşan Ajanda
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Takviminizde yer açın</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Fuarlar, zirveler, konferanslar ve iş dünyasının önemli buluşmaları tarih sırasıyla burada.
            </p>
          </div>
          <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:text-primary" href="/ajanda">
            Tüm ajanda <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {upcomingEvents.length ? (
            upcomingEvents.map((event) => {
              const date = event.eventDetails?.startDate ? new Date(event.eventDetails.startDate) : null;
              const day = date && !Number.isNaN(date.getTime()) ? date.getUTCDate() : "--";
              const month = date && !Number.isNaN(date.getTime()) ? EVENT_MONTH_FORMATTER.format(date) : "---";

              return (
                <Link
                  className="group flex min-h-56 flex-col bg-secondary p-5 transition-colors hover:bg-white hover:text-secondary"
                  href={`/ajanda/${event.slug}`}
                  key={event.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="border border-white/15 px-3 py-2 text-center group-hover:border-gray-200">
                      <span className="block text-2xl font-black">{day}</span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary">{month}</span>
                    </div>
                    <span className="max-w-[130px] text-right text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">
                      {event.eventDetails?.eventType || "Etkinlik"}
                    </span>
                  </div>
                  <h3 className="mt-6 line-clamp-3 text-lg font-black leading-snug transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-2 pt-5 text-xs text-gray-400 group-hover:text-gray-500">
                    <MapPin size={13} className="shrink-0 text-primary" />
                    <span className="line-clamp-1">{event.eventDetails?.venue || event.eventDetails?.locationType || "Online"}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full bg-secondary p-8 text-sm text-gray-400">Yaklaşan etkinlikler güncellendiğinde burada listelenecek.</div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-7 flex flex-col gap-4 border-b-2 border-secondary pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">Sektör Haritası</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-secondary">Ekonomiyi sektör sektör keşfedin</h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary" href="/sektorler">
            Tüm sektörler <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 border-l border-t border-gray-200 md:grid-cols-3 lg:grid-cols-5">
          {homepageSectors.map((sector) => {
            const Icon = getSectorIcon(sector.sectorDetails?.iconName);
            return (
              <Link
                className="group min-h-40 border-b border-r border-gray-200 bg-white p-5 transition-colors hover:bg-primary"
                href={`/sektor/${sector.slug}`}
                key={sector.id}
              >
                <div className="flex h-10 w-10 items-center justify-center border border-gray-200 text-primary transition-colors group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
                  <Icon size={19} />
                </div>
                <h3 className="mt-5 text-sm font-black leading-snug text-secondary transition-colors group-hover:text-white">{sector.name}</h3>
                <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 transition-colors group-hover:text-white/70">
                  <span>{sector.count ? `${sector.count} kayıt` : "Keşfet"}</span>
                  <ChevronRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-7 flex flex-col gap-4 border-b-2 border-secondary pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">Firma Rehberi</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-secondary">Şirketleri keşfedin, bağlantı kurun</h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary" href="/firmalar">
            Firma rehberi <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homepageCompanies.length ? (
            homepageCompanies.map((company) => {
              const imageUrl = company.featuredImage?.node?.sourceUrl?.trim();
              const sectorName = company.sectors?.nodes?.find((item) => item?.name)?.name;
              const locationName = company.locations?.nodes?.find((item) => item?.name)?.name;

              return (
                <Link
                  className="group border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                  href={`/firma/${company.slug}`}
                  key={company.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50 text-sm font-black text-secondary">
                      {imageUrl ? (
                        <Image alt={company.title || "Firma"} className="object-contain p-1.5" fill sizes="56px" src={imageUrl} />
                      ) : (
                        getInitials(company.title)
                      )}
                    </div>
                    {company.companyDetails?.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-green-700">
                        <BadgeCheck size={12} /> Onaylı
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-lg font-black leading-snug text-secondary transition-colors group-hover:text-primary">{company.title}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">{sectorName || "Firma"}</p>
                  <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <MapPin size={13} className="shrink-0" />
                    <span className="line-clamp-1">{locationName || company.companyDetails?.address || "Türkiye"}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full border border-dashed border-gray-300 bg-gray-50 p-8 text-sm text-gray-500">Firma kayıtları güncellendiğinde burada gösterilecek.</div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                <CircleDollarSign size={14} /> Ticari Fırsatlar
              </div>
              <h2 className="mt-2 text-2xl font-black text-secondary">Açık talepler ve iş fırsatları</h2>
            </div>
            <Link aria-label="Tüm fırsatlar" className="text-secondary transition-colors hover:text-primary" href="/firsatlar">
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="mt-2 divide-y divide-gray-100">
            {homepageLeads.length ? (
              homepageLeads.map((lead) => {
                const sectorName = lead.sectors?.nodes?.find((item) => item?.name)?.name;
                return (
                  <Link className="group block py-5" href={`/firsatlar/${lead.slug}`} key={lead.id}>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em]">
                      <span className="text-primary">{lead.leadDetails?.leadType || "Ticari fırsat"}</span>
                      {sectorName ? <span className="text-gray-400">{sectorName}</span> : null}
                      {lead.leadDetails?.isPremium ? <span className="bg-secondary px-2 py-0.5 text-white">Öne çıkan</span> : null}
                    </div>
                    <h3 className="mt-2 text-base font-black leading-snug text-secondary transition-colors group-hover:text-primary">{lead.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                      {lead.leadDetails?.deliveryLocation ? <span>{lead.leadDetails.deliveryLocation}</span> : null}
                      {lead.leadDetails?.budgetString ? <span className="font-bold text-secondary">{lead.leadDetails.budgetString}</span> : null}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-sm text-gray-500">Yeni ticari fırsatlar yayınlandığında burada listelenecek.</div>
            )}
          </div>

          <Link className="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary" href="/firsatlar">
            Tüm fırsatları incele <ArrowRight size={14} />
          </Link>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                <BriefcaseBusiness size={14} /> İK & Kariyer
              </div>
              <h2 className="mt-2 text-2xl font-black text-secondary">Sektörlerden yeni kariyer fırsatları</h2>
            </div>
            <Link aria-label="Tüm kariyer ilanları" className="text-secondary transition-colors hover:text-primary" href="/kariyer">
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="mt-2 divide-y divide-gray-200">
            {homepageJobs.length ? (
              homepageJobs.map((job) => (
                <Link className="group block py-5" href={`/kariyer/${job.slug}`} key={job.id}>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
                    {job.jobDetails?.companyName ? <span className="text-primary">{job.jobDetails.companyName}</span> : null}
                    {job.jobDetails?.workType ? <span>{job.jobDetails.workType}</span> : null}
                    {job.jobDetails?.isFeatured ? <span className="bg-secondary px-2 py-0.5 text-white">Öne çıkan</span> : null}
                  </div>
                  <h3 className="mt-2 text-base font-black leading-snug text-secondary transition-colors group-hover:text-primary">{job.title}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} /> {job.jobDetails?.location || "Türkiye"}
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-sm text-gray-500">Yeni kariyer ilanları yayınlandığında burada listelenecek.</div>
            )}
          </div>

          <Link className="mt-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:text-primary" href="/kariyer">
            Kariyer ilanlarını gör <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border border-orange-200 bg-orange-50 px-6 py-10 md:px-10">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-100/60 to-transparent" />
        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">Sektörel Ajanda'ya Katılın</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-secondary">Firmanızı görünür kılın, yeni iş bağlantılarına açılın.</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Firma profilinizi oluşturun; sektör, lokasyon, etkinlik ve ticari fırsat akışlarında doğru hedef kitleyle buluşun.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary-hover" href="/firma-ekle">
              Firma Ekle <ArrowRight size={14} />
            </Link>
            <Link className="inline-flex items-center gap-2 border border-secondary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-secondary transition-colors hover:bg-secondary hover:text-white" href="/firmalar">
              Firma Rehberi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
