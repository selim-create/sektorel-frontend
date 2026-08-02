"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "sektorel_recent_searches";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type StoredEntry = { term: string; ts: number };

export function saveRecentSearch(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: StoredEntry[] = raw ? (JSON.parse(raw) as StoredEntry[]) : [];
    const filtered = existing.filter((e) => e.term !== term);
    const updated = [{ term, ts: Date.now() }, ...filtered].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: StoredEntry[] = JSON.parse(raw) as StoredEntry[];
    const now = Date.now();
    return entries
      .filter((e) => now - e.ts < TTL_MS)
      .map((e) => e.term);
  } catch {
    return [];
  }
}

export default function RecentSearches() {
  const [mounted, setMounted] = useState(false);
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
      setSearches(loadRecentSearches());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function removeSearch(term: string) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const entries: StoredEntry[] = JSON.parse(raw) as StoredEntry[];
      const updated = entries.filter((e) => e.term !== term);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSearches(updated.map((e) => e.term));
    } catch {
      // ignore
    }
  }

  if (!mounted || searches.length === 0) return null;

  return (
    <div className="border border-gray-200 bg-white p-5 shadow-sm">
      <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
        <Clock size={12} /> Son Aramalar
      </p>
      <ul className="space-y-2">
        {searches.map((term) => (
          <li key={term} className="flex items-center justify-between">
            <Link
              href={`/ara?q=${encodeURIComponent(term)}`}
              className="text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              {term}
            </Link>
            <button
              onClick={() => removeSearch(term)}
              className="text-gray-300 transition-colors hover:text-red-400"
              aria-label={`"${term}" aramasını sil`}
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
