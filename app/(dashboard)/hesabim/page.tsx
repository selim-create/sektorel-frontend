import Link from "next/link";
import { 
  Briefcase, 
  Eye, 
  FileText, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  Clock,
  MoreHorizontal
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Başlık ve Aksiyon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Genel Bakış</h1>
            <p className="text-gray-500 text-sm mt-1">Hoş geldiniz, hesabınızın güncel durumunu buradan takip edebilirsiniz.</p>
         </div>
         <div className="flex gap-3">
            <Link href="/firsatlar/olustur" className="bg-white border border-gray-300 text-secondary px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">
               Talep Oluştur
            </Link>
            <Link href="/kariyer/ilan-ver" className="bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-primary-hover transition-colors flex items-center gap-2">
               <Plus size={16} /> İlan Ver
            </Link>
         </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: "Aktif İlanlar", val: "12", icon: <Briefcase size={20}/>, color: "text-blue-600 bg-blue-50" },
           { label: "Gelen Teklifler", val: "45", icon: <FileText size={20}/>, color: "text-orange-600 bg-orange-50" },
           { label: "Profil Ziyareti", val: "1.2K", icon: <Eye size={20}/>, color: "text-green-600 bg-green-50" },
           { label: "Kalan Kredi", val: "∞", icon: <TrendingUp size={20}/>, color: "text-purple-600 bg-purple-50" },
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-gray-200 p-6 shadow-sm flex items-start justify-between">
              <div>
                 <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{stat.label}</span>
                 <span className="text-2xl font-black text-secondary">{stat.val}</span>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                 {stat.icon}
              </div>
           </div>
         ))}
      </div>

      {/* Alt Kısım Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Sol: Son İlanlar */}
         <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-sm font-black text-secondary uppercase tracking-wide">Son Yayınlananlar</h3>
               <Link href="/hesabim/ilanlarim" className="text-xs font-bold text-primary hover:underline">Tümünü Gör</Link>
            </div>
            <div className="divide-y divide-gray-100">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-200">
                          #{1024 + i}
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-secondary">Senior Frontend Developer</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                             <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-[2px] font-bold uppercase text-[10px]">Aktif</span>
                             <span className="flex items-center gap-1"><Clock size={10}/> 2 Gün Önce</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <span className="block text-xs font-bold text-secondary">14 Başvuru</span>
                          <span className="text-[10px] text-gray-400">2 Yeni</span>
                       </div>
                       <button className="text-gray-400 hover:text-secondary"><MoreHorizontal size={18}/></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Sağ: Bildirimler / Uyarılar */}
         <div className="bg-white border border-gray-200 shadow-sm h-fit">
            <div className="p-6 border-b border-gray-100">
               <h3 className="text-sm font-black text-secondary uppercase tracking-wide">Bildirimler</h3>
            </div>
            <div className="p-4 space-y-4">
               <div className="flex gap-3 items-start p-3 bg-blue-50 border border-blue-100 rounded-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                     <p className="text-xs text-blue-900 font-medium leading-snug">
                        <span className="font-bold">Yeni Teklif:</span> "50.000 Adet Koli" talebinize yeni bir teklif geldi.
                     </p>
                     <span className="text-[10px] text-blue-400 mt-1 block">10 dk önce</span>
                  </div>
               </div>
               <div className="flex gap-3 items-start p-3 bg-gray-50 border border-gray-100 rounded-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                     <p className="text-xs text-gray-600 font-medium leading-snug">
                        Üyelik paketinizin süresi 5 gün sonra dolacak.
                     </p>
                     <span className="text-[10px] text-gray-400 mt-1 block">1 saat önce</span>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-gray-100">
               <button className="w-full py-2 text-xs font-bold text-secondary uppercase hover:bg-gray-50 transition-colors">
                  Tüm Bildirimleri Gör
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}