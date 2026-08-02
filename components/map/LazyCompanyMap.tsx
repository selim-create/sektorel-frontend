"use client";

import dynamic from "next/dynamic";
import type { MapCompany } from "@/components/map/types";

const CompanyMap = dynamic(() => import("@/components/map/CompanyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[70vh] items-center justify-center border border-gray-200 bg-white text-sm font-bold text-secondary">
      Harita yükleniyor...
    </div>
  ),
});

type InitialFilters = {
  location?: string;
  sector?: string;
  verified?: boolean;
};

export default function LazyCompanyMap({
  companies,
  initialFilters,
}: {
  companies: MapCompany[];
  initialFilters?: InitialFilters;
}) {
  return (
    <CompanyMap
      companies={companies}
      initialFilters={initialFilters}
      key={`${initialFilters?.sector ?? ""}:${initialFilters?.location ?? ""}:${initialFilters?.verified ? "1" : "0"}`}
    />
  );
}
