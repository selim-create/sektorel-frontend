import Link from "next/link";
import FallbackUI from "@/components/error/FallbackUI";
import { queryWithFallback } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  CheckCircle, 
  Building2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Share2,
  Calendar,
  Download,
  Star,
  Send,
  Newspaper,
  Box,
  Truck,
  Briefcase
} from "lucide-react";
import * as LucideIcons from "lucide-react";

// 1. GraphQL Sorgusu
const GET_COMPANY_DATA = gql`
  query GetCompanyData($slug: ID!) {
    company(id: $slug, idType: SLUG) {
      id
      title
      slug
      content # Hakkımızda yazısı
      companyDetails {
        # İletişim
        isVerified
        email
        phone
        website
        address
        postalCode
        mapLat
        mapLng
        
        # Kurumsal
        foundationYear
        employeeCount
        taxOffice
        tradeRegistryNumber
        activityCertificate
        
        # Medya
        coverImage
        galleryUrls
        
        # Sosyal Medya
        social {
          linkedin
          facebook
          twitter
          instagram
        }
        
        # Repeater Alanlar
        workingHours {
          days
          time
        }
        services {
          icon
          title
          desc
        }
        
        # İlişkili Haberler
        relatedNews {
          id
          title
          date
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
      # Taksonomiler
      sectors {
        nodes {
          name
          slug
        }
      }
      locations {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Veriyi Çek
  const { data, hasError } = await queryWithFallback({
    query: GET_COMPANY_DATA,
    variables: { slug }
  }, { company: null }, `company detail ${slug}`);

  const company = data?.company;

  if (!company) {
    return hasError ? (
      <FallbackUI
        title="Firma verisi yüklenemedi"
        message="Firma detayları şu anda alınamıyor. Lütfen daha sonra tekrar deneyin."
        actionLabel="Firma rehberine dön"
        href="/firmalar"
      />
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Firma Bulunamadı</h1>
          <p className="text-gray-500 mb-4">Aradığınız firma sistemde mevcut değil veya yayından kaldırılmış.</p>
          <Link href="/firmalar" className="text-primary hover:underline font-bold">Firma Rehberine Dön</Link>
        </div>
      </div>
    );
  }

  const details = company.companyDetails || {};
  const sectorName = company.sectors?.nodes[0]?.name || "Genel";
  const locationName = company.locations?.nodes[0]?.name || "Türkiye";
  
  // Logo: Featured Image yoksa placeholder kullan
  const logoUrl = company.featuredImage?.node?.sourceUrl || `https://placehold.co/200x200?text=${company.title.substring(0,2)}`;
  
  // Kapak: ACF'den gelen yoksa placeholder
  const coverUrl = details.coverImage || `https://placehold.co/1200x400/111827/FFF?text=${company.title}`;

  // Galeri URL'lerini parse et (Textarea'dan satır satır geliyor)
  const galleryImages = details.galleryUrls ? details.galleryUrls.split('\n').filter((url: string) => url.trim() !== '') : [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans scroll-smooth">
      
      {/* 1. HEADER / KAPAK ALANI */}
      <div className="bg-white border-b border-gray-200">
        {/* Kapak Görseli */}
        <div className="h-48 md:h-64 bg-secondary relative overflow-hidden group">
          <div className="absolute inset-0 bg-secondary/50"></div>
          <img 
            src={coverUrl} 
            alt={company.title} 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white/10 hover:bg-white/20 text-white p-2 backdrop-blur-sm border border-white/10 transition-colors">
               <Share2 size={18} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white p-2 backdrop-blur-sm border border-white/10 transition-colors">
               <Star size={18} />
            </button>
          </div>
        </div>

        {/* Profil Bilgileri Satırı */}
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            
            {/* Logo Kutusu */}
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 shadow-lg border border-gray-200 relative z-10 shrink-0">
              <div className="w-full h-full border border-gray-100 flex items-center justify-center bg-gray-50 overflow-hidden">
                 <img 
                   src={logoUrl} 
                   alt={company.title} 
                   className="w-full h-full object-contain p-2"
                 />
              </div>
            </div>

            {/* Başlık ve Özet */}
            <div className="flex-1 pb-2 md:pb-0 w-full">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-secondary uppercase tracking-tight line-clamp-1">
                       {company.title}
                     </h1>
                     {details.isVerified && (
                        <div className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm shrink-0">
                          <CheckCircle size={12} /> Onaylı
                        </div>
                     )}
                   </div>
                   <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1 text-primary font-bold uppercase tracking-wide">
                        <Building2 size={14} /> {sectorName}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {locationName}
                      </span>
                      {details.workingHours && details.workingHours.length > 0 && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                          <span className="text-green-600 flex items-center gap-1 text-xs bg-green-50 px-2 py-0.5 border border-green-100">
                            <Clock size={12} /> Açık
                          </span>
                        </>
                      )}
                   </div>
                 </div>

                 {/* Aksiyon Butonları */}
                 <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                   <button className="flex-1 md:flex-none bg-primary hover:bg-primary-hover text-white px-6 py-3 font-bold text-sm uppercase tracking-wide shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                     TEKLİF İSTE
                   </button>
                   <button className="flex-1 md:flex-none bg-white border border-gray-300 text-secondary hover:border-secondary px-6 py-3 font-bold text-sm uppercase tracking-wide transition-colors whitespace-nowrap">
                     MESAJ AT
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Navigasyon Tabları (Link Haline Getirildi) */}
          <div className="flex overflow-x-auto border-t border-gray-100 scrollbar-hide">
             {[
               { name: "Genel Bakış", id: "genel" },
               { name: "Hizmetler & Ürünler", id: "hizmetler" },
               { name: "Referanslar", id: "referanslar" },
               { name: "Haberler", id: "haberler" },
               { name: "İletişim", id: "iletisim" }
             ].map((tab, i) => (
               <a 
                 key={i}
                 href={`#${tab.id}`}
                 className={`px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-secondary hover:border-gray-300'}`}
               >
                 {tab.name}
               </a>
             ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. SOL KOLON (Sidebar Bilgiler) */}
          <aside className="w-full lg:w-1/3 space-y-6">
            
            {/* İletişim Kartı */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                İletişim Bilgileri
              </h3>
              <ul className="space-y-4 text-sm">
                {details.phone && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase">Telefon</span>
                      <a href={`tel:${details.phone}`} className="font-medium text-secondary hover:text-primary transition">{details.phone}</a>
                    </div>
                  </li>
                )}
                {details.email && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase">E-Posta</span>
                      <a href={`mailto:${details.email}`} className="font-medium text-secondary hover:text-primary transition break-all">{details.email}</a>
                    </div>
                  </li>
                )}
                {details.website && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shrink-0">
                      <Globe size={16} />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase">Web Sitesi</span>
                      <a href={details.website} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary hover:text-primary transition break-all">{details.website.replace(/^https?:\/\//, '')}</a>
                    </div>
                  </li>
                )}
                {details.address && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase">Adres</span>
                      <span className="text-gray-600 leading-snug whitespace-pre-wrap">{details.address}</span>
                    </div>
                  </li>
                )}
              </ul>

              {/* Sosyal Medya */}
              {details.social && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                   <div className="flex gap-2 justify-center">
                     {details.social.facebook && (
                       <a href={details.social.facebook} target="_blank" className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all"><Facebook size={18} /></a>
                     )}
                     {details.social.twitter && (
                       <a href={details.social.twitter} target="_blank" className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-black transition-all"><Twitter size={18} /></a>
                     )}
                     {details.social.linkedin && (
                       <a href={details.social.linkedin} target="_blank" className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all"><Linkedin size={18} /></a>
                     )}
                     {details.social.instagram && (
                       <a href={details.social.instagram} target="_blank" className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E4405F] hover:border-[#E4405F] transition-all"><Instagram size={18} /></a>
                     )}
                   </div>
                </div>
              )}
            </div>

            {/* Şirket Künyesi */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                Firma Künyesi
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {details.foundationYear && (
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Kuruluş Yılı</span>
                    <span className="font-semibold text-secondary">{details.foundationYear}</span>
                  </div>
                )}
                {details.employeeCount && (
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Çalışan Sayısı</span>
                    <span className="font-semibold text-secondary">{details.employeeCount}</span>
                  </div>
                )}
                {details.taxOffice && (
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Vergi Dairesi</span>
                    <span className="font-semibold text-secondary">{details.taxOffice}</span>
                  </div>
                )}
                {details.tradeRegistryNumber && (
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Ticaret Sicil</span>
                    <span className="font-semibold text-secondary">{details.tradeRegistryNumber}</span>
                  </div>
                )}
              </div>
              
              {details.activityCertificate && (
                <a href={details.activityCertificate} target="_blank" className="w-full mt-6 flex items-center justify-center gap-2 border border-dashed border-gray-300 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase">
                  <Download size={14} /> Faaliyet Belgesi İndir
                </a>
              )}
            </div>
          </aside>

          {/* 3. SAĞ KOLON (Ana İçerik) */}
          <main className="w-full lg:w-2/3 space-y-8">
            
            {/* Hakkımızda */}
            <section id="genel" className="bg-white border border-gray-200 p-8 shadow-sm scroll-mt-24">
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary block"></span>
                Firma Hakkında
              </h2>
              <div 
                className="prose prose-sm max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-secondary"
                dangerouslySetInnerHTML={{ __html: company.content || '<p>Firma hakkında detaylı bilgi bulunmamaktadır.</p>' }} 
              />

              {/* Çalışma Saatleri Tablosu */}
              {details.workingHours && details.workingHours.length > 0 && (
                <div className="mt-8 bg-gray-50 p-4 border border-gray-200 rounded-sm">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Clock size={14}/> Çalışma Saatleri</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {details.workingHours.map((wh: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                           <span className="font-bold text-secondary">{wh.days}</span>
                           <span className="text-gray-600">{wh.time}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </section>

            {/* Hizmetler & Ürünler */}
            {details.services && details.services.length > 0 && (
              <section id="hizmetler" className="bg-white border border-gray-200 p-8 shadow-sm scroll-mt-24">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-primary block"></span>
                     Hizmetler & Çözümler
                   </h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {details.services.map((item: any, i: number) => {
                     // İkon seçimi
                     const ServiceIcon = (LucideIcons as any)[item.icon] || Box;
                     
                     return (
                       <div key={i} className="group border border-gray-100 p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-gray-50 hover:bg-white">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                               <ServiceIcon size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-secondary text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                               <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                            </div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
              </section>
            )}

            {/* Galeri / Referanslar */}
            {galleryImages.length > 0 && (
              <section id="referanslar" className="scroll-mt-24">
                <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary block"></span>
                  Galeri & Referanslar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((imgUrl: string, i: number) => (
                    <div key={i} className="aspect-square bg-gray-200 relative group overflow-hidden border border-gray-200">
                      <img 
                        src={imgUrl} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={`Galeri ${i+1}`} 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <span className="text-white text-xs font-bold uppercase tracking-wider border border-white px-3 py-1">İncele</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Haberler (Backend'den Gelen) */}
            {details.relatedNews && details.relatedNews.length > 0 && (
              <section id="haberler" className="bg-white border border-gray-200 p-8 shadow-sm scroll-mt-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary block"></span>
                    Firma Haberleri
                  </h2>
                  <Link href="/haberler" className="text-xs font-bold text-primary hover:underline">TÜMÜNÜ GÖR</Link>
                </div>
                
                <div className="space-y-4">
                  {details.relatedNews.filter((news: any) => news?.slug).map((news: any) => (
                    <Link href={`/haber/${news.slug}`} key={news.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 group">
                      <div className="w-24 h-24 bg-gray-100 shrink-0 border border-gray-200 overflow-hidden">
                         {news.featuredImage?.node?.sourceUrl ? (
                           <img src={news.featuredImage.node.sourceUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300"><Newspaper size={24}/></div>
                         )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-1">
                          <Calendar size={12} /> {new Date(news.date).toLocaleDateString('tr-TR')}
                        </div>
                        <h3 className="font-bold text-secondary text-base mb-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* İletişim Formu */}
            <section id="iletisim" className="bg-white border border-gray-200 p-8 shadow-sm scroll-mt-24">
              <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary block"></span>
                İletişim Formu
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Adınız Soyadınız</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="Ad Soyad" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">E-Posta Adresiniz</label>
                    <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none" placeholder="ornek@mail.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Konu</label>
                  <select className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none">
                    <option>Genel Bilgi Talebi</option>
                    <option>Teklif İsteği</option>
                    <option>İş Başvurusu</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Mesajınız</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-none resize-none" placeholder="Mesajınızı buraya yazınız..."></textarea>
                </div>
                <button type="button" className="bg-secondary text-white px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-primary transition-colors flex items-center gap-2">
                  <Send size={16} /> Gönder
                </button>
              </form>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}