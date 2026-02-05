"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Info,
  ChevronRight,
  Ticket,
  Globe,
  X,
  Video
} from "lucide-react";

export default function CreateEventPage() {
  // Form State
  const [locationType, setLocationType] = useState<"physical" | "online">("physical");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Görsel Yükleme Simülasyonu
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-5xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/" className="hover:text-white transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/ajanda" className="hover:text-white transition">Ajanda</Link>
             <ChevronRight size={12} />
             <span className="text-primary">Etkinlik Ekle</span>
           </div>
           
           <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <Calendar className="text-primary" size={32} /> Etkinlik Gönder
           </h1>
           <p className="text-gray-400 mt-2 text-lg max-w-2xl">
             Firmanızın düzenlediği fuar, webinar veya seminerleri binlerce sektör profesyoneline duyurun.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Etkinlik Formu */}
          <main className="w-full lg:w-2/3">
            <form className="space-y-8">
              
              {/* BÖLÜM 1: Temel Bilgiler */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm border-t-4 border-t-primary">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  1. Etkinlik Detayları
                </h2>
                
                <div className="space-y-6">
                  {/* Başlık */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      Etkinlik Başlığı <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Örn: Uluslararası Yapı Fuarı 2026" 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  {/* Kategori & Tür */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                      <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                        <option>Fuar</option>
                        <option>Webinar</option>
                        <option>Konferans / Zirve</option>
                        <option>Eğitim / Seminer</option>
                        <option>Lansman</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">İlgili Sektör</label>
                      <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                        <option>Genel</option>
                        <option>İnşaat & Yapı</option>
                        <option>Tekstil</option>
                        <option>Otomotiv</option>
                        <option>Bilişim</option>
                      </select>
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Etkinlik Açıklaması</label>
                    <textarea 
                      rows={6} 
                      placeholder="Etkinliğin içeriği, katılımcı profili ve öne çıkan konular hakkında detaylı bilgi verin..." 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary bg-white transition-colors rounded-none placeholder:text-gray-400 resize-none"
                    ></textarea>
                    <p className="text-[10px] text-gray-400 text-right">Min. 100 karakter</p>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: Zaman ve Yer */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  2. Zaman ve Lokasyon
                </h2>

                <div className="space-y-6">
                  {/* Tarih Aralığı */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Calendar size={12}/> Başlangıç Tarihi</label>
                      <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Calendar size={12}/> Bitiş Tarihi</label>
                      <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                    </div>
                  </div>

                  {/* Lokasyon Tipi Toggle */}
                  <div className="flex items-center gap-4 bg-gray-50 p-1 border border-gray-200">
                     <button
                       type="button"
                       onClick={() => setLocationType("physical")}
                       className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${locationType === 'physical' ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                       <MapPin size={16} /> Fiziksel Etkinlik
                     </button>
                     <button
                       type="button"
                       onClick={() => setLocationType("online")}
                       className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${locationType === 'online' ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                       <Video size={16} /> Online / Webinar
                     </button>
                  </div>

                  {/* Fiziksel Adres Alanları */}
                  {locationType === "physical" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Şehir</label>
                        <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                          <option>İstanbul</option>
                          <option>Ankara</option>
                          <option>İzmir</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={12}/> Mekan / Adres</label>
                        <input 
                          type="text" 
                          placeholder="Örn: Tüyap Fuar ve Kongre Merkezi" 
                          className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Online Link Alanları */}
                  {locationType === "online" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Globe size={12}/> Platform / Yayın Linki</label>
                      <input 
                        type="url" 
                        placeholder="Örn: Zoom, Google Meet veya YouTube Linki" 
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                      />
                    </div>
                  )}

                </div>
              </div>

              {/* BÖLÜM 3: Görsel ve Medya */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  3. Görsel Medya
                </h2>
                
                {/* File Upload Area */}
                <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer group flex flex-col items-center justify-center overflow-hidden h-64">
                   <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   
                   {coverPreview ? (
                     <>
                        <img src={coverPreview} alt="Önizleme" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="relative z-20 bg-white/90 p-4 rounded-sm shadow-sm backdrop-blur-sm">
                           <span className="text-xs font-bold text-green-600 flex items-center gap-1 mb-2"><CheckCircle size={14}/> Görsel Seçildi</span>
                           <button onClick={(e) => {e.preventDefault(); setCoverPreview(null)}} className="text-xs text-red-500 underline font-bold uppercase">Değiştir</button>
                        </div>
                     </>
                   ) : (
                     <>
                       <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:border-primary group-hover:text-primary transition-colors text-gray-400">
                          <Upload size={24} />
                       </div>
                       <h3 className="font-bold text-secondary text-sm mb-1">Kapak Görseli Yükle</h3>
                       <p className="text-xs text-gray-400 mb-4">PNG, JPG veya WEBP (Max. 5MB)</p>
                       <span className="inline-block bg-white border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary group-hover:border-primary group-hover:text-primary transition-colors">
                         Dosya Seç
                       </span>
                     </>
                   )}
                </div>
              </div>

              {/* BÖLÜM 4: Kayıt ve İletişim */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  4. Kayıt Bilgileri
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Organizatör Firma</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="Firma Adı" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Globe size={12}/> Kayıt / Bilet Linki</label>
                      <input type="url" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="https://" />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Ticket size={12}/> Ücretlendirme</label>
                      <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                        <option>Ücretsiz (Kayıt Gerekli)</option>
                        <option>Ücretli Bilet</option>
                        <option>Davetiye Usulü</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-4">
                 <button type="button" className="flex-1 bg-primary hover:bg-primary-hover text-white py-5 text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                   ETKİNLİĞİ YAYINLA
                 </button>
                 <button type="button" className="bg-white border border-gray-300 text-secondary hover:bg-gray-50 px-8 py-5 text-sm font-bold uppercase tracking-wide transition-colors">
                   Taslak Olarak Kaydet
                 </button>
              </div>

            </form>
          </main>

          {/* SAĞ: Bilgi Sidebar */}
          <aside className="w-full lg:w-1/3 space-y-8">
            
            {/* Bilgilendirme Kutusu */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-sm font-black text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Info size={16} /> Neden Yayınlamalı?
              </h3>
              <ul className="space-y-3 text-sm text-blue-900/80">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>Sektörel Ajanda'da yer alarak hedef kitlenize doğrudan ulaşın.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>Etkinlik detaylarınız Google takvim entegrasyonu ile kullanıcıların ajandasına girsin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>Premium üye iseniz etkinliğiniz ana sayfada vitrine çıkar.</span>
                </li>
              </ul>
            </div>

            {/* Kurallar */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
               <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                 <AlertCircle size={16} className="text-primary"/> Yayınlama Kuralları
               </h3>
               <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                 Gönderilen etkinlikler editör onayından geçtikten sonra yayına alınır. Onay süreci ortalama 2-4 saattir.
               </p>
               <ul className="text-xs text-gray-500 space-y-2 list-disc list-inside">
                 <li>Görsel kalitesi yüksek olmalıdır.</li>
                 <li>Başlık tamamı büyük harfle yazılmamalıdır.</li>
                 <li>Yanıltıcı fiyat bilgisi girilmemelidir.</li>
                 <li>Siyasi veya yasa dışı içerik barındıramaz.</li>
               </ul>
            </div>

            {/* Destek */}
            <div className="bg-gray-900 text-white p-8 text-center">
               <h3 className="font-bold text-lg mb-2">Yardım mı lazım?</h3>
               <p className="text-gray-400 text-xs mb-4">Etkinlik kurgusu veya sponsorluk seçenekleri için bize ulaşın.</p>
               <Link href="/iletisim" className="inline-block border border-gray-600 hover:border-white hover:bg-white hover:text-black px-6 py-2 text-xs font-bold uppercase transition-all">
                 İletişime Geç
               </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}