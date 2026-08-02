"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, Menu, X, MapPin, 
  Briefcase, Calendar, FileText, 
  Users, TrendingUp, ChevronDown,
  LayoutDashboard, LogOut, User,
  Bell, Building2,
  // Yeni Sektör İkonları
  Cpu, Globe, Car, Shirt, Zap, Wheat, Settings, Lightbulb, Truck, 
  Armchair, Stethoscope, Plane, FlaskConical, Package, Hammer, 
  ShoppingBag, Megaphone, GraduationCap, Landmark
} from "lucide-react";

// Türkçe karakter uyumlu Slug Oluşturucu
const slugify = (text: string) => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  
  return text
    .replace(/[çğıİöşüÇĞIÖŞÜ]/g, (match) => trMap[match]) // Türkçe karakterleri değiştir
    .toLowerCase()
    .replace(/&/g, 'and') // & işaretini 'and' yap
    .replace(/[^a-z0-9\s-]/g, '') // Alfanümerik olmayanları sil
    .trim()
    .replace(/\s+/g, '-'); // Boşlukları tire yap
};

// Gerçek Ana Sektörler Listesi (Excel Verisine Uygun)
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
  const [user, setUser] = useState<{name: string} | null>(null);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  
  // Sektörler Mega Menü Kontrolü
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // Auth Durumunu Kontrol Et
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("User data parse error", e);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]); // Sayfa değişiminde de kontrol et

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/giris");
    router.refresh();
  };

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMegaMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (window.innerWidth >= 1024) {
          desktopSearchRef.current?.focus();
          return;
        }

        setIsMobileMenuOpen(true);
        window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const submitSearch = (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;

    setDesktopSearchQuery("");
    setMobileSearchQuery("");
    setIsMobileMenuOpen(false);
    router.push(`/ara?q=${encodeURIComponent(query)}`);
  };

  const handleDesktopSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(desktopSearchQuery);
  };

  const handleMobileSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(mobileSearchQuery);
  };

  return (
    <header className="flex flex-col w-full border-b border-gray-200 bg-white sticky top-0 z-50 font-sans shadow-sm">
      
      {/* 1. TOP BAR (Siyah İnce Bant) */}
      <div className="bg-secondary text-gray-300 text-[11px] h-9 flex items-center justify-between px-4 lg:px-12 tracking-wide transition-colors relative z-50">
        <div className="hidden md:flex gap-4 items-center">
          <span className="opacity-80">Türkiye&#39;nin En Kapsamlı Sektörel Ajandası</span>
          <span className="w-px h-3 bg-gray-700"></span>
          <Link href="/hakkimizda" className="hover:text-white transition">Hakkımızda</Link>
          <Link href="/iletisim" className="hover:text-white transition">İletişim</Link>
        </div>
        
        {/* SAĞ: AUTH DURUMU */}
        <div className="flex items-center gap-4 ml-auto w-full md:w-auto justify-end">
          {isLoggedIn ? (
             <>
               <span className="hidden sm:inline">Hoş geldin, <span className="text-white font-bold">{user?.name}</span></span>
               <span className="hidden sm:inline text-gray-600">|</span>
               <Link href="/hesabim" className="hover:text-primary transition flex items-center gap-1 text-white font-semibold">
                  <LayoutDashboard size={12} /> Yönetim Paneli
               </Link>
               <span className="text-gray-600">|</span>
               <button onClick={handleLogout} className="hover:text-red-400 transition flex items-center gap-1">
                  <LogOut size={12} /> Çıkış
               </button>
             </>
          ) : (
             <>
               <Link href="/giris" className="hover:text-primary transition font-semibold text-white flex items-center gap-1">
                 <User size={12} /> Giriş Yap
               </Link>
               <span className="text-gray-600">|</span>
               <Link href="/kayit" className="hover:text-white transition">Kayıt Ol</Link>
             </>
          )}
        </div>
      </div>

      {/* 2. BRAND & SEARCH BAR (Orta Katman) */}
      <div className="bg-white py-4 px-4 lg:px-12 flex items-center justify-between gap-8 border-b border-gray-100 relative z-40">
        
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/sektorel-ajanda-logo.svg" 
            alt="Sektörel Ajanda"
            width={220}
            height={50}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* ORTA: ARAMA (Desktop) */}
        <form onSubmit={handleDesktopSearchSubmit} className="hidden lg:flex flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            ref={desktopSearchRef}
            type="search"
            value={desktopSearchQuery}
            onChange={(event) => setDesktopSearchQuery(event.target.value)}
            onFocus={() => setIsDesktopSearchFocused(true)}
            onBlur={() => setIsDesktopSearchFocused(false)}
            placeholder="Firma, sektör, haber veya etkinlik ara..."
            className={`w-full pl-10 pr-32 py-3 bg-gray-50 border text-sm focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-none placeholder:text-gray-400 ${
              isDesktopSearchFocused ? "border-primary bg-white" : "border-gray-200"
            }`}
          />
          <div className="absolute inset-y-1 right-1">
            <button type="submit" className="h-full px-6 bg-secondary text-white text-xs font-bold hover:bg-black transition-colors uppercase tracking-wider">
              ARA
            </button>
          </div>
        </form>

        {/* SAĞ: CTA (Firma Ekle) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="/firma-ekle" 
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wide transition-transform hover:-translate-y-0.5 shadow-sm uppercase flex items-center gap-2"
          >
            <PlusIcon size={16} /> Firma Ekle
          </Link>
        </div>

        {/* MOBİL MENÜ BUTONU */}
        <button 
          className="lg:hidden text-secondary p-2 hover:bg-gray-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 3. NAVIGATION BAR (Alt Katman - Ana Menü) */}
      <div className="hidden lg:block bg-white border-b border-gray-200 relative z-30">
        <div className="px-4 lg:px-12">
          <nav className="flex items-center gap-1 text-sm font-bold text-secondary uppercase tracking-tight h-12">
            
            {/* Mega Menu Trigger */}
            <div 
              className="group h-full"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link 
                href="/sektorler" 
                className={`h-full flex items-center px-4 border-b-2 transition-colors gap-1 ${isMegaMenuOpen ? 'border-primary text-primary bg-gray-50' : 'border-transparent hover:text-primary'}`}
              >
                Sektörler <ChevronDown size={14} className={`transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* MEGA MENU DROPDOWN - YENİLENDİ */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl py-8 px-12 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                   <div className="container mx-auto">
                      <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                         <div>
                           <h3 className="text-xl font-black text-secondary uppercase tracking-tight">Tüm Sektörler</h3>
                           <p className="text-xs text-gray-500 mt-1">Sektörel Ajanda rehberindeki ana kategoriler.</p>
                         </div>
                         <Link href="/sektorler" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                           Tümünü Gör <ChevronDown size={12} className="-rotate-90" />
                         </Link>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                         {MAIN_SECTORS.map((sector, i) => (
                           <Link 
                             key={i} 
                             href={`/sektor/${sector.slug}`} 
                             className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                           >
                             <div className={`w-10 h-10 flex items-center justify-center rounded-md ${sector.bg} ${sector.color} group-hover:scale-110 transition-transform`}>
                               <sector.icon size={20} />
                             </div>
                             <div>
                               <span className="text-xs font-bold text-gray-700 block group-hover:text-primary transition-colors leading-tight">
                                 {sector.name}
                               </span>
                             </div>
                           </Link>
                         ))}
                      </div>
                   </div>
                </div>
              )}
            </div>

            <Link href="/firmalar" className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors hover:bg-gray-50">
              Firma Rehberi
            </Link>

            <Link href="/haberler" className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors hover:bg-gray-50">
              Haberler
            </Link>
            
            <Link href="/ajanda" className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors gap-1 hover:bg-gray-50">
              Etkinlikler
            </Link>

            <Link href="/firsatlar" className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors hover:bg-gray-50">
              Fırsatlar
            </Link>
            
            <Link href="/kariyer" className="h-full flex items-center px-4 border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors hover:bg-gray-50">
              İK & Kariyer
            </Link>
            
            <Link href="/harita" className="ml-auto flex items-center gap-2 text-gray-500 hover:text-secondary font-bold text-xs normal-case bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-all">
              <MapPin size={14} /> Haritada Keşfet
            </Link>
          </nav>
        </div>
      </div>

      {/* MOBİL MENÜ (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Mobil Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
             <span className="font-black text-lg text-secondary">MENÜ</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
               <X size={24} className="text-secondary"/>
             </button>
          </div>

          {/* Menü Linkleri */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {/* Arama (Mobil) */}
            <form onSubmit={handleMobileSearchSubmit} className="relative mb-6">
               <input
                 ref={mobileSearchRef}
                 type="search"
                 value={mobileSearchQuery}
                 onChange={(event) => setMobileSearchQuery(event.target.value)}
                 placeholder="Ara..."
                 className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 pr-20 text-sm rounded-none focus:border-primary outline-none"
               />
               <Search className="absolute left-3 top-3.5 text-gray-400" size={16}/>
               <button
                 type="submit"
                 className="absolute inset-y-1 right-1 px-4 bg-secondary text-white text-xs font-bold uppercase tracking-wider"
               >
                 Ara
               </button>
            </form>

            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Keşfet</p>
            <Link href="/sektorler" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Sektörler</Link>
            <Link href="/firmalar" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Firmalar</Link>
            <Link href="/harita" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Harita</Link>
            <Link href="/firsatlar" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Ticari Fırsatlar</Link>
            <Link href="/ajanda" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Etkinlikler</Link>
            <Link href="/haberler" className="block py-3 px-4 border-l-4 border-transparent hover:border-primary hover:bg-gray-50 font-bold text-secondary text-lg">Haberler</Link>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
               {isLoggedIn ? (
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 mb-4">
                       <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <span className="block font-bold text-secondary">{user?.name}</span>
                          <span className="text-xs text-gray-500">Üye Hesabı</span>
                       </div>
                    </div>
                    <Link href="/hesabim" className="block w-full bg-secondary text-white text-center py-3 font-bold uppercase">Yönetim Paneli</Link>
                    <button onClick={handleLogout} className="block w-full border border-gray-200 text-secondary text-center py-3 font-bold uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-200">Çıkış Yap</button>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                    <Link href="/giris" className="border border-gray-300 text-secondary py-3 text-center font-bold uppercase hover:bg-gray-50">Giriş Yap</Link>
                    <Link href="/kayit" className="bg-primary text-white py-3 text-center font-bold uppercase hover:bg-primary-hover">Kayıt Ol</Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// İkon Helper
function PlusIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}