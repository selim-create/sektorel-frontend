import Link from "next/link";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_SECTORS, GET_COMPANIES, GET_EVENTS } from "@/lib/queries";
import {
  ArrowRight,
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
  MapPin,
  Megaphone,
  Package,
  Palette,
  Pickaxe,
  Plane,
  Search,
  Settings,
  Shirt,
  ShoppingBag,
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

export const revalidate = 60;

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

const EVENT_MONTH_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  month: "short",
  timeZone: "UTC",
});

function getSectorIcon(iconName?: string | null): LucideIcon {
  const normalizedName = iconName?.trim().replace(/Icon$/, "");
  return (normalizedName && SECTOR_ICONS[normalizedName]) || Layers;
}

export default async function Home() {
  const [
    { data: sectorData, hasError: sectorError },
    { data: companyData, hasError: companyError },
    { data: eventData, hasError: eventError },
  ] = await Promise.all([
    queryWithFallback({ query: GET_ALL_SECTORS }, { sectors: { nodes: [] } }, "homepage sectors"),
    queryWithFallback({ query: GET_COMPANIES }, { companies: { nodes: [] } }, "homepage companies"),
    queryWithFallback({ query: GET_EVENTS }, { events: { nodes: [] } }, "homepage events"),
  ]);

  const sectors = sectorData?.sectors?.nodes || [];
  const companies = companyData?.companies?.nodes || [];
  const events = eventData?.events?.nodes || [];
  const hasGraphQLError = sectorError || companyError || eventError;

  if (hasGraphQLError && !sectors.length && !companies.length && !events.length) {
    return (
      <FallbackUI
        title="İçerikler şu anda yüklenemedi"
        message="Sektörel veriler geçici olarak alınamıyor. Lütfen kısa süre sonra tekrar deneyin."
        actionLabel="Ana sayfaya dön"
        href="/"
      />
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="relative bg-white text-secondary py-20 px-4 overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
            opacity: 0.8,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center pt-8">
          <div className="inline-block bg-orange-50 text-primary border border-orange-100 text-xs font-bold px-3 py-1 mb-6 tracking-widest uppercase">
            B2B Ticaretin Dijital Merkezi
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-secondary">
            İŞ DÜNYASININ <br />
            <span className="text-primary">SEKTÖREL AJANDASI</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            {companies.length}+ onaylı firma, {sectors.length} farklı sektör ve yüzlerce ticari fırsat tek bir platformda.
          </p>

          <div className="flex flex-col md:flex-row max-w-3xl mx-auto bg-white p-2 shadow-xl border border-gray-200 relative z-20">
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="text-primary mr-3" />
              <input
                type="text"
                placeholder="Firma adı, sektör veya hizmet ara..."
                className="w-full text-secondary placeholder:text-gray-400 focus:outline-none h-10 bg-transparent"
              />
            </div>
            <button className="bg-secondary hover:bg-black text-white font-bold px-8 py-3 md:py-0 transition-colors uppercase tracking-wider">
              ARA
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 space-y-20">
        {hasGraphQLError ? (
          <div className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Bazı içerikler geçici olarak yüklenemedi. Sayfa mevcut verilerle gösteriliyor.
          </div>
        ) : null}

        <section>
          <div className="flex items-end justify-between mb-6 border-b-2 border-secondary pb-4">
            <div>
              <h2 className="text-2xl font-black text-secondary uppercase tracking-tighter">Sektörleri Keşfet</h2>
              <p className="text-gray-500 text-sm mt-1">İş ağınızı genişletmek için kategorilere göz atın.</p>
            </div>
            <Link href="/sektorler" className="text-sm font-bold text-primary hover:text-secondary transition flex items-center gap-1">
              TÜMÜNÜ GÖR <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-gray-200">
            {sectors.map((sector: any) => {
              const IconComponent = getSectorIcon(sector.sectorDetails?.iconName);

              return (
                <Link
                  key={sector.id}
                  href={`/sektor/${sector.slug}`}
                  className="group border-r border-b border-gray-200 bg-white p-8 hover:bg-primary hover:border-primary transition-colors duration-300 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="p-3 bg-gray-50 group-hover:bg-white/10 text-primary group-hover:text-white transition-colors">
                    <IconComponent size={24} />
                  </div>
                  <span className="font-bold text-secondary group-hover:text-white transition-colors">
                    {sector.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-8">
            <div className="relative pl-4">
              <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary" />
              <h2 className="text-2xl font-black text-secondary uppercase tracking-tighter">Öne Çıkan Firmalar</h2>
              <p className="text-gray-500 text-sm mt-1">Sektörünün lider oyuncuları ve onaylı tedarikçiler.</p>
            </div>
            <Link href="/firmalar" className="bg-secondary text-white px-6 py-3 text-sm font-bold hover:bg-primary transition-colors uppercase tracking-wide">
              FİRMALARI LİSTELE
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((company: any) => (
              <Link
                href={`/firma/${company.slug}`}
                key={company.id}
                className="group relative bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 block"
              >
                <div className="absolute top-0 left-0 w-0 h-[4px] bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-20" />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 border border-gray-100 bg-gray-50 p-2 flex items-center justify-center">
                      <img
                        src={company.companyDetails?.coverImage || `https://placehold.co/100x100?text=${(company.title || "FI").substring(0, 2)}`}
                        alt={company.title || "Firma"}
                        className="w-full h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                    {company.companyDetails?.isVerified ? (
                      <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider mb-1">Onaylı</span>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors truncate">
                    {company.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">
                    <span className="text-primary">{company.sectors?.nodes[0]?.name}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {company.locations?.nodes[0]?.name || company.companyDetails?.address?.substring(0, 10)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-secondary transition-colors">PROFİLİ İNCELE</span>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 border border-gray-200 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-black text-secondary uppercase tracking-tighter flex items-center gap-3">
                <TrendingUp className="text-primary" /> Sektörel Ajanda
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Yaklaşan fuarlar, webinarlar ve resmi mali takvim etkinlikleri.
              </p>
            </div>
            <Link href="/ajanda" className="text-sm font-bold text-secondary hover:text-primary transition border-b-2 border-gray-200 hover:border-primary pb-1">
              TÜM ETKİNLİKLER
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event: any) => {
              const dateObj = event.eventDetails?.startDate ? new Date(event.eventDetails.startDate) : null;
              const day = dateObj ? dateObj.getUTCDate() : "--";
              const month = dateObj ? EVENT_MONTH_FORMATTER.format(dateObj) : "---";

              return (
                <article key={event.id} className="group cursor-pointer bg-white border border-gray-200 p-0 hover:shadow-lg transition-all">
                  <div className="flex">
                    <div className="bg-secondary text-white p-4 flex flex-col items-center justify-center min-w-[80px]">
                      <span className="text-2xl font-black">{day}</span>
                      <span className="text-xs uppercase font-bold">{month}</span>
                    </div>
                    <div className="p-4 flex-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1 block">
                        {event.eventDetails?.eventType}
                      </span>
                      <h3 className="font-bold text-base text-secondary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={12} /> {event.eventDetails?.venue || "Online"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
