import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  Mail, 
  Tag, 
  Share2, 
  Eye, 
  Home, 
  Layers 
} from "lucide-react";

// MOCK DATA (Simülasyon)
const NEWS = [
  {
    id: 1,
    title: "İhracatçılara Yeşil Pasaport Müjdesi: Limitler Düşürüldü",
    excerpt: "Ticaret Bakanlığı tarafından yapılan son dakika açıklamasına göre, ihracatçılar için yeşil pasaport limiti 500 bin dolara çekildi.",
    category: "MEVZUAT",
    slug: "mevzuat",
    date: "28 Ocak 2026",
    readTime: "4 dk",
    image: "https://placehold.co/800x600/111827/FFF?text=Ihracat+Haberi",
  },
  {
    id: 4,
    title: "KOBİ'lere Dijital Dönüşüm Desteği Paketi Açıklandı",
    excerpt: "Sanayi ve Teknoloji Bakanlığı, KOBİ'lerin dijitalleşmesi için 1 Milyon TL'ye varan hibe desteğini duyurdu.",
    category: "MEVZUAT",
    slug: "mevzuat",
    date: "25 Ocak 2026",
    readTime: "5 dk",
    image: "https://placehold.co/600x400/e5e7eb/333?text=KOBI+Destek",
  },
  // ... diğer haberler
];

// DEĞİŞİKLİK: params Promise olarak tanımlandı ve bileşen async yapıldı
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  const categoryName = categorySlug.toUpperCase(); // Örn: MEVZUAT
  
  // Kategoriye göre filtreleme (Mock)
  const categoryNews = NEWS.filter(n => n.slug === categorySlug || categorySlug === 'tum-haberler');
  const displayNews = categoryNews.length > 0 ? categoryNews : NEWS;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. KATEGORİ HERO ALANI (Endüstriyel Koyu Tema) */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="container mx-auto relative z-10">
           {/* Breadcrumb */}
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/" className="hover:text-white flex items-center gap-1"><Home size={12}/> Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/haberler" className="hover:text-white">Haberler</Link>
             <ChevronRight size={12} />
             <span className="text-primary">{categoryName}</span>
           </div>

           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">
             <Layers className="text-primary" size={48} /> {categoryName}
           </h1>
           <p className="text-gray-400 mt-4 text-lg max-w-2xl">
             {categoryName} kategorisindeki en güncel sektörel gelişmeler, analizler ve raporlar.
           </p>
        </div>
      </section>

      {/* 2. İÇERİK ALANI */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Haber Listesi */}
          <main className="w-full lg:w-3/4 space-y-8">
             {displayNews.map((news) => (
                <article key={news.id} className="group flex flex-col md:flex-row gap-6 bg-white p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                   <div className="w-full md:w-64 h-48 bg-gray-100 shrink-0 overflow-hidden relative">
                     <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-0 left-0 bg-secondary text-white text-[10px] font-bold px-2 py-1 uppercase">
                       {news.category}
                     </div>
                   </div>
                   
                   <div className="flex flex-col justify-between py-1">
                     <div>
                       <div className="flex items-center gap-3 text-xs text-gray-400 font-mono uppercase mb-2">
                         <span className="flex items-center gap-1"><Calendar size={12}/> {news.date}</span>
                         <span className="flex items-center gap-1"><Clock size={12}/> {news.readTime}</span>
                       </div>
                       <Link href={`/haber/${news.id}`}>
                         <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                           {news.title}
                         </h3>
                       </Link>
                       <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                         {news.excerpt}
                       </p>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                       <Link href={`/haber/${news.id}`} className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1 group-hover:text-primary transition-colors">
                         Haberi Oku <ChevronRight size={14} />
                       </Link>
                       <button className="text-gray-400 hover:text-secondary"><Share2 size={16}/></button>
                     </div>
                   </div>
                </article>
              ))}

              {/* Pagination */}
              <div className="flex justify-center mt-12 border-t border-gray-200 pt-8">
                 <div className="flex gap-2">
                   <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white font-bold text-sm bg-secondary text-white">1</button>
                   <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white font-bold text-sm">2</button>
                   <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-secondary hover:text-white font-bold text-sm"><ChevronRight size={16}/></button>
                 </div>
              </div>
          </main>

          {/* SAĞ: Sidebar (Aynı Yapı) */}
          <aside className="w-full lg:w-1/4 space-y-8">
            {/* Kategori Listesi */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                 Diğer Kategoriler
               </h3>
               <ul className="space-y-2">
                 {["Mevzuat", "Yatırım", "Firma Haberleri", "Etkinlikler", "Röportaj", "Teknoloji"].map((cat, i) => (
                   <li key={i}>
                     <Link href={`/haberler/kategori/${cat.toLowerCase()}`} className="flex items-center justify-between text-sm text-gray-600 hover:text-primary hover:pl-1 transition-all">
                       <span>{cat}</span>
                       <ChevronRight size={14} className="text-gray-300" />
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>
            
            {/* E-Bülten */}
            <div className="bg-primary text-white p-6 text-center">
              <Mail size={32} className="mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Gündemi Kaçırma</h3>
              <p className="text-xs text-orange-100 mb-4 leading-relaxed">
                {categoryName} ile ilgili en son gelişmeler e-postana gelsin.
              </p>
              <form className="space-y-2">
                <input type="email" placeholder="E-posta adresiniz" className="w-full px-4 py-3 text-sm text-secondary focus:outline-none" />
                <button className="w-full bg-secondary text-white py-3 text-sm font-bold uppercase hover:bg-black transition-colors">
                  Abone Ol
                </button>
              </form>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}