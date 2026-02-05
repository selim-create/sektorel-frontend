import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO HEADER */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-5xl text-center">
           <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
             BİZE ULAŞIN
           </span>
           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
             İletişime Geçin
           </h1>
           <p className="text-gray-400 text-lg max-w-xl mx-auto">
             Sorularınız, önerileriniz veya iş birlikleri için aşağıdaki kanallardan bize ulaşabilirsiniz.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-10 max-w-5xl">
        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
           
           {/* SOL: İletişim Bilgileri */}
           <div className="w-full md:w-2/5 bg-secondary text-white p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-8">İletişim Kanalları</h3>
              
              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/10">
                       <MapPin size={18} />
                    </div>
                    <div>
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Adres</span>
                       <p className="text-sm leading-relaxed text-gray-200">
                         Maslak Mah. Büyükdere Cad.<br/>
                         No: 123, Plaza A Blok, Kat: 5<br/>
                         Sarıyer / İstanbul
                       </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/10">
                       <Phone size={18} />
                    </div>
                    <div>
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Telefon</span>
                       <p className="text-sm font-medium text-white">
                         +90 (212) 123 45 67
                       </p>
                       <p className="text-xs text-gray-400 mt-1">Hafta içi 09:00 - 18:00</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/10">
                       <Mail size={18} />
                    </div>
                    <div>
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">E-Posta</span>
                       <p className="text-sm font-medium text-white">
                         info@sektorelajanda.com
                       </p>
                       <p className="text-sm font-medium text-white mt-1">
                         destek@sektorelajanda.com
                       </p>
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Sosyal Medya</h4>
                 <div className="flex gap-4">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                      <a key={i} href="#" className="text-white hover:text-primary transition-colors">
                        <Icon size={20} />
                      </a>
                    ))}
                 </div>
              </div>
           </div>

           {/* SAĞ: İletişim Formu */}
           <div className="w-full md:w-3/5 p-8 md:p-12">
              <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-2">Bize Yazın</h3>
              <p className="text-sm text-gray-500 mb-8">
                Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.
              </p>

              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Ad Soyad</label>
                       <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary rounded-none" placeholder="Adınız" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                       <input type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary rounded-none" placeholder="Telefon numaranız" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">E-Posta</label>
                    <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary rounded-none" placeholder="ornek@sirket.com" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Konu</label>
                    <select className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary rounded-none">
                       <option>Genel Bilgi</option>
                       <option>Üyelik ve Paketler</option>
                       <option>Teknik Destek</option>
                       <option>Reklam ve Sponsorluk</option>
                       <option>Şikayet / Öneri</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mesajınız</label>
                    <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-primary rounded-none resize-none" placeholder="Mesajınızı buraya yazın..."></textarea>
                 </div>

                 <button className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                   <Send size={16} /> Gönder
                 </button>
              </form>
           </div>

        </div>
      </div>

      {/* Harita Placeholder */}
      <div className="mt-12 w-full h-96 bg-gray-200 relative group overflow-hidden border-t border-b border-gray-300">
         <img 
           src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" 
           alt="Harita" 
           className="w-full h-full object-cover opacity-50 grayscale"
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white text-secondary px-6 py-3 font-bold uppercase text-sm shadow-xl hover:bg-secondary hover:text-white transition-colors flex items-center gap-2">
               <MapPin size={16} /> Haritada Göster
            </button>
         </div>
      </div>

    </div>
  );
}