"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Bell,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import {
  clearSession,
  getRefreshToken,
  getSessionUser,
  type SessionUser,
} from "@/lib/auth";

const SESSION_QUERY = gql`
  query SektorelSession {
    sektorelSession {
      userId
      displayName
      email
      accountType
      role
      company {
        databaseId
        title
        slug
        status
        verified
        viewCount
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation LogoutSektorelUser($refreshToken: String!) {
    logoutSektorelUser(input: { clientMutationId: "logout", refreshToken: $refreshToken }) {
      success
    }
  }
`;

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "Ü";
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [fallbackUser, setFallbackUser] = useState<SessionUser | null>(null);

  // localStorage yalnızca mount sonrasında okunur. Böylece sunucu çıktısı ile
  // tarayıcının ilk render'ı aynı kalır ve hydration farkı oluşmaz.
  useEffect(() => {
    setFallbackUser(getSessionUser());
  }, []);

  const { data, loading } = useQuery(SESSION_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [logout, { loading: loggingOut }] = useMutation(LOGOUT_MUTATION);

  const profile = data?.sektorelSession;
  const company = profile?.company;
  const displayName = company?.title || profile?.displayName || fallbackUser?.name || "Üye";
  const accountLabel = company
    ? company.status === "publish"
      ? "Kurumsal Üye"
      : "Firma Onay Bekliyor"
    : profile?.accountType === "kurumsal"
      ? "Kurumsal Üye"
      : "Bireysel Üye";

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logout({ variables: { refreshToken } });
      }
    } finally {
      clearSession();
      router.replace("/giris");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="w-64 bg-secondary text-white flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto border-r border-gray-800">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="font-black text-xl tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">S</span>
            SEKTÖREL
          </Link>
        </div>

        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
            <span className="font-bold text-sm">{initials(displayName)}</span>
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold truncate w-36">
              {loading && !profile && !fallbackUser ? "Yükleniyor..." : displayName}
            </span>
            <span className="text-[10px] text-gray-400 uppercase">{accountLabel}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Yönetim</p>
          <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <LayoutDashboard size={18} className="group-hover:text-primary" /> Özet Durum
          </Link>
          <Link href="/hesabim/ilanlarim" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <Briefcase size={18} className="group-hover:text-primary" /> İlanlarım & Talepler
          </Link>
          <Link href="/hesabim/teklifler" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <FileText size={18} className="group-hover:text-primary" /> Gelen Teklifler
          </Link>
          <Link href="/hesabim/etkinlikler" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <Calendar size={18} className="group-hover:text-primary" /> Etkinliklerim
          </Link>

          <div className="my-4 border-t border-gray-800" />
          <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Hesap</p>
          <Link href="/hesabim/ayarlar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <Settings size={18} className="group-hover:text-primary" /> Firma Ayarları
          </Link>
          <Link href="/hesabim/kullanicilar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
            <User size={18} className="group-hover:text-primary" /> Alt Kullanıcılar
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 w-full px-4 py-2 disabled:opacity-60"
          >
            <LogOut size={16} /> {loggingOut ? "Çıkış yapılıyor..." : "Güvenli Çıkış"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <span className="text-sm font-bold text-gray-400 lg:hidden">Panel</span>
          <div className="hidden lg:block text-sm font-bold text-gray-500">
            Yönetim Paneli / <span className="text-secondary">Genel Bakış</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="relative p-2 text-gray-400 hover:text-primary">
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            {company?.slug ? (
              <Link href={`/firma/${company.slug}`} className="text-xs font-bold uppercase text-secondary hover:text-primary flex items-center gap-2">
                <Building2 size={16} /> Firma Profilim
              </Link>
            ) : (
              <Link href="/firma-ekle" className="text-xs font-bold uppercase text-secondary hover:text-primary flex items-center gap-2">
                <Building2 size={16} /> Firma Ekle
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
