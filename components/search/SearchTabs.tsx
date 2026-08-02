"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TabKey = "all" | "companies" | "posts" | "events" | "jobs";

type TabDef = {
  key: TabKey;
  label: string;
  count: number;
  activeClass: string;
};

type SearchTabsProps = {
  activeTab: TabKey;
  counts: Record<TabKey, number>;
  searchQuery: string;
};

export default function SearchTabs({ activeTab, counts, searchQuery }: SearchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs: TabDef[] = [
    { key: "all", label: "Tümü", count: counts.all, activeClass: "bg-secondary text-white border-secondary" },
    { key: "companies", label: "Firmalar", count: counts.companies, activeClass: "bg-blue-600 text-white border-blue-600" },
    { key: "posts", label: "Haberler", count: counts.posts, activeClass: "bg-primary text-white border-primary" },
    { key: "events", label: "Etkinlikler", count: counts.events, activeClass: "bg-green-600 text-white border-green-600" },
    { key: "jobs", label: "İş İlanları", count: counts.jobs, activeClass: "bg-purple-600 text-white border-purple-600" },
  ];

  function handleTabClick(key: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("tab");
    } else {
      params.set("tab", key);
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    router.push(`/ara?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
              isActive
                ? tab.activeClass
                : "border-gray-200 bg-white text-gray-500 hover:border-secondary hover:text-secondary"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
