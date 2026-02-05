import Link from "next/link";
import { 
  Search, 
  Building2, 
  FileText, 
  Calendar, 
  Briefcase, 
  ChevronRight, 
  MapPin,
  Clock
} from "lucide-react";

// MOCK DATA: Karışık Arama Sonuçları
const RESULTS = [
  {
    id: 1,
    type: "FİRMA",
    title: "Yıldız Yapı Mimarlık",
    description: "30 yıllık tecrübemizle kentsel dönüşüm ve mimari projelerde hizmet veriyoruz.",
    link: "/firma/yildiz-yapi",
    meta: "İstanbul, Kadıköy"
  },
  {
    id: 2,
    type: "HABER",
    title: "İnşaat Sektöründe Yeni Teşvik Paketi Açıklandı",
    description: "Ticaret Bakanlığı tarafından yapılan açıklamaya göre kentsel dönüşüm projelerine hibe desteği artırıldı.",
    link: "/haber/insaat-tesvik",
    meta: "28 Ocak 2026"
  },
  {
    id: 3,
    title: "Avrasya Pencere Fuarı 2026",
    type: "ETKİNLİK",
    description: "Bölgenin en büyük pencere ve cam fuarı Tüyap'ta kapılarını açıyor.",
    link: "/ajanda/avrasya-fuari",
    meta: "04 Mart 2026"
  },
  {
    id: 4,
    title: "Satış Müdürü",
    type: "KARİYER",
    description: "Yıldız Yapı Mimarlık bünyesinde görevlendirilecek, inşaat malzemeleri satışında deneyimli yönetici aranıyor.",
    link: "/kariyer/satis-muduru",
    meta: "Tam Zamanlı"
  },
  {
    id: 5,
    title: "200 Ton İnşaat Demiri Alımı",
    type: "TİCARET",
    description: "Kartal projemiz için nervürlü inşaat demiri alım talebi.",
    link: "/firsatlar/insaat-demiri",
    meta: "Alım Talebi"
  }
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "inşaat"; // Varsayılan arama terimi simülasyonu

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HEADER & SEARCH BAR */}
      <section className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
           <h1 className="text-2xl md:text-3xl font-black text-secondary uppercase tracking-tight mb-6">
             Arama Sonuçları: <span className="text-primary">"{query}"</span>
           </h1>
           
           <div className="relative">
             <input 
               type="text" 
               defaultValue={query}
               placeholder="Sitede ara..." 
               className="w-full pl-12 pr-32 py-4 bg-gray-50 border border-gray-200 text-base font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors shadow-inner"
             />
             {/* İkon Düzeltmesi: top-1/2 ile dikey ortalama */}
             <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             
             {/* Buton Düzeltmesi: top-1/2 ile dikey ortalama */}
             <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-white px-6 py-2 text-sm font-bold uppercase hover:bg-primary transition-colors">
               Ara
             </button>
           </div>
        </div>
      </section>

      {/* 2. SONUÇLAR VE FİLTRELER */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* SOL: Sekmeler / Filtreler */}
          <aside className="w-full md:w-1/4">
             <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Filtrele</h3>
                <nav className="space-y-1">
                  {[
                    { label: "Tümü", count: 125, active: true },
                    { label: "Firmalar", count: 45, active: false },
                    { label: "Haberler", count: 32, active: false },
                    { label: "Etkinlikler", count: 12, active: false },
                    { label: "İlanlar", count: 8, active: false },
                    { label: "Fırsatlar", count: 28, active: false },
                  ].map((tab, i) => (
                    <button 
                      key={i}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold uppercase transition-colors ${tab.active ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-secondary'}`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] py-0.5 px-1.5 rounded-full ${tab.active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>{tab.count}</span>
                    </button>
                  ))}
                </nav>
             </div>
          </aside>

          {/* SAĞ: Sonuç Listesi */}
          <main className="w-full md:w-3/4 space-y-4">
             <p className="text-xs font-bold text-gray-400 uppercase mb-2">Toplam {RESULTS.length} sonuç gösteriliyor</p>
             
             {RESULTS.map((item) => (
               <Link href={item.link} key={item.id} className="group block bg-white border border-gray-200 p-6 hover:border-primary hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                     <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide border ${
                        item.type === 'FİRMA' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        item.type === 'HABER' ? 'bg-red-50 text-red-600 border-red-100' :
                        item.type === 'ETKİNLİK' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                     }`}>
                       {item.type}
                     </span>
                     <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
                     {item.type === 'FİRMA' && <MapPin size={12} />}
                     {item.type === 'ETKİNLİK' && <Calendar size={12} />}
                     {(item.type === 'HABER' || item.type === 'KARİYER') && <Clock size={12} />}
                     {item.meta}
                  </div>
               </Link>
             ))}

             {/* Pagination */}
             <div className="pt-8 flex justify-center">
                <button className="px-8 py-3 border border-gray-300 text-secondary font-bold text-sm uppercase hover:bg-secondary hover:text-white transition-colors">
                  Daha Fazla Sonuç
                </button>
             </div>
          </main>

        </div>
      </div>
    </div>
  );
}