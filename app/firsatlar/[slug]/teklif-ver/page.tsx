import Link from "next/link";
import { 
  ChevronRight, 
  FileText, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  Send,
  UploadCloud
} from "lucide-react";

export default async function SubmitOfferPage({ params }: { params: Promise<{ slug: string }> }) {
  // const { slug } = await params;
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-3xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/firsatlar" className="hover:text-white transition">Fırsatlar</Link>
             <ChevronRight size={12} />
             <span className="text-gray-400">Detay</span>
             <ChevronRight size={12} />
             <span className="text-primary">Teklif Ver</span>
           </div>
           
           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
             Teklif Hazırlama
           </h1>
           <p className="text-gray-400 text-sm">
             <span className="text-white font-bold">"50.000 Adet Oluklu Koli İhtiyacı"</span> ilanı için teklif veriyorsunuz.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
           
           {/* Üst Bilgi */}
           <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-start gap-4">
              <ShieldCheck className="text-primary mt-1" size={24} />
              <div>
                <h3 className="font-bold text-secondary text-sm mb-1">Güvenli Teklif Sistemi</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Verdiğiniz teklif sadece ilan sahibi tarafından görülebilir. Diğer tedarikçiler fiyatınızı göremez.
                  Teklifiniz bağlayıcıdır, lütfen şartnameyi dikkatlice okuduğunuzdan emin olun.
                </p>
              </div>
           </div>

           <form className="p-8 space-y-8">
              
              {/* Fiyatlandırma */}
              <div>
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                   Fiyat ve Ödeme
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><DollarSign size={12}/> Toplam Teklif Tutarı (KDV Hariç)</label>
                       <input type="number" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold text-secondary focus:outline-none focus:border-primary rounded-none" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Para Birimi</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                          <option>TRY (Türk Lirası)</option>
                          <option>USD (Amerikan Doları)</option>
                          <option>EUR (Euro)</option>
                       </select>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center gap-2">
                    <input type="checkbox" className="accent-primary w-4 h-4" id="kdv" />
                    <label htmlFor="kdv" className="text-xs text-gray-600 font-medium">Fiyata nakliye dahildir.</label>
                 </div>
              </div>

              {/* Süreç */}
              <div>
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                   Teslimat ve Geçerlilik
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Clock size={12}/> Teslim Süresi (Gün)</label>
                       <input type="number" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="Örn: 15" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Teklif Geçerlilik Süresi</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                          <option>7 Gün</option>
                          <option>15 Gün</option>
                          <option>30 Gün</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Açıklama ve Dosya */}
              <div>
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                   Teklif Mektubu ve Dosyalar
                 </h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Açıklama / Notlar</label>
                       <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none" placeholder="Ürün kalitesi, referanslar veya ödeme koşulları hakkında ek bilgi..."></textarea>
                    </div>
                    
                    <div className="border border-dashed border-gray-300 p-4 flex items-center justify-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors">
                       <UploadCloud className="text-gray-400" size={24} />
                       <div className="text-left">
                          <span className="block text-xs font-bold text-secondary">Resmi Teklif Dosyası Ekle (PDF)</span>
                          <span className="text-[10px] text-gray-400">Opsiyonel, Max 5MB</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                 <button className="w-full bg-primary hover:bg-primary-hover text-white py-5 font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                   <Send size={16} /> Teklifi Gönder
                 </button>
                 <p className="text-[10px] text-gray-400 text-center mt-3">
                   Teklif göndererek platform kurallarını kabul etmiş olursunuz.
                 </p>
              </div>

           </form>
        </div>
      </div>
    </div>
  );
}