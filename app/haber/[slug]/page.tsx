import Link from "next/link";
import { getClient } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  Tag, 
  ChevronRight,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  Building2,
  MapPin
} from "lucide-react";

// GraphQL Sorgusu
const GET_POST_DATA = gql`
  query GetPostData($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
    # Sidebar için son haberler (Bu haber hariç tutulabilir ama basitlik için son 4'ü çekiyoruz)
    posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Veriyi Çek
  const { data } = await getClient().query<any>({
    query: GET_POST_DATA,
    variables: { slug }
  });

  const post = data?.post;
  // Sidebar için mevcut haberi filtreleyerek diğerlerini alalım
  const relatedPosts = data?.posts?.nodes.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Haber Bulunamadı</h1>
          <p className="text-gray-500 mb-4">Aradığınız haber yayından kaldırılmış veya taşınmış olabilir.</p>
          <Link href="/haberler" className="text-primary hover:underline font-bold flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> Haberlere Dön
          </Link>
        </div>
      </div>
    );
  }

  // Tarih ve Okuma Süresi
  const publishDate = new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Basit okuma süresi hesabı (HTML etiketlerini temizlemeden kaba bir tahmin)
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200); // Ortalama 200 kelime/dakika

  // Kategori (İlk kategori)
  const category = post.categories?.nodes[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. BREADCRUMB & HEADER */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-primary transition">Anasayfa</Link>
            <ChevronRight size={12} />
            <Link href="/haberler" className="hover:text-primary transition">Haberler</Link>
            <ChevronRight size={12} />
            {category ? (
              <Link href={`/haberler/kategori/${category.slug}`} className="text-primary">{category.name}</Link>
            ) : (
              <span className="text-primary">Detay</span>
            )}
          </div>

          {/* Başlık Alanı */}
          <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Bilgiler */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-b border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary"/>
              <span className="font-bold text-secondary">{post.author?.node?.name || 'Editör'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16}/>
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16}/>
              <span>{readTime} dk okuma</span>
            </div>
            <div className="flex items-center gap-2 ml-auto text-primary cursor-pointer hover:underline">
               <MessageSquare size={16}/>
               <span className="font-bold">Yorum Yap</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GÖRSEL & İÇERİK */}
      <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        <div className="bg-white border border-gray-200 shadow-sm p-1">
           <img 
             src={post.featuredImage?.node?.sourceUrl || `https://placehold.co/1200x600/111827/FFF?text=${encodeURIComponent(post.title)}`} 
             alt={post.title} 
             className="w-full h-auto object-cover max-h-[500px]" 
           />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Paylaşım Barı (Sticky) */}
          <aside className="hidden lg:flex flex-col gap-4 w-12 sticky top-32 h-fit">
            <span className="text-[10px] font-bold text-gray-400 uppercase rotate-90 origin-left translate-x-4 mb-8 whitespace-nowrap">Paylaş</span>
            <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors bg-white rounded-full">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors bg-white rounded-full">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors bg-white rounded-full">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-colors bg-white rounded-full">
              <Copy size={18} />
            </button>
          </aside>

          {/* ORTA: Makale İçeriği */}
          <article className="flex-1 max-w-3xl">
            {/* Excerpt (Özet) - HTML varsa temizle */}
            {post.excerpt && (
              <div 
                className="text-xl md:text-2xl font-serif text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}

            {/* İçerik (HTML render) */}
            <div 
              className="prose prose-lg prose-gray max-w-none 
              prose-headings:font-black prose-headings:text-secondary prose-headings:uppercase prose-headings:tracking-tight
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-li:marker:text-primary
              prose-img:rounded-none prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {/* Etiketler */}
            {post.tags?.nodes?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.nodes.map((tag: any, i: number) => (
                    <Link key={i} href={`/haberler/etiket/${tag.slug}`} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-colors">
                      <Tag size={12} /> {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Yazar Kutusu (Opsiyonel) */}
            <div className="mt-12 bg-gray-50 p-6 border-l-4 border-secondary flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0">
                <img 
                  src={post.author?.node?.avatar?.url || "https://placehold.co/100x100/333/FFF?text=A"} 
                  alt={post.author?.node?.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm uppercase mb-1">{post.author?.node?.name || 'Editör'}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sektörel Ajanda editörleri tarafından hazırlanmıştır. Güncel mevzuat ve piyasa analizleri için takipte kalın.
                </p>
                <button className="text-primary text-xs font-bold mt-2 hover:underline">Tüm Yazılarını Gör</button>
              </div>
            </div>
          </article>

          {/* SAĞ: Sidebar (İlgili Haberler) */}
          <aside className="w-full lg:w-1/4 space-y-8">
            
            {/* İlgili Haberler */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-32">
              <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary"/> İlgili Haberler
              </h3>
              <div className="space-y-6">
                {relatedPosts.map((news: any) => (
                  <Link key={news.id} href={`/haber/${news.slug}`} className="group block">
                    <div className="aspect-video bg-gray-100 mb-2 overflow-hidden border border-gray-100">
                      <img 
                        src={news.featuredImage?.node?.sourceUrl || `https://placehold.co/400x300/e5e7eb/333?text=${encodeURIComponent(news.title)}`} 
                        alt={news.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-1">
                      <Calendar size={10} /> {new Date(news.date).toLocaleDateString('tr-TR')}
                    </div>
                    <h4 className="font-bold text-sm text-secondary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h4>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-black text-secondary uppercase mb-3">Bültene Abone Ol</h3>
                <p className="text-[10px] text-gray-500 mb-3">Benzer mevzuat haberleri e-postana gelsin.</p>
                <div className="flex">
                  <input type="email" placeholder="E-posta" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-primary" />
                  <button className="bg-secondary text-white px-3 py-2 text-xs font-bold hover:bg-black">→</button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}