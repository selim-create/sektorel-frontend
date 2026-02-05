"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, MapPin, ChevronDown, CheckCircle, 
  List, Map as MapIcon, ArrowRight 
} from "lucide-react";

// Placeholder Görsel Fonksiyonu
const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/100x100/e2e8f0/64748b?text=${title.charAt(0).toUpperCase()}`;
};

export default function CompaniesMap({ companies }: { companies: any[] }) {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50 font-sans">
      
      {/* FİLTRE BAR */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm z-20 shrink-0">
        <div className="container mx-auto max-w-full px-2 flex flex-col md:flex-row items-center gap-4">
           <div className="relative w-full md:w-96">
             <input type="text" placeholder="Firma adı, sektör veya hizmet ara..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary rounded-none" />
             <Search size={16} className="absolute left-3 top-3 text-gray-400" />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center justify-between bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary transition-colors min-w-[140px]">
                 <span>Sektör</span> <ChevronDown size={14} className="text-gray-400" />
              </button>
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider shadow-sm transition-colors whitespace-nowrap ml-auto">
                Filtrele
              </button>
           </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* SOL: LİSTE */}
        <div className={`w-full lg:w-[450px] xl:w-[550px] bg-white border-r border-gray-200 flex flex-col z-10 transition-transform duration-300 absolute lg:relative h-full ${showMapMobile ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
           <div className="p-4 border-b border-gray-100 flex items-center justify-center lg:justify-between bg-white sticky top-0 z-10">
              <span className="text-sm font-bold text-gray-500"><span className="text-secondary">{companies.length}</span> firma bulundu</span>
              <button className="p-1.5 bg-gray-100 text-secondary hover:bg-gray-200 hidden lg:block"><List size={16}/></button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 lg:pb-4 scroll-smooth">
              {companies.map((company) => {
                // Görsel Kaynağını Belirle (Boşsa Placeholder)
                const imgSrc = company.featuredImage?.node?.sourceUrl 
                  || (company.companyDetails?.coverImage ? company.companyDetails.coverImage : getPlaceholderImage(company.title));

                return (
                  <div 
                    key={company.id}
                    onMouseEnter={() => setActiveCompany(company.id)}
                    onMouseLeave={() => setActiveCompany(null)}
                    className={`group border transition-all duration-200 cursor-pointer flex flex-col gap-3 p-4 relative ${activeCompany === company.id ? 'border-primary shadow-md bg-orange-50/10' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                  >
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 border border-gray-100 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
                              <img src={imgSrc} alt={company.title} className="w-full h-full object-contain p-1" />
                           </div>
                           <div>
                              <Link href={`/firma/${company.slug}`}>
                                <h3 className="font-bold text-secondary text-sm leading-tight group-hover:text-primary transition-colors">{company.title}</h3>
                              </Link>
                              <span className="text-xs text-gray-500 block mt-0.5">{company.sectors?.nodes?.[0]?.name}</span>
                           </div>
                        </div>
                        {company.companyDetails?.isVerified && <span className="bg-green-50 text-green-700 p-1 rounded-sm"><CheckCircle size={14} /></span>}
                     </div>
                     <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                           <MapPin size={12} className="text-gray-400"/> {company.locations?.nodes?.[0]?.name || 'Konum Yok'}
                        </div>
                     </div>
                     <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                        <Link href={`/firma/${company.slug}`} className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-hover flex items-center justify-center">
                           <ArrowRight size={16} />
                        </Link>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* SAĞ: HARİTA (Simülasyon) */}
        <div className={`flex-1 bg-gray-200 relative h-full w-full transition-transform duration-300 absolute lg:relative ${showMapMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
           <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
                 {companies.slice(0, 10).map((company, index) => {
                    const top = 20 + (index * 8) + "%";
                    const left = 20 + (index * 10) + "%";
                    const isActive = activeCompany === company.id;
                    return (
                      <div 
                        key={company.id}
                        className={`absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-full group ${isActive ? 'z-50 scale-110' : 'z-10 hover:scale-110 hover:z-40'}`}
                        style={{ top, left }}
                        onMouseEnter={() => setActiveCompany(company.id)}
                        onMouseLeave={() => setActiveCompany(null)}
                      >
                         <div className={`relative flex flex-col items-center ${isActive ? 'text-primary' : 'text-secondary'}`}>
                            <MapPin size={48} fill={isActive ? "#ea580c" : "#111827"} className="drop-shadow-xl stroke-white stroke-2" />
                         </div>
                         <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white p-3 rounded shadow-xl border border-gray-100 w-48 text-center transition-all duration-200 pointer-events-none ${isActive ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
                            <div className="text-xs font-bold text-secondary truncate">{company.title}</div>
                            <div className="text-[9px] font-bold text-primary mt-1 uppercase tracking-wide">Profili İncele</div>
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* MOBİL BUTON */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50">
           <button onClick={() => setShowMapMobile(!showMapMobile)} className="bg-secondary text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors">
             {showMapMobile ? <><List size={16} /> Listeyi Göster</> : <><MapIcon size={16} /> Haritayı Göster</>}
           </button>
        </div>

      </div>
    </div>
  );
}