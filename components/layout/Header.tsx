"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Armchair,
  Briefcase,
  Building2,
  Car,
  ChevronDown,
  Cpu,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Package,
  Plane,
  Plus,
  Settings,
  Shirt,
  ShoppingBag,
  Stethoscope,
  Truck,
  User,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import HeaderSearch from "@/components/search/HeaderSearch";

const MAIN_SECTORS = [
  { name: "İnşaat, Yapı & Gayrimenkul", icon: Building2, color: "text-orange-600", bg: "bg-orange-50", slug: "insaat-yapi-and-gayrimenkul" },
  { name: "Bilişim, Teknoloji & Telekom", icon: Cpu, color: "text-blue-500", bg: "bg-blue-50", slug: "bilisim-teknoloji-and-telekom" },
  { name: "Otomotiv & Yan Sanayi", icon: Car, color: "text-red-500", bg: "bg-red-50", slug: "otomotiv-and-yan-sanayi" },
  { name: "Enerji & Tabii Kaynaklar", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50", slug: "enerji-and-tabii-kaynaklar" },
  { name: "Tekstil, Moda & Deri", icon: Shirt, color: "text-pink-500", bg: "bg-pink-50", slug: "tekstil-moda-and-deri" },
  { name: "Gıda, Tarım & Hayvancılık", icon: Wheat, color: "text-green-500", bg: "bg-green-50", slug: "gida-tarim-and-hayvancilik" },
  { name: "Makine & Sanayi", icon: Settings, color: "text-slate-500", bg: "bg-slate-50", slug: "makine-and-sanayi" },
  { name: "Elektrik & Elektronik", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50", slug: "elektrik-and-elektronik" },
  { name: "Lojistik & Taşımacılık", icon: Truck, color: "text-cyan-500", bg: "bg-cyan-50", slug: "lojistik-and-tasimacilik" },
  { name: "Sağlık, Medikal & Kozmetik", icon: Stethoscope, color: "text-rose-500", bg: "bg-rose-50", slug: "saglik-medikal-and-kozmetik" },
  { name: "Dış Ticaret & Pazarlama", icon: Globe, color: "text-teal-500", bg: "bg-teal-50", slug: "dis-ticaret-and-pazarlama" },
  { name: "Mobilya & Dekorasyon", icon: Armchair, color: "text-violet-500", bg: "bg-violet-50", slug: "mobilya-and-dekorasyon" },
  { name: "Turizm, Otel & Restoran", icon: Plane, color: "text-sky-500", bg: "bg-sky-50", slug: "turizm-otel-and-restoran" },
  { name: "Hizmet & Danışmanlık", icon: Briefcase, color: "text-gray-600", bg: "bg-gray-50", slug: "hizmet-and-danismanlik" },
  { name: "Kimya & Plastik", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-50", slug: "kimya-and-plastik" },
  { name: "Kağıt, Ambalaj & Matbaa", icon: Package, color: "text-purple-400", bg: "bg-purple-50", slug: "kagit-ambalaj-and-matbaa" },
  { name: "Madencilik & Metal", icon: Hammer, color: "text-stone-500", bg: "bg-stone-50", slug: "madencilik-and-metal" },
  { name: "Perakende & Mağazacılık", icon: ShoppingBag, color: "text-orange-400", bg: "bg-orange-50", slug: "perakende-and-magazacilik" },
  { name: "Medya & Ajans", icon: Megaphone, color: "text-indigo-500", bg: "bg-indigo-50", slug: "medya-and-ajans" },
  { name: "Eğitim & Akademik", icon: GraduationCap, color: "text-red-400", bg: "bg-red-50", slug: "egitim-and-akademik" },
  { name: "Finans & Sigorta", icon: Landmark, color: "text-emerald-500", bg: "bg-emerald-50", slug: "finans-and-sigorta" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("User data parse error", error);
        setUser(null);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMegaMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();

      if (window.innerWidth >= 1024) {
        desktopSearchRef.current?.focus();
        return;
      }

      setIsMobileMenuOpen(true);
      window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/giris");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-gray-200 bg-white font-sans shadow-sm">
      <div className="relative z-50 flex h-9 items-center justify-between bg-secondary px-4 text-[11px] tracking-wide text-gray-300 transition-colors lg:px-12">
        <div className="hidden items-center gap-4 md:flex">
          <span className="opacity-80">Türkiye&#39;nin En Kapsamlı Sektörel Ajandası</span>
          <span className="h-3 w-px bg-gray-700" />
          <Link className="transition hover:text-white" href="/hakkimizda">Hakkımızda</Link>
          <Link className="transition hover:text-white" href="/iletisim">İletişim</Link>
        </div>

        <div className="ml-auto flex w-full items-center justify-end gap-4 md:w-auto">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:inline">
                Hoş geldin, <span className="font-bold text-white">{user?.name}</span>
              </span>
              <span className="hidden text-gray-600 sm:inline">|</span>
              <Link className="flex items-center gap-1 font-semibold text-white transition hover:text-primary" href="/hesabim">
                <LayoutDashboard size={12} /> Yönetim Paneli
              </Link>
              <span className="text-gray-600">|</span>
              <button className="flex items-center gap-1 transition hover:text-red-400" onClick={handleLogout} type="button">
                <LogOut size={12} /> Çıkış
              </button>
            </>
          ) : (
            <>
              <Link className="flex items-center gap-1 font-semibold text-white transition hover:text-primary" href="/giris">
                <User size={12} /> Giriş Yap
              </Link>
              <span className="text-gray-600">|</span>
              <Link className="transition hover:text-white" href="/kayit">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>

      <div className="relative z-40 flex items-center justify-between gap-8 border-b border-gray-100 bg-white px-4 py-4 lg:px-12">
        <Link className="shrink-0" href="/">
          <Image
            alt="Sektörel Ajanda"
            className="h-9 w-auto"
            height={50}
            priority
            src="/sektorel-ajanda-logo.svg"
            width={220}
          />
        </Link>

        <HeaderSearch ref={desktopSearchRef} variant="desktop" />

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary-hover"
            href="/firma-ekle"
          >
            <Plus size={16} strokeWidth={3} /> Firma Ekle
          </Link>
        </div>

        <button
          aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="p-2 text-secondary transition-colors hover:bg-gray-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          type="button"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className="relative z-30 hidden border-b border-gray-200 bg-white lg:block">
        <div className="px-4 lg:px-12">
          <nav className="flex h-12 items-center gap-1 text-sm font-bold uppercase tracking-tight text-secondary">
            <div
              className="group h-full"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                className={`flex h-full items-center gap-1 border-b-2 px-4 transition-colors ${
                  isMegaMenuOpen
                    ? "border-primary bg-gray-50 text-primary"
                    : "border-transparent hover:text-primary"
                }`}
                href="/sektorler"
              >
                Sektörler
                <ChevronDown className={`transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} size={14} />
              </Link>

              {isMegaMenuOpen ? (
                <div className="absolute left-0 top-full z-50 max-h-[80vh] w-full overflow-y-auto border-t border-gray-200 bg-white px-12 py-8 shadow-xl">
                  <div className="container mx-auto">
                    <div className="mb-6 flex items-end justify-between border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-secondary">Tüm Sektörler</h3>
                        <p className="mt-1 text-xs text-gray-500">Sektörel Ajanda rehberindeki ana kategoriler.</p>
                      </div>
                      <Link className="flex items-center gap-1 text-xs font-bold text-primary hover:underline" href="/sektorler">
                        Tümünü Gör <ChevronDown className="-rotate-90" size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                      {MAIN_SECTORS.map((sector) => {
                        const Icon = sector.icon;

                        return (
                          <Link
                            className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-100 hover:bg-gray-50"
                            href={`/sektor/${sector.slug}`}
                            key={sector.slug}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-md transition-transform group-hover:scale-110 ${sector.bg} ${sector.color}`}>
                              <Icon size={20} />
                            </div>
                            <span className="block text-xs font-bold leading-tight text-gray-700 transition-colors group-hover:text-primary">
                              {sector.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <Link className="flex h-full items-center border-b-2 border-transparent px-4 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary" href="/firmalar">Firma Rehberi</Link>
            <Link className="flex h-full items-center border-b-2 border-transparent px-4 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary" href="/haberler">Haberler</Link>
            <Link className="flex h-full items-center border-b-2 border-transparent px-4 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary" href="/ajanda">Etkinlikler</Link>
            <Link className="flex h-full items-center border-b-2 border-transparent px-4 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary" href="/firsatlar">Fırsatlar</Link>
            <Link className="flex h-full items-center border-b-2 border-transparent px-4 transition-colors hover:border-primary hover:bg-gray-50 hover:text-primary" href="/kariyer">İK &amp; Kariyer</Link>

            <Link className="ml-auto flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-bold normal-case text-gray-500 transition-all hover:border-gray-300 hover:text-secondary" href="/harita">
              <MapPin size={14} /> Haritada Keşfet
            </Link>
          </nav>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <span className="text-lg font-black text-secondary">MENÜ</span>
            <button
              aria-label="Menüyü kapat"
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              <X className="text-secondary" size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            <HeaderSearch
              onNavigate={() => setIsMobileMenuOpen(false)}
              ref={mobileSearchRef}
              variant="mobile"
            />

            <p className="mb-2 text-xs font-bold uppercase text-gray-400">Keşfet</p>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/sektorler">Sektörler</Link>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/firmalar">Firmalar</Link>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/harita">Harita</Link>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/firsatlar">Ticari Fırsatlar</Link>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/ajanda">Etkinlikler</Link>
            <Link className="block border-l-4 border-transparent px-4 py-3 text-lg font-bold text-secondary hover:border-primary hover:bg-gray-50" href="/haberler">Haberler</Link>

            <div className="mt-8 border-t border-gray-100 pt-8">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="mb-4 flex items-center gap-3 px-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block font-bold text-secondary">{user?.name}</span>
                      <span className="text-xs text-gray-500">Üye Hesabı</span>
                    </div>
                  </div>
                  <Link className="block w-full bg-secondary py-3 text-center font-bold uppercase text-white" href="/hesabim">Yönetim Paneli</Link>
                  <button className="block w-full border border-gray-200 py-3 text-center font-bold uppercase text-secondary hover:border-red-200 hover:bg-red-50 hover:text-red-600" onClick={handleLogout} type="button">Çıkış Yap</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link className="border border-gray-300 py-3 text-center font-bold uppercase text-secondary hover:bg-gray-50" href="/giris">Giriş Yap</Link>
                  <Link className="bg-primary py-3 text-center font-bold uppercase text-white hover:bg-primary-hover" href="/kayit">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
