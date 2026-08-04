"use client";

import { useEffect, useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { Check, Loader2, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const CITY_SEARCH_QUERY = gql`
  query SektorelDirectoryCitySearch($search: String!) {
    sektorelLocationOptions(type: "city", search: $search, first: 12) {
      databaseId
      name
      slug
    }
  }
`;

type CityOption = {
  databaseId: number;
  name: string;
  slug: string;
};

type CitySearchData = {
  sektorelLocationOptions?: CityOption[] | null;
};

type CitySearchVariables = {
  search: string;
};

type LocationSearchFilterProps = {
  currentParams: Record<string, string>;
  selectedLocation?: string;
  selectedLocationName?: string;
};

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1))
    .join(" ");
}

export default function LocationSearchFilter({
  currentParams,
  selectedLocation,
  selectedLocationName,
}: LocationSearchFilterProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadCities, { data, loading }] = useLazyQuery<CitySearchData, CitySearchVariables>(
    CITY_SEARCH_QUERY,
    { fetchPolicy: "network-only" },
  );

  const normalizedSearch = searchText.trim();
  const options = useMemo(
    () => (data?.sektorelLocationOptions ?? []).filter((city): city is CityOption => Boolean(city?.slug && city.name)),
    [data],
  );
  const activeLabel = selectedLocationName || (selectedLocation ? humanizeSlug(selectedLocation) : "Türkiye Geneli");

  useEffect(() => {
    if (normalizedSearch.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      loadCities({ variables: { search: normalizedSearch } });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadCities, normalizedSearch]);

  function navigate(location?: string) {
    const params = new URLSearchParams(currentParams);

    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    params.delete("page");
    const query = params.toString();
    router.push(query ? `/firmalar?${query}` : "/firmalar");
    setSearchText("");
    setIsOpen(false);
  }

  return (
    <div className="space-y-3">
      <button
        className={`flex w-full items-center justify-between border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
          selectedLocation
            ? "border-primary bg-orange-50 text-primary"
            : "border-primary bg-orange-50 text-primary"
        }`}
        onClick={() => navigate(undefined)}
        type="button"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{activeLabel}</span>
        </span>
        {selectedLocation ? <X size={14} className="shrink-0" /> : <Check size={14} className="shrink-0" />}
      </button>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          autoComplete="off"
          className="w-full border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-secondary outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
          onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
          onChange={(event) => {
            setSearchText(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Şehir ara..."
          type="search"
          value={searchText}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary" size={15} />
        ) : null}

        {isOpen && normalizedSearch.length >= 2 ? (
          <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto border border-gray-200 bg-white shadow-xl">
            {options.map((city) => (
              <button
                className={`flex w-full items-center justify-between border-b border-gray-100 px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-orange-50 hover:text-primary ${
                  selectedLocation === city.slug ? "bg-orange-50 font-bold text-primary" : "text-secondary"
                }`}
                key={city.databaseId}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => navigate(city.slug)}
                type="button"
              >
                <span>{city.name}</span>
                {selectedLocation === city.slug ? <Check size={14} /> : null}
              </button>
            ))}

            {!loading && options.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-500">Bu aramayla eşleşen şehir bulunamadı.</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-5 text-gray-400">En az 2 harf yazarak şehir arayın.</p>
    </div>
  );
}
