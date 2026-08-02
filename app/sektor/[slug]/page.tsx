import Link from "next/link";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  Building2, 
  MapPin, 
  Filter, 
  ChevronRight, 
  Search, 
  Briefcase,
  SlidersHorizontal,
  ArrowRight,
  Layers
} from "lucide-react";
import * as LucideIcons from "lucide-react";

// 1. GraphQL Sorguları (Bu sayfa özelinde)
const GET_SECTOR_DATA = gql`
  query GetSectorData($slug: ID!) {
    # Sektör Detayları ve Bağlı Firmalar
    sector(id: $slug, idType: SLUG) {
      id
      name
      description
      count
      sectorDetails {
        icon
        iconName
        color
        featuredImage
      }
      children {
        nodes {
          id
          name
          slug
          count
        }
      }
      # DÜZELTME: Firmaları doğrudan sektörün altından çekiyoruz (Nested Query)
      companies(first: 50) {
        nodes {
          id
          title
          slug
          companyDetails {
            isVerified
            address
            coverImage
          }
          locations {
            nodes {
              name
            }
          }
          sectors {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Veriyi Çek
  const { data, hasError } = await queryWithFallback({
    query: GET_SECTOR_DATA,
    variables: { slug: slug } // Artık sectorSlug parametresine gerek yok
  }, { sector: null }, `sector detail ${slug}`);

  const sector = data?.sector;
  // Firmalar artık sektör objesinin içinde geliyor
  const companies = sector?.companies?.nodes || [];
  
  // Eğer sektör bulunamazsa 404 dönebilir veya boş state gösterebiliriz
  if (!sector) {
    return hasError ? (
      <FallbackUI
        title="Sektör verisi yüklenemedi"
        message="Sektör detayları şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        actionLabel="Sektörlere dön"
        href="/sektorler"
      />
    ) : (
      <div className="p-20 text-center">Sektör bulunamadı.</div>
    );
  }

  // Dinamik İkon
  const IconComponent = (LucideIcons as any)[sector.sectorDetails?.iconName] || Layers;
  const themeColor = sector.sectorDetails?.color || "#ea580c"; // Varsayılan turuncu

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      
      {/* 1. SECTOR HERO (Endüstriyel Başlık) */}
      <section className="bg-secondary text-white pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(45deg, #374151 25%, transparent 25%, transparent 50%, #374151 50%, #374151 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}>
        </div>
        
        {/* Dinamik Arkaplan Görseli (Varsa) */}
        {sector.sectorDetails?.featuredImage && (
           <div className="absolute inset-0 opacity-20">
              <img src={sector.sectorDetails.featuredImage} alt={sector.name} className="w-full h-full object-cover" />
           </div>
        )}
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div 
                className="p-5 text-white shadow-2xl border-4 border-white/10"
                style={{ backgroundColor: themeColor }}
              >
                <IconComponent size={48} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  <Link href="/sektorler" className="hover:text-white transition">Sektörler</Link>
                  <ChevronRight size={12} />
                  <span style={{ color: themeColor }}>{sector.name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{sector.name}</h1>
                <p className="text-gray-400 text-lg max-w-2xl">{sector.description || 'Bu sektördeki en güncel firmalar, iş ilanları ve fırsatlar.'}</p>
              </div>
            </div>
            
            {/* İstatistik Kutuları */}
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 p-4 min-w-[120px]">
                <div className="text-2xl font-bold text-white">{sector.count}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Firma</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 min-w-[120px]">
                <div className="text-2xl font-bold" style={{ color: themeColor }}>--</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">İlan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 2. SIDEBAR FILTERS (Sol Panel) */}
          <aside className="w-full lg:w-1/4 space-y-8">
            {/* Arama */}
            <div className="bg-white p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                Sektörde Ara
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Firma veya hizmet ara..." 
                  className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 text-sm focus:outline-none focus:border-primary transition-colors rounded-none"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
              </div>
            </div>

            {/* Alt Kategoriler */}
            {sector.children?.nodes?.length > 0 && (
              <div className="bg-white p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center justify-between">
                  Alt Kategoriler <Filter size={14} className="text-gray-400"/>
                </h3>
                <div className="space-y-2">
                  {sector.children.nodes.map((sub: any) => (
                    <Link href={`/sektor/${sub.slug}`} key={sub.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 transition-colors">
                      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{sub.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-white">{sub.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Lokasyon Filtresi */}
            <div className="bg-white p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                Lokasyon
              </h3>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary cursor-pointer mb-3 rounded-none">
                <option>Tüm Şehirler</option>
                <option>İstanbul</option>
                <option>Ankara</option>
                <option>İzmir</option>
              </select>
            </div>
          </aside>

          {/* 3. MAIN CONTENT (Firma Listesi) */}
          <main className="w-full lg:w-3/4">
            
            {/* Üst Filtre Barı */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 p-4 mb-6 shadow-sm">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                <span className="font-bold text-secondary">{companies.length}</span> firma listeleniyor
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Sırala:</span>
                  <select className="text-sm border-none bg-transparent font-medium text-secondary focus:ring-0 cursor-pointer">
                    <option>Önerilen</option>
                    <option>En Yeniler</option>
                    <option>Puanı Yüksek</option>
                  </select>
                </div>
                <div className="flex border-l border-gray-200 pl-4 gap-2 text-gray-400">
                  <button className="p-1 hover:text-primary transition-colors"><SlidersHorizontal size={18} /></button>
                </div>
              </div>
            </div>

            {/* Firma Listesi (Grid) */}
            <div className="grid grid-cols-1 gap-6">
              {companies.map((company: any) => (
                <div key={company.id} className="group bg-white border border-gray-200 p-0 flex flex-col md:flex-row hover:border-primary hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                   
                   {/* Sol Kenar Çizgisi (Hover Efekti) */}
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-primary transition-colors duration-300 z-10" style={{ '--tw-bg-opacity': 1, backgroundColor: 'transparent' }}>
                      <div className="h-full w-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>

                   {/* Logo Alanı */}
                   <div className="w-full md:w-48 bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100 group-hover:bg-white transition-colors">
                     <img 
                        src={company.companyDetails?.coverImage || `https://placehold.co/200x200?text=${company.title.substring(0,2)}`} 
                        alt={company.title} 
                        className="max-w-full h-auto max-h-24 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                   </div>

                   {/* İçerik Alanı */}
                   <div className="flex-1 p-6 flex flex-col justify-between">
                     <div className="flex items-start justify-between mb-2">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h2 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">{company.title}</h2>
                           {company.companyDetails?.isVerified && (
                             <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 uppercase border border-green-200">Onaylı</span>
                           )}
                         </div>
                         <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                           <span className="flex items-center gap-1"><MapPin size={12}/> {company.locations?.nodes[0]?.name || 'İstanbul'}</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <span>{company.sectors?.nodes[0]?.name}</span>
                         </div>
                       </div>
                     </div>

                     <div className="text-sm text-gray-600 line-clamp-2 mt-3 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: company.companyDetails?.address || '' }}></div>

                     <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 uppercase font-bold">Üretici</span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 uppercase font-bold">Toptancı</span>
                        </div>
                        <Link href={`/firma/${company.slug}`} className="flex items-center text-xs font-bold text-secondary group-hover:text-primary uppercase tracking-wider transition-colors">
                          Firma Detayı <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Pagination (Basit) */}
            <div className="flex justify-center mt-12 gap-2">
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-colors font-bold text-sm">1</button>
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-colors font-bold text-sm">2</button>
              <span className="flex items-end px-2 text-gray-400">...</span>
              <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-colors font-bold text-sm"><ChevronRight size={16}/></button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}