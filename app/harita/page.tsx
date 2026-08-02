import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import FallbackUI from "@/components/error/FallbackUI";
import LazyCompanyMap from "@/components/map/LazyCompanyMap";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_COMPANIES_WITH_MAP } from "@/lib/queries";
import type { MapCompany } from "@/components/map/types";

export const metadata: Metadata = {
  title: "Firmalar Haritası | Sektörel Ajanda",
  description: "Firmaları interaktif harita üzerinde keşfedin, sektör ve şehir filtreleriyle daraltın.",
};

export const revalidate = 60;

type QueryData = {
  companies: {
    nodes: Array<MapCompany | null>;
  };
};

const EMPTY_DATA: QueryData = {
  companies: {
    nodes: [],
  },
};

export default async function MapPage() {
  const { data, hasError } = await queryWithFallback<QueryData>(
    {
      query: GET_COMPANIES_WITH_MAP,
    },
    EMPTY_DATA,
    "companies map listing",
  );

  const companies = (data?.companies?.nodes ?? []).filter(
    (company): company is MapCompany => Boolean(company?.id && company?.slug?.trim()),
  );

  if (hasError && companies.length === 0) {
    return (
      <FallbackUI
        actionLabel="Firma sayfasına dön"
        href="/firmalar"
        message="Harita verileri şu anda alınamıyor. Lütfen kısa süre sonra tekrar deneyin."
        title="Harita yüklenemedi"
      />
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 pb-10">
      <section className="relative overflow-hidden border-b border-gray-800 bg-secondary px-4 py-14 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 container mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gray-300">
            <MapPinned size={12} className="text-primary" />
            Harita Keşfi
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Firmalar Haritası</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
            Şehir ve sektör filtreleriyle firmaları harita üzerinde keşfedin. İşaretçiye tıklayarak firma
            iletişim bilgilerine ve profile hızlıca ulaşın.
          </p>
        </div>
      </section>

      {hasError ? (
        <div className="container mx-auto border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
          Bazı harita verileri alınamadı. Sayfa mevcut sonuçlarla gösteriliyor.
        </div>
      ) : null}

      <div className="container mx-auto">
        <LazyCompanyMap companies={companies} />
      </div>
    </div>
  );
}
