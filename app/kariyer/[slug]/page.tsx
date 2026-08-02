import Link from "next/link";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_JOB_DATA } from "@/lib/queries";
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Building2, 
  ChevronRight,
  GraduationCap,
  ArrowLeft
} from "lucide-react";

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data, hasError } = await queryWithFallback<any>({
    query: GET_JOB_DATA,
    variables: { slug }
  }, { job: null }, `job detail ${slug}`);

  const job = data?.job;

  if (!job) {
    return hasError ? (
      <FallbackUI
        title="İlan verisi yüklenemedi"
        message="Kariyer ilanı şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        actionLabel="İlanlara dön"
        href="/kariyer"
      />
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">İlan Bulunamadı</h1>
          <p className="text-gray-500 mb-4">Aradığınız iş ilanı yayından kaldırılmış olabilir.</p>
          <Link href="/kariyer" className="text-primary hover:underline font-bold flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  const details = job.jobDetails || {};
  const date = new Date(job.date).toLocaleDateString('tr-TR');
  const deadline = details.deadline ? new Date(details.deadline).toLocaleDateString('tr-TR') : 'Belirtilmedi';

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HEADER (İlan Özeti) */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
             <Link href="/" className="hover:text-primary transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/kariyer" className="hover:text-primary transition">Kariyer</Link>
             <ChevronRight size={12} />
             <span className="text-primary">İlan Detayı</span>
           </div>

           <div className="flex flex-col md:flex-row items-start gap-8">
             <div className="w-24 h-24 bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 p-4">
                <Briefcase className="text-gray-400" size={40} />
             </div>
             
             <div className="flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-2">
                 <span className="text-xs font-bold text-primary uppercase bg-orange-50 px-2 py-0.5 border border-orange-100">
                   {details.workType || 'Tam Zamanlı'}
                 </span>
                 <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                   <Clock size={12}/> {date} Yayınlandı
                 </span>
               </div>
               
               <h1 className="text-2xl md:text-4xl font-black text-secondary leading-tight mb-2">
                 {job.title}
               </h1>
               
               <div className="flex items-center gap-2 font-bold text-gray-600 w-fit mb-6">
                 <Building2 size={16} /> {details.companyName || 'Firma Adı Gizli'}
               </div>

               <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium border-t border-gray-100 pt-6">
                 <div className="flex items-center gap-2">
                   <MapPin size={16} className="text-gray-400"/> {details.location || 'Konum Belirtilmedi'}
                 </div>
                 <div className="flex items-center gap-2">
                   <Briefcase size={16} className="text-gray-400"/> {details.experience || 'Tecrübe Belirtilmedi'}
                 </div>
                 <div className="flex items-center gap-2">
                   <GraduationCap size={16} className="text-gray-400"/> {details.education || 'Eğitim Belirtilmedi'}
                 </div>
                 <div className="flex items-center gap-2">
                   <DollarSign size={16} className="text-gray-400"/> {details.salary || 'Gizli'}
                 </div>
               </div>
             </div>

             <div className="flex flex-col gap-3 min-w-[200px]">
                <Link 
                  href={`/kariyer/${job.slug}/basvur`}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-black uppercase tracking-widest text-sm shadow-lg text-center transition-transform hover:-translate-y-1"
                >
                  ŞİMDİ BAŞVUR
                </Link>
                <div className="flex gap-2">
                   <button className="flex-1 bg-white border border-gray-300 text-secondary py-2 font-bold uppercase text-xs hover:bg-gray-50">Kaydet</button>
                   <button className="flex-1 bg-white border border-gray-300 text-secondary py-2 font-bold uppercase text-xs hover:bg-gray-50">Paylaş</button>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 2. İÇERİK ve SIDEBAR */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: İlan Detayı */}
          <main className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white border border-gray-200 p-8 shadow-sm">
               <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                 İlan Detayları
               </h2>
               
               <div 
                 className="prose prose-sm max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-secondary prose-li:marker:text-primary prose-strong:text-secondary"
                 dangerouslySetInnerHTML={{ __html: job.content || '<p>Detay girilmemiştir.</p>' }}
               />
            </div>
          </main>

          {/* SAĞ: Özet ve Firma */}
          <aside className="w-full lg:w-1/3 space-y-6">
            
            {/* Özet Kartı (Sticky) */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm border-t-4 border-t-secondary sticky top-24">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4">İlan Özeti</h3>
               <ul className="space-y-4 text-sm mb-6">
                 <li className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500 font-medium">Çalışma Şekli</span>
                   <span className="font-bold text-secondary">{details.workType || '-'}</span>
                 </li>
                 <li className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500 font-medium">Deneyim</span>
                   <span className="font-bold text-secondary">{details.experience || '-'}</span>
                 </li>
                 <li className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500 font-medium">Son Başvuru</span>
                   <span className="font-bold text-red-600">{deadline}</span>
                 </li>
               </ul>
            </div>

            {/* Firma Kartı */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 border border-gray-200 p-1 flex items-center justify-center">
                    <Building2 className="text-gray-400" size={24}/>
                 </div>
                 <h3 className="font-bold text-secondary text-sm leading-tight">{details.companyName || 'Firma Adı Gizli'}</h3>
               </div>
               <Link href="#" className="block w-full text-center border border-gray-300 text-secondary py-2 text-xs font-bold uppercase hover:border-primary hover:text-primary transition-colors">
                 Tüm İlanları Gör
               </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}