import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import {
  getCitySectorFacets,
  getSectorCityFacets,
} from "@/lib/directory-facets";
import { createSectorLandingSegment } from "@/lib/city-sector-landings";

type FacetLinksProps = {
  citySlug?: string;
  sectorSlug?: string;
  title?: string;
};

export async function CitySectorLinks({
  citySlug,
  title,
}: Required<Pick<FacetLinksProps, "citySlug">> & Pick<FacetLinksProps, "title">) {
  const { facets } = await getCitySectorFacets(citySlug, 24);
  if (!facets.length) return null;

  return (
    <section className="border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Building2 size={15} /> Sektörel Keşif
            </div>
            <h2 className="text-2xl font-black tracking-tight text-secondary">
              {title ?? "Bu şehirde öne çıkan sektörler"}
            </h2>
          </div>
          <Link
            href="/sektorler"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary"
          >
            Tüm sektörler <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facets.map((facet) => (
            <Link
              key={facet.databaseId ?? facet.slug}
              href={`/${citySlug}/${createSectorLandingSegment(facet.slug)}`}
              className="group flex items-center justify-between border border-gray-200 bg-gray-50 px-4 py-4 transition hover:border-primary hover:bg-white hover:shadow-sm"
            >
              <span className="font-bold text-secondary transition group-hover:text-primary">
                {facet.name}
              </span>
              <span className="ml-4 shrink-0 bg-white px-2 py-1 text-xs font-bold text-gray-500 ring-1 ring-gray-200">
                {facet.count ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function SectorCityLinks({
  sectorSlug,
  title,
}: Required<Pick<FacetLinksProps, "sectorSlug">> & Pick<FacetLinksProps, "title">) {
  const { facets } = await getSectorCityFacets(sectorSlug, 24);
  if (!facets.length) return null;

  return (
    <section className="border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <MapPin size={15} /> Şehirlere Göre Firmalar
            </div>
            <h2 className="text-2xl font-black tracking-tight text-secondary">
              {title ?? "Bu sektörde firma bulunan şehirler"}
            </h2>
          </div>
          <Link
            href="/firmalar"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary"
          >
            Firma rehberi <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {facets.map((facet) => (
            <Link
              key={facet.databaseId ?? facet.slug}
              href={`/${facet.slug}/${createSectorLandingSegment(sectorSlug)}`}
              className="group flex items-center justify-between border border-gray-200 bg-gray-50 px-4 py-4 transition hover:border-primary hover:bg-white hover:shadow-sm"
            >
              <span className="font-bold text-secondary transition group-hover:text-primary">
                {facet.name}
              </span>
              <span className="ml-4 shrink-0 bg-white px-2 py-1 text-xs font-bold text-gray-500 ring-1 ring-gray-200">
                {facet.count ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
