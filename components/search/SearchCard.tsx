import Link from "next/link";
import Image from "next/image";
import { Building2, FileText, Calendar, Briefcase, MapPin, ArrowRight, BadgeCheck } from "lucide-react";

export type SearchResultItem =
  | {
      type: "company";
      id: string;
      title: string;
      slug: string;
      sector?: string | null;
      location?: string | null;
      isVerified?: boolean | null;
      imageUrl?: string | null;
    }
  | {
      type: "post";
      id: string;
      title: string;
      slug: string;
      excerpt?: string | null;
      date?: string | null;
      category?: string | null;
      imageUrl?: string | null;
    }
  | {
      type: "event";
      id: string;
      title: string;
      slug: string;
      eventType?: string | null;
      startDate?: string | null;
      venue?: string | null;
      organizer?: string | null;
    }
  | {
      type: "job";
      id: string;
      title: string;
      slug: string;
      companyName?: string | null;
      location?: string | null;
      workType?: string | null;
      deadline?: string | null;
    };

function formatDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${className}`}>
      {children}
    </span>
  );
}

type SearchCardProps = {
  item: SearchResultItem;
  searchQuery?: string;
};

export default function SearchCard({ item }: SearchCardProps) {
  if (item.type === "company") {
    return (
      <Link
        href={`/firma/${item.slug}`}
        className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
      >
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center border border-gray-100 bg-gray-50 p-1">
          {item.imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                alt={item.title}
                className="object-contain"
                fill
                sizes="56px"
                src={item.imageUrl}
              />
            </div>
          ) : (
            <Building2 size={24} className="text-gray-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-50 text-blue-600 border-blue-100">
              <Building2 size={10} /> Firma
            </Badge>
            {item.isVerified && (
              <Badge className="bg-secondary text-white border-secondary">
                <BadgeCheck size={10} /> Onaylı
              </Badge>
            )}
          </div>
          <h3 className="truncate text-base font-bold text-secondary transition-colors group-hover:text-blue-600">
            {item.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {item.sector && <span className="font-medium text-primary">{item.sector}</span>}
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {item.location}
              </span>
            )}
          </div>
        </div>
        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
      </Link>
    );
  }

  if (item.type === "post") {
    return (
      <Link
        href={`/haber/${item.slug}`}
        className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
      >
        {item.imageUrl && (
          <div className="relative hidden h-16 w-24 flex-shrink-0 overflow-hidden bg-gray-100 sm:block">
            <Image
              alt={item.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="96px"
              src={item.imageUrl}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-orange-50 text-primary border-orange-100">
              <FileText size={10} /> Haber
            </Badge>
            {item.category && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.category}</span>
            )}
          </div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
              {stripHtml(item.excerpt).slice(0, 160)}
            </p>
          )}
          {item.date && (
            <p className="mt-2 text-[11px] font-medium text-gray-400">{formatDate(item.date)}</p>
          )}
        </div>
        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
      </Link>
    );
  }

  if (item.type === "event") {
    const dateStr = formatDate(item.startDate);
    return (
      <Link
        href={`/ajanda/${item.slug}`}
        className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-green-500 hover:shadow-md"
      >
        {dateStr && (
          <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center bg-secondary text-white">
            <span className="text-lg font-black leading-none">
              {new Date(item.startDate!).getDate()}
            </span>
            <span className="text-[10px] font-bold uppercase">
              {new Date(item.startDate!).toLocaleDateString("tr-TR", { month: "short" })}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-green-50 text-green-700 border-green-100">
              <Calendar size={10} /> Etkinlik
            </Badge>
            {item.eventType && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.eventType}</span>
            )}
          </div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-green-600">
            {item.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {item.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {item.venue}
              </span>
            )}
            {item.organizer && <span>{item.organizer}</span>}
          </div>
        </div>
        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-300 transition-colors group-hover:text-green-500" />
      </Link>
    );
  }

  if (item.type === "job") {
    return (
      <Link
        href={`/kariyer/${item.slug}`}
        className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-purple-500 hover:shadow-md"
      >
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center border border-gray-100 bg-gray-50">
          <Briefcase size={24} className="text-gray-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-purple-50 text-purple-700 border-purple-100">
              <Briefcase size={10} /> İş İlanı
            </Badge>
            {item.workType && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.workType}</span>
            )}
          </div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-purple-600">
            {item.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {item.companyName && <span className="font-medium text-secondary">{item.companyName}</span>}
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {item.location}
              </span>
            )}
          </div>
          {item.deadline && (
            <p className="mt-1 text-[11px] text-gray-400">
              Son başvuru: {formatDate(item.deadline)}
            </p>
          )}
        </div>
        <ArrowRight size={16} className="mt-1 flex-shrink-0 text-gray-300 transition-colors group-hover:text-purple-500" />
      </Link>
    );
  }

  return null;
}
