"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  FileText,
  Info,
  X
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

export default function CreateLeadPage() {
  const [filePreview, setFilePreview] = useState<{ name: string, type: 'image' | 'file' | null } | null>(null);

  // Dosya Yükleme Simülasyonu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      setFilePreview({
        name: file.name,
        type: isImage ? 'image' : 'file'
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-5xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/" className="hover:text-white transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <Link href="/firsatlar" className="hover:text-white transition">Fırsatlar</Link>
             <ChevronRight size={12} />
             <span className="text-primary">Talep Oluştur</span>
           </div>
           
           <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <Briefcase className="text-primary" size={32} /> Yeni Alım Talebi
           </h1>
           <p className="text-gray-400 mt-2 text-lg max-w-2xl">
             İhtiyaçlarınızı detaylandırın, binlerce tedarikçiden en uygun teklifleri alın.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
           
           {/* SOL: FORM */}
           <main className="w-full lg:w-2/3">
            <form className="space-y-8">
              
              {/* ADIM 1: Ne Arıyorsunuz? */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm border-t-4 border-t-primary">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  1. İhtiyaç Detayları
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">İlan Başlığı <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Örn: 50.000 Adet Oluklu Koli İhtiyacı" 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">İlgili Sektör</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                         <option value="">Sektör Seçiniz...</option>
                         {SECTORS.map((sec, i) => (
                           <option key={i} value={sec}>{sec}</option>
                         ))}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Talep Tipi</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                         <option>Alım Talebi</option>
                         <option>Hizmet Talebi</option>
                         <option>Bayilik Verme</option>
                         <option>Çözüm Ortaklığı</option>
                         <option>Satış İlanı</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Detaylı Açıklama / Şartname</label>
                    <textarea 
                      rows={6} 
                      placeholder="Ürünün teknik özellikleri, adetler, kalite beklentisi ve diğer özel şartlarınızı buraya yazın..."
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* ADIM 2: Bütçe ve Teslimat */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  2. Bütçe ve Lokasyon
                </h2>
                
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><DollarSign size={12}/> Tahmini Bütçe</label>
                         <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                           <option>Teklif Usulü (Fiyat İstiyorum)</option>
                           <option>0 - 10.000 TL</option>
                           <option>10.000 - 50.000 TL</option>
                           <option>50.000 - 250.000 TL</option>
                           <option>250.000 TL üzeri</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Calendar size={12}/> İlan Bitiş Tarihi</label>
                         <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                           <option>3 Gün</option>
                           <option>1 Hafta</option>
                           <option>15 Gün</option>
                           <option>1 Ay</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={12}/> Teslimat / Hizmet Yeri</label>
                      <input 
                        type="text" 
                        placeholder="Örn: Torbalı OSB, İzmir" 
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                      />
                   </div>
                   
                   {/* Gizlilik Ayarı */}
                   <div className="p-4 bg-gray-50 border border-gray-200 flex items-start gap-3">
                      <input type="checkbox" className="accent-primary w-5 h-5 mt-0.5 rounded-none" id="hide_name" />
                      <div>
                         <label htmlFor="hide_name" className="text-sm font-bold text-secondary block cursor-pointer">Firma Adımı Gizle</label>
                         <p className="text-xs text-gray-500 mt-1">İlanınız "Gizli Firma" olarak yayınlanır, sadece onayladığınız teklif sahipleri bilgilerinizi görür.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* ADIM 3: Görsel ve Dosya */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  3. Görsel ve Dosya Ekleme
                </h2>
                
                <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer group">
                   <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                   
                   {filePreview ? (
                     <div className="flex flex-col items-center justify-center">
                        {filePreview.type === 'image' ? (
                          <div className="text-green-600 mb-2"><ImageIcon size={48}/></div>
                        ) : (
                          <div className="text-blue-600 mb-2"><FileText size={48}/></div>
                        )}
                        <span className="text-sm font-bold text-secondary mb-1">{filePreview.name}</span>
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> Yüklenmeye Hazır</span>
                        <button onClick={(e) => {e.preventDefault(); setFilePreview(null)}} className="mt-3 text-xs text-red-500 underline font-bold uppercase z-20 relative">Kaldır</button>
                     </div>
                   ) : (
                     <>
                       <ImageIcon size={32} className="mx-auto text-gray-400 mb-2 group-hover:text-primary transition-colors"/>
                       <h3 className="font-bold text-secondary text-sm">Görsel veya Teknik Çizim Yükle</h3>
                       <p className="text-xs text-gray-400 mt-1">Sürükle bırak veya dosya seç (PDF, JPG, PNG)</p>
                     </>
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                 <button type="button" className="w-full bg-primary hover:bg-primary-hover text-white py-5 text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                   TALEBİ YAYINLA
                 </button>
                 <p className="text-xs text-gray-400 text-center">
                   Talebiniz editör onayından sonra yayına alınacaktır.
                 </p>
              </div>

            </form>
           </main>

           {/* SAĞ: REHBER SIDEBAR */}
           <aside className="w-full lg:w-1/3 space-y-8">
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h3 className="text-sm font-black text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Info size={16} /> Etkili İlan İpuçları
                </h3>
                <ul className="space-y-3 text-sm text-blue-900/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Net Başlık:</strong> "Koli Alınacak" yerine "50.000 Adet Çift Oluklu Koli" yazın.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Teknik Detay:</strong> Ölçü, materyal, renk gibi teknik detayları mutlaka belirtin.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>Görsel Ekleyin:</strong> Numune görseli veya teknik çizim eklemek doğru teklif almanızı sağlar.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                   <AlertCircle size={16} className="text-primary"/> Yasaklı Ürünler
                 </h3>
                 <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                   Aşağıdaki ürün grupları için talep oluşturulamaz:
                 </p>
                 <ul className="text-xs text-gray-500 space-y-2 list-disc list-inside">
                   <li>Yasa dışı veya reçeteli ilaçlar</li>
                   <li>Ateşli silahlar ve patlayıcılar</li>
                   <li>Telif hakkı ihlali içeren ürünler</li>
                   <li>Kripto para veya finansal yatırım araçları</li>
                 </ul>
              </div>

           </aside>
        </div>
      </div>
    </div>
  );
}