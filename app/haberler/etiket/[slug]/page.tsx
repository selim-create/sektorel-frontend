import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Tag, 
  Share2, 
  Home, 
  Hash 
} from "lucide-react";

// MOCK DATA
const NEWS = [
  {
    id: 1,
    title: "İhracatçılara Yeşil Pasaport Müjdesi: Limitler Düşürüldü",
    excerpt: "Ticaret Bakanlığı tarafından yapılan son dakika açıklamasına göre, ihracatçılar için yeşil pasaport limiti 500 bin dolara çekildi.",
    category: "MEVZUAT",
    date: "28 Ocak 2026",
    readTime: "4 dk",
    image: "https://placehold.co/800x600/111827/FFF?text=Ihracat+Haberi",
  },
  {
    id: 2,
    title: "Otomotiv Yan Sanayisinde Dev Yatırım Hamlesi",
    excerpt: "Bursa merkezli otomotiv devi, yeni elektrikli araç batarya tesisi için düğmeye bastı.",
    category: "YATIRIM",
    date: "27 Ocak 2026",
    readTime: "3 dk",
    image: "https://placehold.co/600x400/ea580c/FFF?text=Otomotiv",
  },
  // ...
];

// DEĞİŞİKLİK: params Promise olarak tanımlandı ve bileşen async yapıldı
export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tagSlug = resolvedParams.slug;
  const tagName = `#${tagSlug.toUpperCase()}`;
  
  // Etikete göre filtreleme simülasyonu
  const displayNews = NEWS; // Demo: Hepsi gösteriliyor

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. ETİKET HERO ALANI (Daha Açık/Modern Tema) */}
      <section className="bg-white text-secondary py-16 px-4 border-b border-gray-200 relative overflow-hidden">
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 50%, #f3f4f6 50%, #f3f4f6 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}>
        </div>
        
        <div className="container mx-auto relative z-10 text-center">
           <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 bg-gray-100 px-3 py-1 rounded-full">
             <Tag size={12} /> Etiket Arşivi
           </div>

           <h1 className="text-4xl md:text-6xl font-black tracking-tight text-secondary mb-4">
             <span className="text-primary">#</span>{tagSlug}
           </h1>
           <p className="text-gray-500 text-lg max-w-xl mx-auto">
             {tagName} etiketiyle yayınlanan toplam <span className="font-bold text-primary">{displayNews.length}</span> haber listeleniyor.
           </p>
        </div>
      </section>

      {/* 2. İÇERİK */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
         <div className="space-y-8">
             {displayNews.map((news) => (
                <article key={news.id} className="group flex flex-col md:flex-row gap-6 bg-white p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                   <div className="w-full md:w-56 h-40 bg-gray-100 shrink-0 overflow-hidden relative">
                     <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   
                   <div className="flex flex-col justify-between py-1 flex-1">
                     <div>
                       <div className="flex items-center gap-3 text-xs text-gray-400 font-mono uppercase mb-2">
                         <span className="text-primary font-bold">{news.category}</span>
                         <span>•</span>
                         <span className="flex items-center gap-1"><Calendar size={12}/> {news.date}</span>
                       </div>
                       <Link href={`/haber/${news.id}`}>
                         <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors leading-tight">
                           {news.title}
                         </h3>
                       </Link>
                       <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                         {news.excerpt}
                       </p>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end">
                       <Link href={`/haber/${news.id}`} className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1 group-hover:text-primary transition-colors">
                         Devamını Oku <ChevronRight size={14} />
                       </Link>
                     </div>
                   </div>
                </article>
              ))}
         </div>
      </div>
    </div>
  );
}