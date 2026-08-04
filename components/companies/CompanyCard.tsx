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
  const primaryLocation = company.locations?.nodes?.find((item) => item?.name);
  const locationName = primaryLocation?.name || "Türkiye";
  const imageSrc = company.featuredImage?.node?.sourceUrl || null;
  const primarySector = company.sectors?.nodes?.find((item) => item?.name);

  return (
    <article className="group relative flex h-full flex-col border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl sm:flex-row sm:items-start sm:gap-5">
      <Link
        className="relative mx-auto block aspect-square w-28 shrink-0 overflow-hidden border border-gray-200 bg-gray-50 sm:mx-0 sm:w-32"
        href={`/firma/${slug}`}
      >
        {imageSrc ? (
          <Image
            alt={title}
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            fill
            loading="lazy"
            sizes="128px"
            src={imageSrc}
          />
        ) : (
          <CompanyAvatar className="text-xl" name={title} />
        )}
      </Link>

      <div className="mt-5 flex min-w-0 flex-1 flex-col sm:mt-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-lg font-black leading-6 text-secondary transition-colors group-hover:text-primary">
              <Link href={`/firma/${slug}`}>{title}</Link>
            </h3>
            {primarySector?.name ? (
              <Link
                className="mt-2 inline-flex max-w-full bg-orange-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary hover:bg-orange-100"
                href={primarySector.slug ? `/firmalar?sector=${primarySector.slug}` : "/firmalar"}
              >
                <span className="truncate">{primarySector.name}</span>
              </Link>
            ) : null}
          </div>
          <VerificationBadge featured={featured} isVerified={details.isVerified} />
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
          <Link
            className="font-semibold text-secondary hover:text-primary"
            href={primaryLocation?.slug ? `/firmalar?location=${primaryLocation.slug}` : "/firmalar"}
          >
            {locationName}
          </Link>
        </p>

        {details.address ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{toPlainText(details.address)}</p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-gray-400">Adres bilgisi henüz eklenmedi.</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          {details.email ? (
            <a
              aria-label={`${title} e-posta`}
              className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 text-secondary transition-colors hover:border-primary hover:text-primary"
              href={`mailto:${details.email}`}
            >
              <Mail size={14} />
            </a>
          ) : null}

          {details.phone ? (
            <a
              aria-label={`${title} telefon`}
              className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 text-secondary transition-colors hover:border-primary hover:text-primary"
              href={`tel:${details.phone}`}
            >
              <Phone size={14} />
            </a>
          ) : null}

          {details.website ? (
            <a
              aria-label={`${title} web sitesi`}
              className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 text-secondary transition-colors hover:border-primary hover:text-primary"
              href={details.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
