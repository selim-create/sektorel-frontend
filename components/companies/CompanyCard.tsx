import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import VerificationBadge from "@/components/companies/VerificationBadge";
import CompanyAvatar from "@/components/common/CompanyAvatar";

type TaxonomyNode = {
  name?: string | null;
  slug?: string | null;
};

type Company = {
  id: string;
  title?: string | null;
  slug?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  sectors?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
  locations?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
};

type CompanyCardProps = {
  company: Company;
  featured?: boolean;
};

function toPlainText(value?: string | null) {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function CompanyCard({ company, featured = false }: CompanyCardProps) {
  const title = company.title?.trim() || "Firma";
  const slug = company.slug?.trim() || "";
  const details = company.companyDetails || {};
  const locationName = company.locations?.nodes?.find((item) => item?.name)?.name || "Türkiye";
  const imageSrc = company.featuredImage?.node?.sourceUrl || null;

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">
      <Link className="relative block aspect-[16/10] overflow-hidden bg-gray-100" href={`/firma/${slug}`}>
        {imageSrc ? (
          <Image
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={imageSrc}
          />
        ) : (
          <CompanyAvatar name={title} />
        )}
        <div className="absolute left-3 top-3">
          <VerificationBadge featured={featured} isVerified={details.isVerified} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black text-secondary transition-colors group-hover:text-primary">
          <Link href={`/firma/${slug}`}>{title}</Link>
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {(company.sectors?.nodes ?? [])
            .filter((item): item is TaxonomyNode => Boolean(item?.name))
            .slice(0, 3)
            .map((sector) => (
              <span
                className="bg-orange-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary"
                key={sector.slug ?? sector.name}
              >
                {sector.name}
              </span>
            ))}
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="text-primary" />
          {locationName}
        </p>

        {details.address ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{toPlainText(details.address)}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {details.email ? (
            <a
              className="inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:border-primary hover:text-primary"
              href={`mailto:${details.email}`}
            >
              <Mail size={12} /> İletişim
            </a>
          ) : null}

          {details.phone ? (
            <a
              className="inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:border-primary hover:text-primary"
              href={`tel:${details.phone}`}
            >
              <Phone size={12} /> Ara
            </a>
          ) : null}

          {details.website ? (
            <a
              className="inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-secondary transition-colors hover:border-primary hover:text-primary"
              href={details.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink size={12} /> Site
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
