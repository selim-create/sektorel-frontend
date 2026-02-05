"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  FileText
} from "lucide-react";

// Gerçek Ana Sektörler
const SECTORS = [
  "İnşaat, Yapı & Gayrimenkul",
  "Bilişim, Teknoloji & Telekom",
  "Otomotiv & Yan Sanayi",
  "Enerji & Tabii Kaynaklar",
  "Tekstil, Moda & Deri",
  "Gıda, Tarım & Hayvancılık",
  "Makine & Sanayi",
  "Elektrik & Elektronik",
  "Lojistik & Taşımacılık",
  "Sağlık, Medikal & Kozmetik",
  "Dış Ticaret & Pazarlama",
  "Mobilya & Dekorasyon",
  "Turizm, Otel & Restoran",
  "Hizmet & Danışmanlık",
  "Kimya & Plastik",
  "Kağıt, Ambalaj & Matbaa",
  "Madencilik & Metal",
  "Perakende & Mağazacılık",
  "Medya & Ajans",
  "Eğitim & Akademik",
  "Finans & Sigorta"
];

export default function PostJobPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-5xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/" className="hover:text-white transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/kariyer" className="hover:text-white transition">Kariyer</Link>
             <ChevronRight size={12} />
             <span className="text-primary">İlan Yayınla</span>
           </div>
           
           <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <Briefcase className="text-primary" size={32} /> İş İlanı Oluştur
           </h1>
           <p className="text-gray-400 mt-2 text-lg max-w-2xl">
             Aradığınız yeteneği Sektörel Ajanda'da bulun. Hızlı, etkili ve nokta atışı.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: FORM */}
          <main className="w-full lg:w-2/3">
            <form className="space-y-8">
              
              {/* ADIM 1: Pozisyon Detayları */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm border-t-4 border-t-primary">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  1. Pozisyon Bilgileri
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">İlan Başlığı <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Örn: Senior Satış Müdürü" 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Sektör / Departman</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                         <option value="">Sektör Seçiniz...</option>
                         {SECTORS.map((sec, i) => (
                           <option key={i} value={sec}>{sec}</option>
                         ))}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Çalışma Şekli</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                         <option>Tam Zamanlı</option>
                         <option>Yarı Zamanlı</option>
                         <option>Uzaktan (Remote)</option>
                         <option>Hibrit</option>
                         <option>Staj</option>
                         <option>Proje Bazlı</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">İş Tanımı ve Nitelikler</label>
                    <textarea 
                      rows={8} 
                      placeholder="Adaydan beklediğiniz özellikler, görev tanımı ve sunduğunuz imkanları detaylıca yazın..."
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none"
                    ></textarea>
                    <p className="text-[10px] text-gray-400 text-right">Min. 200 karakter</p>
                  </div>
                </div>
              </div>

              {/* ADIM 2: Kriterler ve İmkanlar */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  2. Kriterler ve İmkanlar
                </h2>
                
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Tecrübe</label>
                         <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                           <option>Tecrübesiz / Yeni Mezun</option>
                           <option>1-3 Yıl</option>
                           <option>3-5 Yıl</option>
                           <option>5-10 Yıl</option>
                           <option>10+ Yıl (Yönetici)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Eğitim Seviyesi</label>
                         <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                           <option>Lise</option>
                           <option>Ön Lisans</option>
                           <option>Lisans</option>
                           <option>Yüksek Lisans</option>
                           <option>Doktora</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={12}/> Lokasyon</label>
                      <input 
                        type="text" 
                        placeholder="Örn: İstanbul, Levent (Ofis)" 
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><DollarSign size={12}/> Maaş Aralığı (Opsiyonel)</label>
                      <input 
                        type="text" 
                        placeholder="Örn: 25.000 - 35.000 TL" 
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                      />
                   </div>
                </div>
              </div>

              {/* ADIM 3: Firma Bilgileri */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  3. Firma Bilgileri
                </h2>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Firma Adı</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="Firma Adı" />
                   </div>
                   <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200">
                      <input type="checkbox" className="accent-primary w-5 h-5 mt-0.5 rounded-none" id="hide_company" />
                      <div>
                         <label htmlFor="hide_company" className="text-sm font-bold text-secondary block cursor-pointer">Firma Adını Gizle</label>
                         <p className="text-xs text-gray-500 mt-1">İlanınız "Gizli Firma" olarak yayınlanır.</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                 <button type="button" className="w-full bg-primary hover:bg-primary-hover text-white py-5 text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                   İLANI YAYINLA
                 </button>
                 <p className="text-xs text-gray-400 text-center">
                   İlanınız editör onayından sonra yayına alınacaktır.
                 </p>
              </div>

            </form>
           </main>

           {/* SAĞ: REHBER SIDEBAR */}
           <aside className="w-full lg:w-1/3 space-y-8">
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h3 className="text-sm font-black text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Info size={16} /> Doğru Adaya Ulaşın
                </h3>
                <ul className="space-y-3 text-sm text-blue-900/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Net Başlık:</strong> "Personel Aranıyor" yerine "Senior Frontend Developer" gibi net başlıklar kullanın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Detaylı Tanım:</strong> Görev ve sorumlulukları madde madde sıralayın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Yan Haklar:</strong> Maaş haricinde sunduğunuz imkanları (Yemek, Özel Sağlık vb.) belirtin.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                   <AlertCircle size={16} className="text-primary"/> Önemli Uyarı
                 </h3>
                 <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                   İş Kanunu gereği, cinsiyet, din, ırk ayrımı yapan veya yanıltıcı bilgi içeren ilanlar yayınlanamaz.
                 </p>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mt-4 pt-4 border-t border-gray-100">
                    <FileText size={16} /> İlan Yayınlama Kuralları
                 </div>
              </div>

           </aside>
        </div>
      </div>
    </div>
  );
}