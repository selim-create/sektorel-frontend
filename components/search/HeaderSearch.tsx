"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  FileText,
  Layers3,
  Loader2,
  Search,
} from "lucide-react";

const HEADER_SEARCH_QUERY = gql`
  query HeaderSearchSuggestions($search: String!) {
    companies(first: 4, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        companyDetails {
          isVerified
        }
        sectors {
          nodes {
            name
          }
        }
      }
    }
    sectors(first: 3, where: { search: $search, orderby: NAME, order: ASC, hideEmpty: false }) {
      nodes {
        id
        name
        slug
        count
      }
    }
    posts(first: 3, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
      }
    }
    events(first: 3, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        eventDetails {
          startDate
          venue
        }
      }
    }
  }
`;

type HeaderSearchData = {
  companies?: {
    nodes?: Array<{
      id?: string | null;
      title?: string | null;
      slug?: string | null;
      companyDetails?: { isVerified?: boolean | null } | null;
      sectors?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
    } | null> | null;
  } | null;
  sectors?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      slug?: string | null;
      count?: number | null;
    } | null> | null;
  } | null;
  posts?: {
    nodes?: Array<{
      id?: string | null;
      title?: string | null;
      slug?: string | null;
      date?: string | null;
    } | null> | null;
  } | null;
  events?: {
    nodes?: Array<{
      id?: string | null;
      title?: string | null;
      slug?: string | null;
      eventDetails?: {
        startDate?: string | null;
        venue?: string | null;
      } | null;
    } | null> | null;
  } | null;
};

type HeaderSearchVariables = {
  search: string;
};

type SuggestionKind = "company" | "sector" | "post" | "event";

type Suggestion = {
  key: string;
  kind: SuggestionKind;
  title: string;
  href: string;
  meta?: string | null;
  verified?: boolean;
};

type HeaderSearchProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

const KIND_LABELS: Record<SuggestionKind, string> = {
  company: "Firma",
  sector: "Sektör",
  post: "Haber",
  event: "Etkinlik",
};

const KIND_ICONS = {
  company: Building2,
  sector: Layers3,
  post: FileText,
  event: Calendar,
};

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function validNodes<T>(nodes?: Array<T | null> | null): T[] {
  return (nodes ?? []).filter((node): node is T => Boolean(node));
}

const HeaderSearch = forwardRef<HTMLInputElement, HeaderSearchProps>(function HeaderSearch(
  { variant = "desktop", onNavigate },
  forwardedRef,
) {
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = query.trim();

  const [loadSuggestions, { data, loading }] = useLazyQuery<
    HeaderSearchData,
    HeaderSearchVariables
  >(HEADER_SEARCH_QUERY, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const suggestions = useMemo<Suggestion[]>(() => {
    const companies = validNodes(data?.companies?.nodes)
      .filter((node) => node.id && node.slug && node.title)
      .map((node): Suggestion => ({
        key: `company-${node.id}`,
        kind: "company",
        title: node.title as string,
        href: `/firma/${node.slug}`,
        meta: node.sectors?.nodes?.find((sector) => sector?.name)?.name ?? null,
        verified: Boolean(node.companyDetails?.isVerified),
      }));

    const sectors = validNodes(data?.sectors?.nodes)
      .filter((node) => node.id && node.slug && node.name)
      .map((node): Suggestion => ({
        key: `sector-${node.id}`,
        kind: "sector",
        title: node.name as string,
        href: `/sektor/${node.slug}`,
        meta: `${Number(node.count ?? 0)} firma`,
      }));

    const posts = validNodes(data?.posts?.nodes)
      .filter((node) => node.id && node.slug && node.title)
      .map((node): Suggestion => ({
        key: `post-${node.id}`,
        kind: "post",
        title: node.title as string,
        href: `/haber/${node.slug}`,
        meta: formatDate(node.date),
      }));

    const events = validNodes(data?.events?.nodes)
      .filter((node) => node.id && node.slug && node.title)
      .map((node): Suggestion => ({
        key: `event-${node.id}`,
        kind: "event",
        title: node.title as string,
        href: `/ajanda/${node.slug}`,
        meta: node.eventDetails?.venue || formatDate(node.eventDetails?.startDate),
      }));

    return [...companies, ...sectors, ...posts, ...events];
  }, [data]);

  useEffect(() => {
    setActiveIndex(-1);

    if (normalizedQuery.length < 2) {
      setIsOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
      loadSuggestions({ variables: { search: normalizedQuery } });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadSuggestions, normalizedQuery]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  function setInputRef(node: HTMLInputElement | null) {
    localInputRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }

  function navigate(href: string) {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(href);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedQuery) return;

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigate(suggestions[activeIndex].href);
      return;
    }

    navigate(`/ara?q=${encodeURIComponent(normalizedQuery)}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!suggestions.length || normalizedQuery.length < 2) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
    }
  }

  const isDesktop = variant === "desktop";
  const panelVisible = isOpen && normalizedQuery.length >= 2;
  const listboxId = `header-search-${variant}-results`;

  return (
    <div
      className={isDesktop ? "relative hidden max-w-2xl flex-1 lg:block" : "relative mb-6"}
      ref={wrapperRef}
    >
      <form className="group relative flex" onSubmit={submitSearch} role="search">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary"
          size={16}
        />
        <input
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={panelVisible}
          autoComplete="off"
          className={
            isDesktop
              ? "w-full rounded-none border border-gray-200 bg-gray-50 py-3 pl-11 pr-32 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
              : "w-full rounded-none border border-gray-200 bg-gray-50 py-3 pl-10 pr-20 text-sm outline-none focus:border-primary"
          }
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(event.target.value.trim().length >= 2);
          }}
          onFocus={() => {
            if (normalizedQuery.length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isDesktop ? "Firma, sektör, haber veya etkinlik ara..." : "Ara..."}
          ref={setInputRef}
          role="combobox"
          type="search"
          value={query}
        />
        <button
          className={
            isDesktop
              ? "absolute inset-y-1 right-1 bg-secondary px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
              : "absolute inset-y-1 right-1 bg-secondary px-4 text-xs font-bold uppercase tracking-wider text-white"
          }
          type="submit"
        >
          Ara
        </button>
      </form>

      {panelVisible ? (
        <div
          className={
            isDesktop
              ? "absolute inset-x-0 top-full z-[80] mt-2 overflow-hidden border border-gray-200 bg-white shadow-2xl"
              : "relative z-[80] mt-2 overflow-hidden border border-gray-200 bg-white shadow-xl"
          }
          id={listboxId}
          role="listbox"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
              Hızlı Sonuçlar
            </p>
            {loading ? <Loader2 className="animate-spin text-primary" size={15} /> : null}
          </div>

          {!loading && suggestions.length === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-500">
              Bu aramayla eşleşen hızlı sonuç bulunamadı.
            </p>
          ) : null}

          <div className="max-h-[420px] overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const Icon = KIND_ICONS[suggestion.kind];
              const active = activeIndex === index;

              return (
                <button
                  className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                    active ? "bg-orange-50" : "hover:bg-gray-50"
                  }`}
                  id={`${listboxId}-${index}`}
                  key={suggestion.key}
                  onClick={() => navigate(suggestion.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  type="button"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-gray-50 text-primary">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        {KIND_LABELS[suggestion.kind]}
                      </span>
                      {suggestion.verified ? (
                        <BadgeCheck className="text-emerald-600" size={13} />
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-bold text-secondary">
                      {suggestion.title}
                    </span>
                    {suggestion.meta ? (
                      <span className="mt-1 block truncate text-xs text-gray-400">
                        {suggestion.meta}
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight className="mt-3 shrink-0 text-gray-300" size={15} />
                </button>
              );
            })}
          </div>

          <button
            className="flex w-full items-center justify-between bg-secondary px-4 py-3 text-left text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-black"
            onClick={() => navigate(`/ara?q=${encodeURIComponent(normalizedQuery)}`)}
            type="button"
          >
            Tüm sonuçları gör
            <ArrowRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
});

export default HeaderSearch;
