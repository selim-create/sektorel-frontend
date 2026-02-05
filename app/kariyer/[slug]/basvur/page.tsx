import Link from "next/link";
import { 
  ChevronRight, 
  UploadCloud, 
  CheckCircle, 
  FileText,
  ShieldCheck,
  Send,
  ArrowLeft
} from "lucide-react";

export default async function ApplyJobPage({ params }: { params: Promise<{ slug: string }> }) {
  // const { slug } = await params;
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-3xl">
           <Link href="/kariyer/1" className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase hover:text-white mb-4 transition-colors">
              <ArrowLeft size={12} /> İlana Geri Dön
           </Link>
           
           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
             İş Başvurusu
           </h1>
           <p className="text-gray-400 text-sm">
             <span className="text-white font-bold">"Senior Frontend Developer"</span> pozisyonu için başvuruyorsunuz.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white border border-gray-200 shadow-sm">
           
           {/* Güvenlik Uyarısı */}
           <div className="bg-blue-50 p-6 border-b border-gray-200 flex items-start gap-4">
              <ShieldCheck className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-blue-900 text-sm mb-1">Kişisel Verilerin Korunması</h3>
                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Başvurunuz doğrudan işveren firmaya iletilecektir. Kişisel verileriniz KVKK kapsamında korunmaktadır.
                  Profilinizdeki bilgiler otomatik olarak başvuruya eklenecektir.
                </p>
              </div>
           </div>

           <form className="p-8 space-y-8">
              
              {/* İletişim Bilgileri */}
              <div>
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                   İletişim Bilgileri
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Ad Soyad</label>
                       <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" defaultValue="Kullanıcı Adı" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">E-Posta</label>
                       <input type="email" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" defaultValue="email@ornek.com" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                       <input type="tel" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" defaultValue="+90 555 123 45 67" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Şehir</label>
                       <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" defaultValue="İstanbul" />
                    </div>
                 </div>
              </div>

              {/* CV ve Ön Yazı */}
              <div>
                 <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                   Özgeçmiş ve Ön Yazı
                 </h3>
                 
                 <div className="space-y-6">
                    {/* CV Upload */}
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Özgeçmiş (CV)</label>
                       <div className="border-2 border-dashed border-gray-300 p-6 flex items-center justify-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-white transition-colors">
                             <FileText size={24} />
                          </div>
                          <div className="text-left">
                             <span className="block text-sm font-bold text-secondary group-hover:text-primary transition-colors">Dosya Seç veya Sürükle</span>
                             <span className="text-xs text-gray-400">PDF, DOCX (Max 5MB)</span>
                          </div>
                       </div>
                       {/* Kayıtlı CV Varsa Göster */}
                       <div className="flex items-center gap-2 bg-green-50 border border-green-100 p-3 mt-2">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-xs font-bold text-green-700">Kayılı CV: Ahmet_Yilmaz_CV_2026.pdf</span>
                          <button type="button" className="text-[10px] underline ml-auto text-green-800">Değiştir</button>
                       </div>
                    </div>

                    {/* Ön Yazı */}
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Ön Yazı (Opsiyonel)</label>
                       <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none" placeholder="Kendinizi ve bu pozisyona neden uygun olduğunuzu kısaca anlatın..."></textarea>
                    </div>
                 </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100">
                 <button className="w-full bg-primary hover:bg-primary-hover text-white py-5 font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                   <Send size={16} /> Başvuruyu Tamamla
                 </button>
              </div>

           </form>
        </div>
      </div>
    </div>
  );
}