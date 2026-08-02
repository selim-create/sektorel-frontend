"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Briefcase,
  Eye,
  CalendarDays,
  ClipboardList,
  Plus,
  Clock,
} from "lucide-react";

const DASHBOARD_QUERY = gql`
  query DashboardOverview {
    sektorelSession {
      displayName
      company {
        title
        status
      }
      stats {
        leadCount
        jobCount
        eventCount
        viewCount
      }
      recentItems {
        databaseId
        title
        type
        status
        date
      }
    }
  }
`;

const typeLabels: Record<string, string> = {
  lead: "Talep",
  career: "İş İlanı",
  event: "Etkinlik",
};

const statusLabels: Record<string, string> = {
  publish: "Yayında",
  pending: "Onay Bekliyor",
  draft: "Taslak",
  private: "Özel",
};

export default function DashboardPage() {
  const { data, loading, error } = useQuery(DASHBOARD_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const session = data?.sektorelSession;
  const stats = session?.stats || {
    leadCount: 0,
    jobCount: 0,
    eventCount: 0,
    viewCount: 0,
  };
  const recentItems = session?.recentItems || [];
  const accountName = session?.company?.title || session?.displayName || "Üye";

  const statCards = [
    { label: "Taleplerim", value: stats.leadCount, icon: ClipboardList },
    { label: "İş İlanlarım", value: stats.jobCount, icon: Briefcase },
    { label: "Etkinliklerim", value: stats.eventCount, icon: CalendarDays },
    { label: "Profil Ziyareti", value: stats.viewCount, icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Genel Bakış</h1>
          <p className="text-gray-500 text-sm mt-1">
            Hoş geldiniz, {accountName}. Hesabınızın güncel durumunu buradan takip edebilirsiniz.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/firsatlar/olustur" className="bg-white border border-gray-300 text-secondary px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">
            Talep Oluştur
          </Link>
          <Link href="/kariyer/ilan-ver" className="bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-primary-hover transition-colors flex items-center gap-2">
            <Plus size={16} /> İlan Ver
          </Link>
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Panel verileri alınamadı. Oturumu yenileyip tekrar deneyin.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 p-6 shadow-sm flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{label}</span>
              <span className="text-2xl font-black text-secondary">{loading ? "—" : value}</span>
            </div>
            <div className="p-3 rounded-full bg-gray-50 text-primary">
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wide">Son İçerikler</h3>
            <Link href="/hesabim/ilanlarim" className="text-xs font-bold text-primary hover:underline">Tümünü Gör</Link>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-gray-400">İçerikler yükleniyor...</div>
          ) : recentItems.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentItems.map((item: { databaseId: number; title: string; type: string; status: string; date: string }) => (
                <div key={`${item.type}-${item.databaseId}`} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5">
                        {typeLabels[item.type] || item.type}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-primary">
                        {statusLabels[item.status] || item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-secondary truncate">{item.title}</h4>
                    <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock size={11} /> {new Date(item.date).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <h4 className="font-bold text-secondary mb-2">Henüz yayınlanmış içeriğiniz yok</h4>
              <p className="text-sm text-gray-500 mb-5">İlk talebinizi, iş ilanınızı veya etkinliğinizi oluşturarak başlayabilirsiniz.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/firsatlar/olustur" className="border border-gray-300 px-4 py-2 text-xs font-bold uppercase text-secondary hover:bg-gray-50">Talep Oluştur</Link>
                <Link href="/kariyer/ilan-ver" className="bg-primary px-4 py-2 text-xs font-bold uppercase text-white">İlan Ver</Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 shadow-sm h-fit">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wide">Hesap Durumu</h3>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Firma</span>
              <span className="font-bold text-secondary text-right">{session?.company?.title || "Bağlı firma yok"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Firma durumu</span>
              <span className="font-bold text-secondary text-right">{session?.company ? statusLabels[session.company.status] || session.company.status : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
