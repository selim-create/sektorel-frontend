import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { MappedCompany } from "@/components/map/types";

type MapPopupProps = {
  company: MappedCompany;
};

export default function MapPopup({ company }: MapPopupProps) {
  const locationName = company.locations?.nodes?.find((item) => item?.name)?.name || "Türkiye";
  const sectorName = company.sectors?.nodes?.find((item) => item?.name)?.name;
  const title = company.title?.trim() || "Firma";
  const slug = company.slug?.trim() || "";

  return (
    <div className="w-64 space-y-3">
      <div>
        <Link className="text-base font-black text-secondary hover:text-primary" href={`/firma/${slug}`}>
          {title}
        </Link>
        {sectorName ? (
          <p className="mt-1 inline-flex bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            {sectorName}
          </p>
        ) : null}
      </div>

      <p className="flex items-start gap-2 text-xs text-gray-600">
        <MapPin size={13} className="mt-0.5 text-primary" />
        <span>{company.companyDetails?.address?.trim() || locationName}</span>
      </p>

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
