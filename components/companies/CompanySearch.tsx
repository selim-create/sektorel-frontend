import { Search } from "lucide-react";

type CompanySearchProps = {
  q?: string;
  sort?: string;
  sector?: string;
  location?: string;
  verified?: string;
};

export default function CompanySearch({ q = "", sort, sector, location, verified }: CompanySearchProps) {
  return (
    <form action="/firmalar" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input name="sort" type="hidden" value={sort ?? "newest"} />
      {sector ? <input name="sector" type="hidden" value={sector} /> : null}
      {location ? <input name="location" type="hidden" value={location} /> : null}
      {verified ? <input name="verified" type="hidden" value={verified} /> : null}

      <div className="relative w-full sm:max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          className="h-12 w-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-secondary outline-none transition-colors focus:border-primary"
          defaultValue={q}
          name="q"
          placeholder="Firma adı, sektör veya şehir ara"
          type="search"
        />
      </div>
      <button
        className="h-12 bg-primary px-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary-hover"
        type="submit"
      >
        Ara
      </button>
    </form>
  );
}
