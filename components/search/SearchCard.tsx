import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Layers3,
  MapPin,
  Target,
} from "lucide-react";

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
      type: "sector";
      id: string;
      title: string;
      slug: string;
      description?: string | null;
      companyCount?: number | null;
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
      type: "lead";
      id: string;
      title: string;
      slug: string;
      leadType?: string | null;
      status?: string | null;
      budget?: string | null;
      location?: string | null;
      sector?: string | null;
      offerCount?: number | null;
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
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
      <Link href={`/firma/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-gray-100 bg-gray-50 p-1">
          {item.imageUrl ? (
            <div className="relative h-full w-full"><Image alt={item.title} className="object-contain" fill sizes="56px" src={item.imageUrl} /></div>
          ) : <Building2 size={24} className="text-gray-300" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="border-blue-100 bg-blue-50 text-blue-600"><Building2 size={10} /> Firma</Badge>
            {item.isVerified ? <Badge className="border-secondary bg-secondary text-white"><BadgeCheck size={10} /> Onaylı</Badge> : null}
          </div>
          <h3 className="truncate text-base font-bold text-secondary transition-colors group-hover:text-blue-600">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {item.sector ? <span className="font-medium text-primary">{item.sector}</span> : null}
            {item.location ? <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span> : null}
          </div>
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
      </Link>
    );
  }

  if (item.type === "sector") {
    return (
      <Link href={`/sektor/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-cyan-500 hover:shadow-md">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-cyan-50 text-cyan-700"><Layers3 size={24} /></div>
        <div className="min-w-0 flex-1">
          <Badge className="border-cyan-100 bg-cyan-50 text-cyan-700"><Layers3 size={10} /> Sektör</Badge>
          <h3 className="mt-1 text-base font-bold text-secondary transition-colors group-hover:text-cyan-700">{item.title}</h3>
          {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{stripHtml(item.description).slice(0, 160)}</p> : null}
          <p className="mt-2 text-[11px] font-medium text-gray-400">{Number(item.companyCount ?? 0)} firma</p>
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-cyan-500" />
      </Link>
    );
  }

  if (item.type === "post") {
    return (
      <Link href={`/haber/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
        {item.imageUrl ? <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden bg-gray-100 sm:block"><Image alt={item.title} className="object-cover transition-transform duration-300 group-hover:scale-105" fill sizes="96px" src={item.imageUrl} /></div> : null}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2"><Badge className="border-orange-100 bg-orange-50 text-primary"><FileText size={10} /> Haber</Badge>{item.category ? <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.category}</span> : null}</div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-primary">{item.title}</h3>
          {item.excerpt ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{stripHtml(item.excerpt).slice(0, 160)}</p> : null}
          {item.date ? <p className="mt-2 text-[11px] font-medium text-gray-400">{formatDate(item.date)}</p> : null}
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
      </Link>
    );
  }

  if (item.type === "event") {
    const dateString = formatDate(item.startDate);
    return (
      <Link href={`/ajanda/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-green-500 hover:shadow-md">
        {dateString ? <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center bg-secondary text-white"><span className="text-lg font-black leading-none">{new Date(item.startDate!).getDate()}</span><span className="text-[10px] font-bold uppercase">{new Date(item.startDate!).toLocaleDateString("tr-TR", { month: "short" })}</span></div> : null}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2"><Badge className="border-green-100 bg-green-50 text-green-700"><Calendar size={10} /> Etkinlik</Badge>{item.eventType ? <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.eventType}</span> : null}</div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-green-600">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">{item.venue ? <span className="flex items-center gap-1"><MapPin size={11} /> {item.venue}</span> : null}{item.organizer ? <span>{item.organizer}</span> : null}</div>
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-green-500" />
      </Link>
    );
  }

  if (item.type === "lead") {
    return (
      <Link href={`/firsatlar/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-amber-500 hover:shadow-md">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-amber-50 text-amber-700"><Target size={24} /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2"><Badge className="border-amber-100 bg-amber-50 text-amber-700"><Target size={10} /> Fırsat</Badge>{item.leadType ? <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.leadType}</span> : null}</div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-amber-700">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">{item.sector ? <span className="font-medium text-primary">{item.sector}</span> : null}{item.location ? <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span> : null}{item.budget ? <span>{item.budget}</span> : null}</div>
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-amber-500" />
      </Link>
    );
  }

  if (item.type === "job") {
    return (
      <Link href={`/kariyer/${item.slug}`} className="group flex items-start gap-4 border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-purple-500 hover:shadow-md">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-gray-100 bg-gray-50"><Briefcase size={24} className="text-gray-300" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2"><Badge className="border-purple-100 bg-purple-50 text-purple-700"><Briefcase size={10} /> İş İlanı</Badge>{item.workType ? <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.workType}</span> : null}</div>
          <h3 className="text-base font-bold text-secondary transition-colors group-hover:text-purple-600">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">{item.companyName ? <span className="font-medium text-secondary">{item.companyName}</span> : null}{item.location ? <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span> : null}</div>
          {item.deadline ? <p className="mt-1 text-[11px] text-gray-400">Son başvuru: {formatDate(item.deadline)}</p> : null}
        </div>
        <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition-colors group-hover:text-purple-500" />
      </Link>
    );
  }

  return null;
}
