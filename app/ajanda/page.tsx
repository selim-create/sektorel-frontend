import Link from "next/link";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_EVENTS } from "@/lib/queries";
import { 
  Calendar, MapPin, Clock, Filter, Search, ChevronRight, 
  Plus, Download, Share2, Ticket, AlertCircle, Video 
} from "lucide-react";

export const revalidate = 60;

export default async function AgendaPage() {
  const { data } = await queryWithFallback<any>({ query: GET_EVENTS }, { events: { nodes: [] } }, "agenda listing");
  const events = data?.events?.nodes || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HERO */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto relative z-10">
           <div className="flex flex-col md:flex-row items-end justify-between gap-6">
             <div>
               <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 bg-white/5 border border-white/10 px-3 py-1">
                 <Calendar size={12} className="text-primary"/> Sektörel Etkinlik Takvimi
               </div>
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-4">İş Ajandası</h1>
               <p className="text-gray-400 mt-4 text-lg max-w-2xl">Fuarlar, seminerler ve resmi mali takvim tek bir noktada.</p>
             </div>
             <div className="flex gap-4">
               <Link href="/ajanda/olustur" className="bg-primary hover:bg-primary-hover text-white px-6 py-4 font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg">
                 <Plus size={18} /> Etkinlik Gönder
               </Link>
             </div>
           </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR (Statik Filtreler Şimdilik) */}
          <aside className="w-full lg:w-1/4 space-y-8">
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
                 <Filter size={16} className="text-gray-400"/> Kategoriler
               </h3>
               <div className="space-y-3">
                 {['Tümü', 'Fuarlar', 'Resmi Takvim', 'Webinarlar'].map((cat, i) => (
                   <label key={i} className="flex items-center justify-between cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <input type="checkbox" className="peer h-4 w-4 appearance-none border border-gray-300 checked:bg-primary checked:border-primary transition-all rounded-none" />
                        <span className="text-sm text-gray-600 group-hover:text-primary transition-colors font-medium">{cat}</span>
                     </div>
                   </label>
                 ))}
               </div>
            </div>
          </aside>

          {/* EVENTS LIST */}
          <main className="w-full lg:w-3/4 space-y-6">
            {events.map((event: any) => {
              const details = event.eventDetails || {};
              const isOfficial = details.isOfficial;
              const dateObj = new Date(details.startDate);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString('default', { month: 'short' });
              const year = dateObj.getFullYear();
              const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <Link 
                  href={`/ajanda/${event.slug}`} 
                  key={event.id} 
                  className={`group bg-white border border-gray-200 flex flex-col md:flex-row hover:shadow-lg transition-all duration-300 overflow-hidden relative block ${isOfficial ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent hover:border-l-primary'}`}
                >
                   {/* Tarih */}
                   <div className={`w-full md:w-32 bg-gray-50 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 shrink-0 ${isOfficial ? 'bg-red-50 text-red-600' : 'text-secondary group-hover:text-primary'}`}>
                      <span className="text-4xl font-black tracking-tighter">{day}</span>
                      <span className="text-sm font-bold uppercase tracking-widest">{month}</span>
                      <span className="text-xs text-gray-400 mt-1">{year}</span>
                   </div>

                   {/* İçerik */}
                   <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                         <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                               <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide border ${isOfficial ? 'bg-red-100 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                 {details.eventType}
                               </span>
                               {isOfficial && (
                                 <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                                   <AlertCircle size={10} /> Resmi Takvim
                                 </span>
                               )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wide mt-3">
                               <span className="flex items-center gap-1"><Clock size={12}/> {time}</span>
                               <span className="flex items-center gap-1">
                                 {details.locationType === 'online' ? <Video size={12}/> : <MapPin size={12}/>} 
                                 {details.venue || 'Online'}
                               </span>
                            </div>
                         </div>
                         
                         {/* Görsel */}
                         {!isOfficial && event.featuredImage?.node?.sourceUrl && (
                           <div className="w-full md:w-32 h-24 bg-gray-200 shrink-0 border border-gray-200 overflow-hidden hidden md:block">
                             <img src={event.featuredImage.node.sourceUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                         )}
                      </div>
                   </div>
                </Link>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}