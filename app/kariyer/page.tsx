import Link from "next/link";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_JOBS } from "@/lib/queries";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Building2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Users,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export const revalidate = 60;

export default async function CareerPage() {
  const { data } = await queryWithFallback<any>({ query: GET_JOBS }, { jobs: { nodes: [] } }, "jobs listing");
  const jobs = data?.jobs?.nodes || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="container mx-auto relative z-10">
           <div className="flex flex-col md:flex-row items-end justify-between gap-6">
             <div>
               <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 bg-white/5 border border-white/10 px-3 py-1">
                 <Users size={12} className="text-primary"/> İnsan Kaynakları & Kariyer
               </div>
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">
                 Sektörün Yetenekleri
               </h1>
               <p className="text-gray-400 mt-4 text-lg max-w-2xl">
                 Kariyerinize yön verecek en güncel iş ilanları ve sektör profesyonellerinden tavsiyeler.
               </p>
             </div>
             
             {/* İlan Ver Butonu */}
             <div className="flex gap-4">
               <Link href="/kariyer/ilan-ver" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1">
                 <Plus size={18} /> İlan Yayınla
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* 2. İSTATİSTİK BANTI */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">{jobs.length}</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Açık Pozisyon</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">--</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Firma</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">Remote</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Uzaktan İş Fırsatı</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">Staj</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Yeni Mezun</span>
              </div>
           </div>
        </div>
      </div>

      {/* 3. İÇERİK ALANI */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SOL: Sidebar (Filtreler) */}
          <aside className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4">İlan Ara</h3>
               <div className="relative mb-4">
                 <input type="text" placeholder="Pozisyon, firma veya yetenek..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary rounded-none" />
                 <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
               </div>
               <div className="relative mb-4">
                 <input type="text" placeholder="Şehir..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary rounded-none" />
                 <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
               </div>
               <button className="w-full bg-secondary text-white py-3 font-bold uppercase text-xs hover:bg-black transition-colors">
                 Sonuçları Getir
               </button>
            </div>

            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                 Çalışma Şekli
               </h3>
               <div className="space-y-2">
                 {["Tam Zamanlı", "Yarı Zamanlı", "Uzaktan", "Hibrit", "Staj"].map((type, i) => (
                   <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer h-4 w-4 appearance-none border border-gray-300 checked:bg-primary checked:border-primary transition-all rounded-none" />
                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{type}</span>
                   </label>
                 ))}
               </div>
            </div>
          </aside>

          {/* SAĞ: İlan Listesi */}
          <main className="w-full lg:w-3/4 space-y-12">
            
            {/* İŞ İLANLARI LİSTESİ */}
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 border border-gray-200 shadow-sm">
                   <span className="text-sm font-bold text-gray-500">
                     <span className="text-secondary">{jobs.length}</span> ilan listeleniyor
                   </span>
                   <select className="bg-gray-50 border border-gray-200 py-1 px-2 text-sm focus:outline-none cursor-pointer">
                     <option>En Yeniler</option>
                     <option>Önerilenler</option>
                   </select>
                </div>

                {jobs.map((job: any) => {
                  const details = job.jobDetails || {};
                  const date = new Date(job.date).toLocaleDateString('tr-TR');

                  return (
                    <Link 
                      href={`/kariyer/${job.slug}`} 
                      key={job.id} 
                      className={`group bg-white border border-gray-200 flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 relative ${details.isFeatured ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-gray-200'}`}
                    >
                       {/* Logo Alanı (Placeholder) */}
                       <div className="w-full md:w-32 bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100 shrink-0 group-hover:bg-white transition-colors">
                          <Briefcase className="text-gray-400 group-hover:text-primary transition-colors" size={32} />
                       </div>

                       {/* İçerik */}
                       <div className="flex-1 p-6 flex flex-col md:flex-row items-start justify-between gap-4">
                          <div>
                             {/* Etiketler */}
                             <div className="flex flex-wrap items-center gap-2 mb-2">
                                {details.isFeatured && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide bg-orange-50 text-primary border border-orange-100 flex items-center gap-1">
                                    <TrendingUp size={10} /> Öne Çıkan
                                  </span>
                                )}
                                {details.workType && (
                                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 bg-gray-50 px-2 py-0.5 border border-gray-100">
                                    {details.workType}
                                  </span>
                                )}
                             </div>

                             <h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-primary transition-colors">
                               {job.title}
                             </h3>
                             <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                               <Building2 size={14} className="text-gray-400" /> {details.companyName || 'Gizli Firma'}
                             </div>

                             <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin size={12}/> {details.location || 'Konum Belirtilmedi'}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {date}</span>
                             </div>
                          </div>

                          {/* Aksiyon */}
                          <div className="mt-4 md:mt-0 flex flex-col items-end gap-2 min-w-[120px]">
                             <span className="w-full text-center bg-secondary text-white py-2 px-4 text-xs font-bold uppercase tracking-wider group-hover:bg-primary transition-colors">
                               Başvur
                             </span>
                          </div>
                       </div>
                    </Link>
                  );
                })}

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                   <button className="px-8 py-3 border border-gray-300 text-secondary font-bold text-sm uppercase hover:bg-secondary hover:text-white transition-colors flex items-center gap-2">
                     Daha Fazla İlan <ArrowRight size={16} />
                   </button>
                </div>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}