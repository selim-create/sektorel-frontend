"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type SearchTabKey =
  | "all"
  | "companies"
  | "sectors"
  | "posts"
  | "events"
  | "leads"
  | "jobs";

type TabDef = {
  key: SearchTabKey;
  label: string;
  count: number;
  activeClass: string;
};

type SearchTabsProps = {
  activeTab: SearchTabKey;
  counts: Record<SearchTabKey, number>;
  searchQuery: string;
};

export default function SearchTabs({ activeTab, counts, searchQuery }: SearchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs: TabDef[] = [
    { key: "all", label: "Tümü", count: counts.all, activeClass: "border-secondary bg-secondary text-white" },
    { key: "companies", label: "Firmalar", count: counts.companies, activeClass: "border-blue-600 bg-blue-600 text-white" },
    { key: "sectors", label: "Sektörler", count: counts.sectors, activeClass: "border-cyan-600 bg-cyan-600 text-white" },
    { key: "posts", label: "Haberler", count: counts.posts, activeClass: "border-primary bg-primary text-white" },
    { key: "events", label: "Etkinlikler", count: counts.events, activeClass: "border-green-600 bg-green-600 text-white" },
    { key: "leads", label: "Fırsatlar", count: counts.leads, activeClass: "border-amber-600 bg-amber-600 text-white" },
    { key: "jobs", label: "İş İlanları", count: counts.jobs, activeClass: "border-purple-600 bg-purple-600 text-white" },
  ];

  function handleTabClick(key: SearchTabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("tab");
    else params.set("tab", key);
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/ara?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
              isActive
                ? tab.activeClass
                : "border-gray-200 bg-white text-gray-500 hover:border-secondary hover:text-secondary"
            }`}
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            type="button"
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
