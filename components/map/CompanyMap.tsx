"use client";

import { useEffect, useMemo, useState } from "react";
import L, { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import MapControls from "@/components/map/MapControls";
import MapFilters from "@/components/map/MapFilters";
import MapLegend from "@/components/map/MapLegend";
import MapPopup from "@/components/map/MapPopup";
import type { MapCompany, MappedCompany } from "@/components/map/types";

type CompanyMapProps = {
  companies: MapCompany[];
};

type FilterOption = {
  slug: string;
  name: string;
  count: number;
};

const TURKEY_CENTER: [number, number] = [39, 35];
const DEFAULT_ZOOM = 6;
const SECTOR_COLORS = [
  "#ea580c",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#0891b2",
  "#dc2626",
  "#ca8a04",
  "#4f46e5",
];

const defaultIcon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitMapBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) {
      map.setView(TURKEY_CENTER, DEFAULT_ZOOM);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  }, [map, points]);

  return null;
}

function parseCoordinate(value?: string | null, min = -180, max = 180) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

function getSectorOptions(companies: MappedCompany[]) {
  const map = new Map<string, FilterOption>();

  companies.forEach((company) => {
    (company.sectors?.nodes ?? []).forEach((sector) => {
      if (!sector?.slug || !sector.name) {
        return;
      }

      const existing = map.get(sector.slug);
      if (existing) {
        existing.count += 1;
        return;
      }

      map.set(sector.slug, { slug: sector.slug, name: sector.name, count: 1 });
    });
  });

  return [...map.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "tr"));
}

function getLocationOptions(companies: MappedCompany[]) {
  const map = new Map<string, FilterOption>();

  companies.forEach((company) => {
    (company.locations?.nodes ?? []).forEach((location) => {
      if (!location?.slug || !location.name) {
        return;
      }

      const existing = map.get(location.slug);
      if (existing) {
        existing.count += 1;
        return;
      }

      map.set(location.slug, { slug: location.slug, name: location.name, count: 1 });
    });
  });

  return [...map.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "tr"));
}

function getSectorColorMap(options: FilterOption[]) {
  return options.reduce<Record<string, string>>((result, option, index) => {
    result[option.slug] = SECTOR_COLORS[index % SECTOR_COLORS.length];
    return result;
  }, {});
}

function createMarkerIcon(color?: string) {
  if (!color) {
    return defaultIcon;
  }

  return divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;border:2px solid #fff;background:${color};box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function CompanyMap({ companies }: CompanyMapProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const mappableCompanies = useMemo(() => {
    return companies
      .map((company) => {
        const lat = parseCoordinate(company.companyDetails?.mapLat, -90, 90);
        const lng = parseCoordinate(company.companyDetails?.mapLng, -180, 180);

        if (lat === null || lng === null) {
          return null;
        }

        return { ...company, lat, lng } satisfies MappedCompany;
      })
      .filter((company): company is MappedCompany => Boolean(company));
  }, [companies]);

  const sectorOptions = useMemo(() => getSectorOptions(mappableCompanies), [mappableCompanies]);
  const locationOptions = useMemo(() => getLocationOptions(mappableCompanies), [mappableCompanies]);
  const sectorColorMap = useMemo(() => getSectorColorMap(sectorOptions), [sectorOptions]);

  const filteredCompanies = useMemo(() => {
    return mappableCompanies.filter((company) => {
      const sectorSlugs = (company.sectors?.nodes ?? [])
        .map((item) => item?.slug)
        .filter((slug): slug is string => Boolean(slug));
      const locationSlugs = (company.locations?.nodes ?? [])
        .map((item) => item?.slug)
        .filter((slug): slug is string => Boolean(slug));

      const matchesSector =
        !selectedSectors.length || sectorSlugs.some((slug) => selectedSectors.includes(slug));
      const matchesLocation =
        !selectedLocations.length || locationSlugs.some((slug) => selectedLocations.includes(slug));
      const matchesVerified = !verifiedOnly || Boolean(company.companyDetails?.isVerified);

      return matchesSector && matchesLocation && matchesVerified;
    });
  }, [mappableCompanies, selectedLocations, selectedSectors, verifiedOnly]);

  const points = useMemo<Array<[number, number]>>(
    () => filteredCompanies.map((company) => [company.lat, company.lng]),
    [filteredCompanies],
  );

  const legendItems = useMemo(
    () =>
      sectorOptions.map((sector) => ({
        key: sector.slug,
        name: sector.name,
        color: sectorColorMap[sector.slug] ?? "#ea580c",
      })),
    [sectorColorMap, sectorOptions],
  );

  return (
    <div className="grid min-h-[70vh] gap-0 border border-gray-200 bg-white lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <MapFilters
          locations={locationOptions}
          onClear={() => {
            setSelectedLocations([]);
            setSelectedSectors([]);
            setVerifiedOnly(false);
          }}
          onLocationToggle={(slug) => setSelectedLocations((current) => toggleValue(current, slug))}
          onSectorToggle={(slug) => setSelectedSectors((current) => toggleValue(current, slug))}
          onVerifiedToggle={() => setVerifiedOnly((current) => !current)}
          sectors={sectorOptions}
          selectedLocations={selectedLocations}
          selectedSectors={selectedSectors}
          verifiedOnly={verifiedOnly}
          visibleCount={filteredCompanies.length}
        />
      </div>

      <div className="relative min-h-[70vh]">
        <MapContainer center={TURKEY_CENTER} className="h-full w-full" zoom={DEFAULT_ZOOM}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitMapBounds points={points} />
          <MapControls />

          <MarkerClusterGroup chunkedLoading>
            {filteredCompanies.map((company) => {
              const sectorSlug = company.sectors?.nodes?.find((item) => item?.slug)?.slug;
              const markerColor = sectorSlug ? sectorColorMap[sectorSlug] : undefined;

              return (
                <Marker
                  icon={createMarkerIcon(markerColor)}
                  key={company.id}
                  position={[company.lat, company.lng]}
                >
                  <Popup minWidth={250}>
                    <MapPopup company={company} />
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <MapLegend items={legendItems} />

        <div className="absolute left-3 top-3 z-[500] lg:hidden">
          <button
            className="border border-gray-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-secondary shadow-lg"
            onClick={() => setMobileFiltersOpen((current) => !current)}
            type="button"
          >
            Filtreler ({filteredCompanies.length})
          </button>
        </div>

        {mobileFiltersOpen ? (
          <div className="absolute inset-x-0 bottom-0 z-[600] max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white lg:hidden">
            <MapFilters
              locations={locationOptions}
              onClear={() => {
                setSelectedLocations([]);
                setSelectedSectors([]);
                setVerifiedOnly(false);
              }}
              onLocationToggle={(slug) => setSelectedLocations((current) => toggleValue(current, slug))}
              onSectorToggle={(slug) => setSelectedSectors((current) => toggleValue(current, slug))}
              onVerifiedToggle={() => setVerifiedOnly((current) => !current)}
              sectors={sectorOptions}
              selectedLocations={selectedLocations}
              selectedSectors={selectedSectors}
              verifiedOnly={verifiedOnly}
              visibleCount={filteredCompanies.length}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
