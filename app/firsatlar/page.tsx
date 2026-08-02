import Link from "next/link";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_LEADS } from "@/lib/queries";
import { 
  Briefcase, 
  MapPin, 
  Filter, 
  Search, 
  Plus, 
  Tag, 
  Building2, 
  Send,
  Eye,
  Lock,
  ArrowRight,
  Clock,
  Calendar
} from "lucide-react";

export const revalidate = 60;

export default async function LeadsPage() {
  const { data } = await queryWithFallback<any>({ query: GET_LEADS }, { leads: { nodes: [] } }, "leads listing");
  const leads = data?.leads?.nodes || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO SECTION (Ticaret Odaklı) */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="container mx-auto relative z-10">
           <div className="flex flex-col md:flex-row items-end justify-between gap-6">
             <div>
               <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 bg-white/5 border border-white/10 px-3 py-1">
                 <Briefcase size={12} className="text-primary"/> B2B Ticaret Platformu
               </div>
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">
                 Ticari Fırsatlar
               </h1>
               <p className="text-gray-400 mt-4 text-lg max-w-2xl">
                 Sektörel satın alma taleplerine ulaşın, teklif verin veya kendi ihtiyacınızı yayınlayarak en iyi tedarikçileri bulun.
               </p>
             </div>
             
             {/* Talep Oluştur Butonu */}
             <div className="flex gap-4">
               <Link href="/firsatlar/olustur" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1">
                 <Plus size={18} /> Talep Oluştur
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
                 <span className="block text-2xl font-black text-secondary">{leads.length}</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Aktif Talep</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">85M TL</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Ticaret Hacmi</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">350</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Yeni Teklif</span>
              </div>
              <div className="text-center">
                 <span className="block text-2xl font-black text-secondary">12dk</span>
                 <span className="text-xs font-bold text-gray-400 uppercase">Ort. Dönüş Süresi</span>
              </div>
           </div>
        </div>
      </div>

      {/* 3. İÇERİK ALANI */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SOL: Sidebar (Filtreler) */}
          <aside className="w-full lg:w-1/4 space-y-6">
            
            {/* Arama */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4">Detaylı Arama</h3>
               <div className="relative mb-4">
                 <input type="text" placeholder="Talep ara..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary rounded-none" />
                 <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
               </div>
               <button className="w-full bg-secondary text-white py-3 font-bold uppercase text-xs hover:bg-black transition-colors">
                 Sonuçları Filtrele
               </button>
            </div>

            {/* İlan Tipi */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                 İlan Tipi
               </h3>
               <div className="space-y-2">
                 {[
                   { label: "Alım Talebi", val: "alim" },
                   { label: "Satış İlanı", val: "satis" },
                   { label: "Bayilik", val: "bayilik" },
                   { label: "İş Ortaklığı", val: "ortaklik" },
                   { label: "Hizmet Talebi", val: "hizmet" }
                 ].map((type, i) => (
                   <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="accent-primary w-4 h-4" value={type.val} />
                      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{type.label}</span>
                   </label>
                 ))}
               </div>
            </div>

          </aside>

          {/* SAĞ: İlan Listesi */}
          <main className="w-full lg:w-3/4 space-y-6">
            
            {/* Üst Sıralama Barı */}
            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 shadow-sm">
               <span className="text-sm font-bold text-gray-500">
                 <span className="text-secondary">{leads.length}</span> sonuç bulundu
               </span>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase">Sırala:</span>
                 <select className="bg-gray-50 border border-gray-200 py-1 px-2 text-sm focus:outline-none cursor-pointer">
                   <option>Yeniden Eskiye</option>
                   <option>Aciliyet Sırası</option>
                   <option>Bütçe (Yüksek-Düşük)</option>
                 </select>
               </div>
            </div>

            {/* LEAD LİSTESİ */}
            {leads.map((lead: any) => {
              const details = lead.leadDetails || {};
              const date = new Date(lead.date).toLocaleDateString('tr-TR');
              const expiry = details.expiryDate 
                ? new Date(details.expiryDate).toLocaleDateString('tr-TR')
                : 'Süresiz';
              
              // Tip Etiketi Rengi
              let typeColor = 'bg-gray-100 text-gray-600 border-gray-200';
              let typeLabel = details.leadType;
              if (details.leadType === 'alim') { typeColor = 'bg-green-50 text-green-700 border-green-200'; typeLabel = 'Alım Talebi'; }
              if (details.leadType === 'satis') { typeColor = 'bg-blue-50 text-blue-700 border-blue-200'; typeLabel = 'Satış İlanı'; }
              if (details.leadType === 'bayilik') { typeColor = 'bg-purple-50 text-purple-700 border-purple-200'; typeLabel = 'Bayilik'; }

              return (
                <div key={lead.id} className={`group bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 relative flex flex-col md:flex-row ${details.isPremium ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-gray-200'}`}>
                   
                   {/* Sol Bilgi Sütunu */}
                   <div className="p-6 flex-1">
                      {/* Üst Etiketler */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                         <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide border ${typeColor}`}>
                           {typeLabel}
                         </span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                           <Tag size={10} /> {lead.sectors?.nodes[0]?.name || 'Genel'}
                         </span>
                         {details.isPremium && (
                           <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 bg-orange-50 px-2 py-0.5">
                             <Eye size={10} /> Vitrin İlanı
                           </span>
                         )}
                      </div>

                      {/* Başlık (Linklendi) */}
                      <Link href={`/firsatlar/${lead.slug}`}>
                        <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors cursor-pointer">
                          {lead.title}
                        </h3>
                      </Link>
                      
                      {/* Detay Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-t border-gray-100 pt-4 mt-4">
                         <div>
                           <span className="block text-gray-400 font-bold uppercase mb-0.5">Lokasyon</span>
                           <span className="font-medium text-secondary flex items-center gap-1"><MapPin size={12}/> {details.deliveryLocation || 'Türkiye'}</span>
                         </div>
                         <div>
                           <span className="block text-gray-400 font-bold uppercase mb-0.5">Bütçe</span>
                           <span className="font-medium text-secondary">{details.budgetString || 'Teklif Usulü'}</span>
                         </div>
                         <div>
                           <span className="block text-gray-400 font-bold uppercase mb-0.5">Son Tarih</span>
                           <span className="font-bold text-primary">{expiry}</span>
                         </div>
                         <div>
                           <span className="block text-gray-400 font-bold uppercase mb-0.5">Yayın</span>
                           <span className="font-medium text-secondary">{date}</span>
                         </div>
                      </div>
                   </div>

                   {/* Sağ Aksiyon Sütunu */}
                   <div className="w-full md:w-56 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-center items-center gap-3">
                      {details.isHiddenName ? (
                        <div className="text-center mb-2">
                           <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                             <Lock size={20} />
                           </div>
                           <span className="text-xs font-bold text-gray-500 uppercase">Gizli Firma</span>
                        </div>
                      ) : (
                        <div className="text-center mb-2">
                           <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Firma</span>
                           <div className="font-bold text-secondary text-sm flex items-center justify-center gap-1">
                             <Building2 size={14} /> Firma Adı
                           </div>
                        </div>
                      )}

                      {/* Buton Linklendi */}
                      <Link 
                        href={`/firsatlar/${lead.slug}/teklif-ver`}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={14} /> Teklif Ver
                      </Link>
                      
                      <Link 
                        href={`/firsatlar/${lead.slug}`}
                        className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase hover:text-primary transition-colors"
                      >
                        <Eye size={12} /> {details.viewCount || 0} Görüntülenme
                      </Link>
                   </div>

                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex justify-center mt-12 pt-8">
               <button className="w-full md:w-auto px-8 py-3 border border-gray-300 text-secondary font-bold text-sm uppercase hover:bg-secondary hover:text-white transition-colors flex items-center justify-center gap-2">
                 Daha Fazla Fırsat Yükle <ArrowRight size={16} />
               </button>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}