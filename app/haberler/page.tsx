import Link from "next/link";
import { queryWithFallback } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  Mail, 
  Tag, 
  Share2, 
  Eye
} from "lucide-react";

// GraphQL Sorgusu: Haberler ve Kategoriler
const GET_NEWS_PAGE_DATA = gql`
  query GetNewsPageData {
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
    categories(first: 10, where: { orderby: COUNT, order: DESC, hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export const revalidate = 60;

export default async function NewsPage() {
  const { data } = await queryWithFallback<any>(
    { query: GET_NEWS_PAGE_DATA },
    { posts: { nodes: [] }, categories: { nodes: [] } },
    "news listing",
  );
  
  const posts = data?.posts?.nodes || [];
  const categories = data?.categories?.nodes || [];

  // İlk 3 haberi manşet yapalım
  const featuredNews = posts.slice(0, 3);
  const regularNews = posts.slice(3);

  // Tarih formatlayıcı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Okuma süresi hesaplayıcı (Basit)
  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dk`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO & MANŞET ALANI */}
      <section className="bg-secondary text-white pt-12 pb-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
             <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
               <TrendingUp className="text-primary" /> Sektörel Gündem
             </h1>
             <div className="hidden md:flex items-center bg-white/5 border border-white/10 px-4 py-2">
               <span className="text-xs font-bold text-gray-400 mr-2 uppercase">Bugün:</span>
               <span className="text-sm font-medium">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
             </div>
          </div>

          {/* Manşet Grid (1 Büyük + 2 Küçük) */}
          {featuredNews.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:h-[500px]">
              
              {/* Büyük Manşet (Solda - İlk Haber) */}
              <div className="lg:w-2/3 h-[400px] lg:h-full">
                <Link href={`/haber/${featuredNews[0].slug}`} className="relative block w-full h-full group overflow-hidden border border-gray-700 bg-gray-800">
                  <img 
                    src={featuredNews[0].featuredImage?.node?.sourceUrl || `https://placehold.co/800x600/111827/FFF?text=${encodeURIComponent(featuredNews[0].title)}`}
                    alt={featuredNews[0].title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    {featuredNews[0].categories?.nodes[0] && (
                      <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider mb-3">
                        {featuredNews[0].categories.nodes[0].name}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {featuredNews[0].title}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-mono uppercase">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(featuredNews[0].date)}</span>
                      {/* <span className="flex items-center gap-1"><Clock size={12}/> 4 dk Okuma</span> */}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Yan Manşetler (Sağda Alt Alta - 2. ve 3. Haber) */}
              <div className="lg:w-1/3 flex flex-col gap-6 h-full">
                 {featuredNews.slice(1, 3).map((news: any) => (
                   <Link key={news.id} href={`/haber/${news.slug}`} className="relative block flex-1 group overflow-hidden border border-gray-700 bg-gray-800 h-[250px] lg:h-auto">
                      <img 
                        src={news.featuredImage?.node?.sourceUrl || `https://placehold.co/600x400/111827/FFF?text=${encodeURIComponent(news.title)}`}
                        alt={news.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        {news.categories?.nodes[0] && (
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider mb-2 border border-white/10">
                            {news.categories.nodes[0].name}
                          </span>
                        )}
                        <h2 className="text-lg md:text-xl font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {news.title}
                        </h2>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono uppercase">
                          <span className="flex items-center gap-1"><Calendar size={10}/> {formatDate(news.date)}</span>
                        </div>
                      </div>
                   </Link>
                 ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. ANA İÇERİK & SIDEBAR */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Haber Akışı */}
          <div className="w-full lg:w-3/4">
            
            {/* Filtre Barı (Statik - İleride işlevselleştirilebilir) */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 pb-4">
               <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider border bg-secondary text-white border-secondary cursor-default">
                 Son Eklenenler
               </span>
               <div className="ml-auto relative hidden md:block">
                 <input type="text" placeholder="Haberlerde ara..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-primary w-48" />
                 <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
               </div>
            </div>

            {/* Liste */}
            <div className="space-y-8">
              {regularNews.map((news: any) => {
                // Excerpt (Özet) temizleme
                const rawExcerpt = news.excerpt || '';
                const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

                return (
                  <article key={news.id} className="group flex flex-col md:flex-row gap-6 bg-white p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                     {/* Resim */}
                     <div className="w-full md:w-64 h-48 bg-gray-100 shrink-0 overflow-hidden relative">
                       <img 
                         src={news.featuredImage?.node?.sourceUrl || `https://placehold.co/600x400/e5e7eb/9ca3af?text=${encodeURIComponent(news.title)}`}
                         alt={news.title} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                       />
                       {news.categories?.nodes[0] && (
                         <div className="absolute top-0 left-0 bg-secondary text-white text-[10px] font-bold px-2 py-1 uppercase">
                           {news.categories.nodes[0].name}
                         </div>
                       )}
                     </div>
                     
                     {/* İçerik */}
                     <div className="flex flex-col justify-between py-1 flex-1">
                       <div>
                         <div className="flex items-center gap-3 text-xs text-gray-400 font-mono uppercase mb-2">
                           <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(news.date)}</span>
                           <span className="flex items-center gap-1"><Clock size={12}/> {calculateReadTime(cleanExcerpt)} okuma</span>
                         </div>
                         <Link href={`/haber/${news.slug}`}>
                           <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                             {news.title}
                           </h3>
                         </Link>
                         <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                           {cleanExcerpt}
                         </p>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                         <Link href={`/haber/${news.slug}`} className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1 group-hover:text-primary transition-colors">
                           Haberi Oku <ChevronRight size={14} />
                         </Link>
                         <button className="text-gray-400 hover:text-secondary"><Share2 size={16}/></button>
                       </div>
                     </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
               <button className="px-6 py-3 border border-gray-300 text-sm font-bold uppercase hover:bg-secondary hover:text-white transition-colors">Daha Fazla Göster</button>
            </div>
          </div>

          {/* SAĞ: Sidebar */}
          <aside className="w-full lg:w-1/4 space-y-8">
            
            {/* E-Bülten Aboneliği */}
            <div className="bg-primary text-white p-6 text-center">
              <Mail size={32} className="mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Gündemi Kaçırma</h3>
              <p className="text-xs text-orange-100 mb-4 leading-relaxed">
                Haftalık sektörel özetler ve teşvik duyuruları e-postana gelsin.
              </p>
              <form className="space-y-2">
                <input type="email" placeholder="E-posta adresiniz" className="w-full px-4 py-3 text-sm text-secondary focus:outline-none" />
                <button className="w-full bg-secondary text-white py-3 text-sm font-bold uppercase hover:bg-black transition-colors">
                  Abone Ol
                </button>
              </form>
            </div>

            {/* Kategoriler */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 flex items-center justify-between">
                 Kategoriler <TrendingUp size={16} className="text-primary"/>
               </h3>
               <ul className="space-y-2">
                 {categories.map((cat: any) => (
                   <li key={cat.id}>
                     <Link href={`/haberler/kategori/${cat.slug}`} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 transition-colors">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{cat.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-white">{cat.count}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Etiket Bulutu (Statik Şimdilik) */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 flex items-center justify-between">
                 Popüler Etiketler <Tag size={16} className="text-gray-400"/>
               </h3>
               <div className="flex flex-wrap gap-2">
                 {["İhracat", "KOBİ", "Vergi", "Teşvik", "Teknoloji", "Fuar", "İstihdam", "Enerji"].map((tag, i) => (
                   <span key={i} className="text-xs border border-gray-200 px-2 py-1 text-gray-500 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                     #{tag}
                   </span>
                 ))}
               </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}