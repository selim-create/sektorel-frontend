import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { MappedCompany } from "@/components/map/types";

type MapPopupProps = {
  company: MappedCompany;
};

export default function MapPopup({ company }: MapPopupProps) {
  const primaryLocation = company.locations?.nodes?.find((item) => item?.name);
  const primarySector = company.sectors?.nodes?.find((item) => item?.name);
  const locationName = primaryLocation?.name || "Türkiye";
  const sectorName = primarySector?.name;
  const title = company.title?.trim() || "Firma";
  const slug = company.slug?.trim() || "";
  const website = company.companyDetails?.website?.trim() || "";
  const websiteHref = website && /^https?:\/\//i.test(website) ? website : website ? `https://${website}` : "";

  return (
    <div className="w-64 space-y-3">
      <div>
        <Link className="text-base font-black text-secondary hover:text-primary" href={`/firma/${slug}`}>
          {title}
        </Link>
        {sectorName ? (
          <div className="mt-1">
            <Link
              className="inline-flex bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary hover:bg-orange-100"
              href={primarySector?.slug ? `/harita?sector=${primarySector.slug}` : "/harita"}
            >
              {sectorName}
            </Link>
          </div>
        ) : null}
      </div>

      <div className="space-y-1">
        <p className="flex items-start gap-2 text-xs text-gray-600">
          <MapPin size={13} className="mt-0.5 text-primary" />
          <span>
            {company.companyDetails?.address?.trim() || (
              <Link
                className="font-semibold text-secondary hover:text-primary"
                href={primaryLocation?.slug ? `/harita?location=${primaryLocation.slug}` : "/harita"}
              >
                {locationName}
              </Link>
            )}
          </span>
        </p>
        <Link
          className="inline-flex text-[11px] font-semibold text-secondary hover:text-primary"
          href={primaryLocation?.slug ? `/harita?location=${primaryLocation.slug}` : "/harita"}
        >
          {locationName}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {company.companyDetails?.phone ? (
          <a
            className="inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary hover:border-primary hover:text-primary"
            href={`tel:${company.companyDetails.phone}`}
          >
            <Phone size={11} /> Ara
          </a>
        ) : null}
        {company.companyDetails?.email ? (
          <a
            className="inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary hover:border-primary hover:text-primary"
            href={`mailto:${company.companyDetails.email}`}
          >
            <Mail size={11} /> E-posta
          </a>
        ) : null}
        {websiteHref ? (
          <a
            className="inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary hover:border-primary hover:text-primary"
            href={websiteHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink size={11} /> Website
          </a>
        ) : null}
      </div>

      <Link
        className="inline-flex w-full items-center justify-center bg-secondary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-black"
        href={`/firma/${slug}`}
      >
        Profili Görüntüle
      </Link>
    </div>
  );
}
