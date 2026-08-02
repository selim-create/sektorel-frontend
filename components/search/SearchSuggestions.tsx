"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const POPULAR_TERMS = [
  "inşaat",
  "tekstil",
  "yazılım",
  "gıda",
  "ihracat",
  "fuar",
  "lojistik",
  "enerji",
];

type SearchSuggestionsProps = {
  visible: boolean;
  inputValue: string;
  recentSearches: string[];
  onSelect: (term: string) => void;
  onClose: () => void;
};

export default function SearchSuggestions({
  visible,
  inputValue,
  recentSearches,
  onSelect,
  onClose,
}: SearchSuggestionsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!visible) return null;

  const filtered = inputValue.trim()
    ? POPULAR_TERMS.filter((t) => t.toLowerCase().includes(inputValue.toLowerCase()))
    : POPULAR_TERMS;

  const showRecent = !inputValue.trim() && recentSearches.length > 0;

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-50 mt-1 border border-gray-200 bg-white shadow-xl"
    >
      {showRecent && (
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Son aramalar
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 5).map((term) => (
              <button
                key={term}
                onClick={() => onSelect(term)}
                className="border border-gray-200 px-3 py-1 text-xs font-medium text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="px-4 py-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {inputValue.trim() ? "Öneriler" : "Popüler aramalar"}
          </p>
          <ul>
            {filtered.map((term) => (
              <li key={term}>
                <button
                  onClick={() => onSelect(term)}
                  className="flex w-full items-center gap-3 px-2 py-2 text-sm text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
                >
                  <Search size={13} className="text-gray-400" />
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {inputValue.trim() && (
        <div className="border-t border-gray-100 px-4 py-3">
          <Link
            href={`/ara?q=${encodeURIComponent(inputValue.trim())}`}
            className="flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary"
            onClick={() => onClose()}
          >
            <Search size={13} />
            &quot;{inputValue.trim()}&quot; için tüm sonuçları gör
          </Link>
        </div>
      )}
    </div>
  );
}
