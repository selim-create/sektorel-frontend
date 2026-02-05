import Link from "next/link";
import { getClient } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Ticket, 
  AlertCircle, 
  Video, 
  ChevronRight, 
  User, 
  Building,
  Info,
  ArrowLeft
} from "lucide-react";

// 1. GraphQL Sorgusu
const GET_EVENT_DATA = gql`
  query GetEventData($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      title
      slug
      content # Açıklama metni
      featuredImage {
        node {
          sourceUrl
        }
      }
      eventDetails {
        isOfficial
        eventType
        startDate
        endDate
        locationType
        venue
        address
        organizer
        price
        registrationLink
        
        # Repeater Alanlar (Backend'de tanımladığımız yapıda)
        schedule {
          time
          title
        }
        speakers {
          name
          title
          company
          image
        }
      }
    }
  }
`;

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Veriyi Çek
  const { data } = await getClient().query({
    query: GET_EVENT_DATA,
    variables: { slug }
  });

  const event = data?.event;

  // 404 Kontrolü
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Etkinlik Bulunamadı</h1>
          <p className="text-gray-500 mb-4">Aradığınız etkinlik süresi dolmuş veya kaldırılmış olabilir.</p>
          <Link href="/ajanda" className="text-primary hover:underline font-bold flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> Ajandaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const details = event.eventDetails || {};
  
  // Tarih ve Saat Formatlama
  const startDate = new Date(details.startDate);
  const endDate = details.endDate ? new Date(details.endDate) : null;
  
  const formattedDate = startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = startDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const endFormattedDate = endDate ? endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : null;

  // Kapak Görseli (Yoksa Placeholder)
  const coverImage = event.featuredImage?.node?.sourceUrl || `https://placehold.co/1200x500/111827/FFF?text=${encodeURIComponent(event.title)}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO HEADER */}
      <section className="bg-secondary text-white relative">
        {/* Arkaplan Görseli */}
        <div className="absolute inset-0 opacity-40">
           <img src={coverImage} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10 pt-32 pb-12">
           {/* Breadcrumb */}
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
             <Link href="/" className="hover:text-white transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/ajanda" className="hover:text-white transition">Ajanda</Link>
             <ChevronRight size={12} />
             <span className="text-primary">{details.eventType}</span>
           </div>

           <div className="flex flex-col md:flex-row items-end justify-between gap-8">
             <div>
               <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 border ${details.isOfficial ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-primary/20 text-primary border-primary/50'}`}>
                 {details.isOfficial ? <AlertCircle size={12}/> : <Calendar size={12}/>}
                 {details.eventType}
               </div>
               <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight max-w-4xl">
                 {event.title}
               </h1>
               <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-300 font-medium">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-white/10 rounded-full"><Calendar size={16} /></div>
                   <span>
                     {formattedDate} {endFormattedDate && `- ${endFormattedDate}`}
                   </span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-white/10 rounded-full"><MapPin size={16} /></div>
                   <span>{details.venue || (details.locationType === 'online' ? 'Online Platform' : 'Konum Belirtilmedi')}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 2. İÇERİK ve SIDEBAR */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Ana İçerik */}
          <main className="w-full lg:w-2/3 space-y-12">
            
            {/* Açıklama */}
            <section className="bg-white border border-gray-200 p-8 shadow-sm">
               <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-primary block"></span> Etkinlik Hakkında
               </h2>
               <div 
                 className="prose prose-sm max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-secondary prose-li:marker:text-primary prose-a:text-primary"
                 dangerouslySetInnerHTML={{ __html: event.content || '<p>Detaylı açıklama bulunmamaktadır.</p>' }}
               />
            </section>

            {/* Program / Akış (Sadece Resmi olmayan etkinlikler için ve veri varsa) */}
            {!details.isOfficial && details.schedule && details.schedule.length > 0 && (
              <section className="bg-white border border-gray-200 p-8 shadow-sm">
                 <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-6 bg-primary block"></span> Program Akışı
                 </h2>
                 <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {details.schedule.map((item: any, i: number) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                           <Clock size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 border border-gray-100 rounded shadow-sm">
                           <time className="font-bold text-xs text-primary mb-1 block">{item.time}</time>
                           <div className="font-bold text-secondary text-sm">{item.title}</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </section>
            )}

            {/* Konuşmacılar (Varsa) */}
            {!details.isOfficial && details.speakers && details.speakers.length > 0 && (
               <section>
                 <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-6 bg-primary block"></span> Konuşmacılar
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {details.speakers.map((speaker: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-white border border-gray-200 p-4 hover:border-primary transition-colors group">
                         <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0 border border-gray-100">
                           {speaker.image ? (
                             <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={24}/></div>
                           )}
                         </div>
                         <div>
                           <h4 className="font-bold text-secondary">{speaker.name}</h4>
                           <span className="text-xs text-gray-500 block">{speaker.title}</span>
                           <span className="text-xs text-primary font-bold">{speaker.company}</span>
                         </div>
                      </div>
                    ))}
                 </div>
               </section>
            )}

          </main>

          {/* SAĞ: Sticky Sidebar (Bilgi & Kayıt) */}
          <aside className="w-full lg:w-1/3 space-y-6">
            
            {/* Kayıt / Bilgi Kartı */}
            <div className={`bg-white border p-6 shadow-sm sticky top-24 ${details.isOfficial ? 'border-red-200 border-t-4 border-t-red-500' : 'border-gray-200 border-t-4 border-t-primary'}`}>
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 flex items-center justify-between">
                 Etkinlik Detayları
                 {details.isOfficial && <AlertCircle className="text-red-500" size={18}/>}
               </h3>
               
               <ul className="space-y-4 text-sm mb-8">
                 <li className="flex items-start gap-3">
                   <Calendar className="text-gray-400 shrink-0 mt-0.5" size={16} />
                   <div>
                     <span className="block text-xs text-gray-400 font-bold uppercase">Tarih</span>
                     <span className="font-medium text-secondary">{formattedDate}</span>
                     {endFormattedDate && <span className="text-gray-400 text-xs ml-1">- {endFormattedDate}</span>}
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <Clock className="text-gray-400 shrink-0 mt-0.5" size={16} />
                   <div>
                     <span className="block text-xs text-gray-400 font-bold uppercase">Saat</span>
                     <span className="font-medium text-secondary">{formattedTime}</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   {details.locationType === 'online' ? <Video className="text-gray-400 shrink-0 mt-0.5" size={16} /> : <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />}
                   <div>
                     <span className="block text-xs text-gray-400 font-bold uppercase">Lokasyon</span>
                     <span className="font-medium text-secondary block">{details.venue || (details.locationType === 'online' ? 'Online' : 'Belirtilmedi')}</span>
                     {details.address && <span className="text-xs text-gray-500">{details.address}</span>}
                   </div>
                 </li>
                 {!details.isOfficial && details.price && (
                   <li className="flex items-start gap-3">
                     <Ticket className="text-gray-400 shrink-0 mt-0.5" size={16} />
                     <div>
                       <span className="block text-xs text-gray-400 font-bold uppercase">Giriş Ücreti</span>
                       <span className="font-bold text-primary">{details.price}</span>
                     </div>
                   </li>
                 )}
               </ul>

               {/* Aksiyon Butonları */}
               <div className="space-y-3">
                 {details.registrationLink && !details.isOfficial ? (
                   <a href={details.registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-primary hover:bg-primary-hover text-white py-4 font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                     <Ticket size={18} /> Online Kayıt Ol
                   </a>
                 ) : details.isOfficial ? (
                   <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-default">
                     <Info size={18} /> Resmi Takvim
                   </button>
                 ) : (
                   <button className="w-full bg-gray-300 text-gray-500 py-4 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                     Kayıt Gerekmiyor
                   </button>
                 )}
                 
                 <button className="w-full bg-white border border-gray-300 text-secondary hover:bg-gray-50 py-3 font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                   <Calendar size={14} /> Takvime Ekle
                 </button>
               </div>
            </div>

            {/* Organizatör Kartı (Resmi Değilse) */}
            {!details.isOfficial && details.organizer && (
              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Organizatör</h3>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 font-bold">
                       <Building size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-secondary text-sm">{details.organizer}</h4>
                       {/* Burası ileride firma profiliyle bağlanabilir */}
                       <span className="text-xs text-gray-500">Etkinlik Sahibi</span>
                    </div>
                 </div>
              </div>
            )}
            
            {/* Harita Placeholder (Fiziksel İse) */}
            {details.locationType === 'physical' && (
              <div className="bg-gray-200 h-48 border border-gray-300 relative group cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-xs uppercase flex items-center gap-2">
                      <MapPin size={16} /> Haritada Göster
                    </span>
                 </div>
              </div>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
}