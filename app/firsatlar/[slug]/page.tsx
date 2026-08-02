import Link from "next/link";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Tag, 
  Building2, 
  Send, 
  Eye, 
  Lock, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Download
} from "lucide-react";

// GraphQL Sorgusu
const GET_LEAD_DATA = gql`
  query GetLeadData($slug: ID!) {
    lead(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content # Detaylı Açıklama / Şartname
      leadDetails {
        leadType
        status
        budgetString
        expiryDate
        deliveryLocation
        attachment
        isPremium
        isHiddenName
        viewCount
        offerCount
      }
      sectors {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export default async function LeadDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Veriyi Çek
  const { data, hasError } = await queryWithFallback({
    query: GET_LEAD_DATA,
    variables: { slug }
  }, { lead: null }, `lead detail ${slug}`);

  const lead = data?.lead;

  if (!lead) {
    return hasError ? (
      <FallbackUI
        title="İlan verisi yüklenemedi"
        message="İlan detayları şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        actionLabel="Fırsatlara dön"
        href="/firsatlar"
      />
    ) : (
      <div className="p-20 text-center">İlan bulunamadı.</div>
    );
  }

  const details = lead.leadDetails || {};
  const sectorName = lead.sectors?.nodes[0]?.name || "Genel";
  
  // Tarih Hesaplamaları
  const publishDate = new Date(lead.date).toLocaleDateString('tr-TR');
  const expiryDate = details.expiryDate ? new Date(details.expiryDate) : null;
  const expiryString = expiryDate ? expiryDate.toLocaleDateString('tr-TR') : 'Süresiz';
  
  // Kalan Gün
  let daysLeft = 'Süresiz';
  if (expiryDate) {
    const diffTime = Math.abs(expiryDate.getTime() - new Date().getTime());
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " Gün Kaldı";
  }

  // Tip Etiketi
  let typeLabel = "Alım Talebi";
  if (details.leadType === 'satis') typeLabel = 'Satış İlanı';
  if (details.leadType === 'bayilik') typeLabel = 'Bayilik';
  if (details.leadType === 'hizmet') typeLabel = 'Hizmet Talebi';

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HEADER (Fırsat Özeti) */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
             <Link href="/" className="hover:text-primary transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/firsatlar" className="hover:text-primary transition">Fırsatlar</Link>
             <ChevronRight size={12} />
             <span className="text-primary">Detay</span>
           </div>

           <div className="flex flex-col md:flex-row items-start justify-between gap-8">
             <div className="flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-4">
                 <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 uppercase tracking-wide">
                   {typeLabel}
                 </span>
                 <span className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold px-3 py-1 uppercase tracking-wide flex items-center gap-1">
                   <Tag size={12}/> {sectorName}
                 </span>
                 <span className="bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold px-3 py-1 uppercase tracking-wide flex items-center gap-1">
                   <Clock size={12}/> {daysLeft}
                 </span>
               </div>
               <h1 className="text-2xl md:text-4xl font-black text-secondary leading-tight mb-4">
                 {lead.title}
               </h1>
               <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                 <div className="flex items-center gap-2">
                   <MapPin size={16} className="text-gray-400"/> {details.deliveryLocation || 'Konum Belirtilmedi'}
                 </div>
                 <div className="flex items-center gap-2">
                   <DollarSign size={16} className="text-gray-400"/> {details.budgetString || 'Teklif Usulü'}
                 </div>
                 <div className="flex items-center gap-2">
                   <Calendar size={16} className="text-gray-400"/> Yayın: {publishDate}
                 </div>
               </div>
             </div>

             <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="text-center p-4 bg-gray-50 border border-gray-200">
                   <span className="block text-3xl font-black text-secondary">{details.offerCount || 0}</span>
                   <span className="text-xs font-bold text-gray-400 uppercase">Gelen Teklif</span>
                </div>
                <div className="text-center p-2">
                   <span className="text-xs font-bold text-gray-400 uppercase flex items-center justify-center gap-1">
                     <Eye size={12}/> {details.viewCount || 0} Görüntülenme
                   </span>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 2. İÇERİK ve SIDEBAR */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Detaylar */}
          <main className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white border border-gray-200 p-8 shadow-sm">
               <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                 <FileText className="text-primary" size={20} /> İlan Detayları ve Şartname
               </h2>
               
               <div 
                 className="prose prose-sm max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-secondary prose-li:marker:text-primary"
                 dangerouslySetInnerHTML={{ __html: lead.content || '<p>Ek açıklama girilmemiştir.</p>' }}
               />

               {details.attachment && (
                 <div className="mt-6">
                    <a href={details.attachment} target="_blank" className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-3 text-sm font-bold text-secondary hover:bg-gray-200 transition-colors">
                       <Download size={16} /> Dosya Ekini İndir
                    </a>
                 </div>
               )}

               <div className="mt-8 pt-6 border-t border-gray-100 bg-blue-50 p-4 border-l-4 border-l-blue-500">
                 <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                   <AlertTriangle size={16}/> Dikkat Edilecek Hususlar
                 </h4>
                 <ul className="text-xs text-blue-900/80 list-disc list-inside space-y-1">
                   <li>Tekliflerin KDV hariç verilmesi gerekmektedir.</li>
                   <li>Nakliye dahil/hariç durumu açıkça belirtilmelidir.</li>
                   <li>Numune göndermeyen firmaların teklifleri değerlendirilmeyecektir.</li>
                 </ul>
               </div>
            </div>
          </main>

          {/* SAĞ: Firma ve Aksiyon */}
          <aside className="w-full lg:w-1/3 space-y-6">
            
            {/* Teklif Verme Kartı (Sticky) */}
            <div className="bg-white border border-gray-200 p-6 shadow-lg border-t-4 border-t-primary sticky top-24">
               <div className="text-center mb-6">
                 <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Kalan Süre</span>
                 <span className="text-2xl font-black text-primary">{daysLeft}</span>
                 <p className="text-xs text-gray-400 mt-1">Son Teklif: {expiryString}</p>
               </div>

               <Link 
                 href={`/firsatlar/${slug}/teklif-ver`} 
                 className="block w-full bg-primary hover:bg-primary-hover text-white py-4 font-black uppercase tracking-widest text-sm shadow-md transition-all text-center mb-3"
               >
                 HEMEN TEKLİF VER
               </Link>
               
               <button className="block w-full bg-white border border-gray-300 text-secondary hover:bg-gray-50 py-3 font-bold uppercase tracking-wide text-xs transition-colors">
                 Soru Sor / Mesaj At
               </button>

               <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                 <p className="text-[10px] text-gray-400 leading-tight">
                   Bu ilana teklif vererek <a href="#" className="underline">Hizmet Şartları</a>'nı kabul etmiş olursunuz.
                 </p>
               </div>
            </div>

            {/* Alıcı Firma Bilgisi */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">İlan Sahibi</h3>
               
               {details.isHiddenName ? (
                 <div className="text-center py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Lock className="text-gray-400" size={24} />
                    </div>
                    <span className="font-bold text-secondary block">Gizli Firma</span>
                    <span className="text-xs text-gray-500">Firma ismi gizlenmiştir.</span>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-14 h-14 bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <Building2 className="text-gray-400" size={24} />
                     </div>
                     <div>
                        {/* Gerçek veride Author veya Company ilişkisi olacak */}
                        <h4 className="font-bold text-secondary text-sm">Firma Adı</h4>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 mt-1 w-fit">
                          <CheckCircle size={10}/> Doğrulanmış Firma
                        </span>
                     </div>
                   </div>

                   {/* Güven Skoru */}
                   <div className="mt-4 bg-gray-50 p-3 flex items-center justify-between border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <ShieldCheck size={14} className="text-primary"/> Güven Skoru
                      </span>
                      <span className="text-sm font-black text-secondary">9.8/10</span>
                   </div>
                 </>
               )}
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}