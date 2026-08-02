type CompanySortProps = {
  selectedSort: string;
  q?: string;
  sector?: string;
  location?: string;
  verified?: string;
};

const SORT_OPTIONS = [
  { value: "alphabetical", label: "Alfabetik (A-Z)" },
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "verified", label: "Doğrulanmış Önce" },
  { value: "views", label: "Most Viewed" },
];

export default function CompanySort({
  selectedSort,
  q,
  sector,
  location,
  verified,
}: CompanySortProps) {
  return (
    <form action="/firmalar" className="flex flex-wrap items-end gap-3">
      {q ? <input name="q" type="hidden" value={q} /> : null}
      {sector ? <input name="sector" type="hidden" value={sector} /> : null}
      {location ? <input name="location" type="hidden" value={location} /> : null}
      {verified ? <input name="verified" type="hidden" value={verified} /> : null}

      <label className="flex min-w-[220px] flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sıralama</span>
        <select
          className="h-12 border border-gray-200 bg-white px-4 text-sm text-secondary outline-none transition-colors focus:border-primary"
          defaultValue={selectedSort}
          name="sort"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className="h-12 border border-gray-200 px-4 text-xs font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:border-primary hover:text-primary"
        type="submit"
      >
        Uygula
      </button>
    </form>
  );
}
