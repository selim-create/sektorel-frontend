"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import SearchSuggestions from "@/components/search/SearchSuggestions";
import { saveRecentSearch } from "@/components/search/RecentSearches";

const STORAGE_KEY = "sektorel_recent_searches";

type StoredEntry = { term: string; ts: number };

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: StoredEntry[] = JSON.parse(raw) as StoredEntry[];
    const ttl = 24 * 60 * 60 * 1000;
    return entries.filter((e) => Date.now() - e.ts < ttl).map((e) => e.term);
  } catch {
    return [];
  }
}

type SearchBarProps = {
  defaultValue?: string;
};

export default function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecent());
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setSuggestionsVisible(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = value.trim();
    if (!term) return;
    saveRecentSearch(term);
    setRecentSearches(loadRecent());
    setSuggestionsVisible(false);
    router.push(`/ara?q=${encodeURIComponent(term)}`);
  }

  function handleSelect(term: string) {
    setValue(term);
    saveRecentSearch(term);
    setRecentSearches(loadRecent());
    setSuggestionsVisible(false);
    router.push(`/ara?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setSuggestionsVisible(true)}
            placeholder="Firmalar, haberler, etkinlikler ve daha fazlasını ara..."
            className="h-14 w-full border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-secondary outline-none transition-colors focus:border-primary focus:bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-secondary px-8 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary"
        >
          Ara
        </button>
      </div>
      <SearchSuggestions
        visible={suggestionsVisible}
        inputValue={value}
        recentSearches={recentSearches}
        onSelect={handleSelect}
        onClose={() => setSuggestionsVisible(false)}
      />
      <p className="mt-2 text-xs text-gray-400">
        Kısayol: <kbd className="border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </p>
    </form>
  );
}
