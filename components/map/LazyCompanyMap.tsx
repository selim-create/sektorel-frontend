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

export default function LazyCompanyMap({ companies }: { companies: MapCompany[] }) {
  return <CompanyMap companies={companies} />;
}
