import Link from "next/link";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  Building2,
  Calendar
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SOL SIDEBAR (Sabit) */}
      <aside className="w-64 bg-secondary text-white flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 overflow-y-auto border-r border-gray-800">
        
        {/* Logo Alanı */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="font-black text-xl tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">S</span>
            SEKTÖREL
          </Link>
        </div>

        {/* Kullanıcı Özeti */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
           <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <span className="font-bold text-sm">YY</span>
           </div>
           <div>
              <span className="block text-sm font-bold truncate w-32">Yıldız Yapı Mimarlık</span>
              <span className="text-[10px] text-gray-400 uppercase">Kurumsal Üye</span>
           </div>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 p-4 space-y-1">
           <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Yönetim</p>
           
           <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <LayoutDashboard size={18} className="group-hover:text-primary transition-colors" /> Özet Durum
           </Link>
           <Link href="/hesabim/ilanlarim" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <Briefcase size={18} className="group-hover:text-primary transition-colors" /> İlanlarım & Talepler
           </Link>
           <Link href="/hesabim/teklifler" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <FileText size={18} className="group-hover:text-primary transition-colors" /> Gelen Teklifler
             <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
           </Link>
           <Link href="/hesabim/etkinlikler" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <Calendar size={18} className="group-hover:text-primary transition-colors" /> Etkinliklerim
           </Link>

           <div className="my-4 border-t border-gray-800"></div>
           <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Hesap</p>

           <Link href="/hesabim/ayarlar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <Settings size={18} className="group-hover:text-primary transition-colors" /> Firma Ayarları
           </Link>
           <Link href="/hesabim/kullanicilar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-sm transition-colors group">
             <User size={18} className="group-hover:text-primary transition-colors" /> Alt Kullanıcılar
           </Link>
        </nav>

        {/* Çıkış */}
        <div className="p-4 border-t border-gray-800">
           <button className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 w-full px-4 py-2 transition-colors">
             <LogOut size={16} /> Güvenli Çıkış
           </button>
        </div>
      </aside>

      {/* SAĞ: İÇERİK ALANI */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Üst Bar (Mobile Toggle + User Actions) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
           <span className="text-sm font-bold text-gray-400 lg:hidden">Menu</span>
           
           {/* Breadcrumb / Page Title Placeholder */}
           <div className="hidden lg:block text-sm font-bold text-gray-500">
             Yönetim Paneli / <span className="text-secondary">Genel Bakış</span>
           </div>

           <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <Link href="/" className="text-xs font-bold uppercase text-secondary hover:text-primary flex items-center gap-2">
                 <Building2 size={16}/> Siteye Dön
              </Link>
           </div>
        </header>

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
           {children}
        </main>

      </div>
    </div>
  );
}