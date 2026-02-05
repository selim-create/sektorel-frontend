import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Upload, 
  Save 
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      
      <div>
         <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Firma Ayarları</h1>
         <p className="text-gray-500 text-sm mt-1">Firma profilinizi güncel tutarak daha fazla etkileşim alın.</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
         
         {/* Tabs (Görsel) */}
         <div className="flex border-b border-gray-200">
            <button className="px-6 py-4 text-sm font-bold uppercase text-primary border-b-2 border-primary bg-gray-50">Genel Bilgiler</button>
            <button className="px-6 py-4 text-sm font-bold uppercase text-gray-500 hover:text-secondary hover:bg-gray-50 transition-colors">İletişim</button>
            <button className="px-6 py-4 text-sm font-bold uppercase text-gray-500 hover:text-secondary hover:bg-gray-50 transition-colors">Medya</button>
            <button className="px-6 py-4 text-sm font-bold uppercase text-gray-500 hover:text-secondary hover:bg-gray-50 transition-colors">Güvenlik</button>
         </div>

         <div className="p-8 space-y-8">
            
            {/* Logo ve Kapak */}
            <div className="flex items-start gap-6 pb-8 border-b border-gray-100">
               <div className="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden rounded-sm">
                  <span className="text-xs font-bold text-gray-400">Logo</span>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Upload className="text-white" size={20}/>
                  </div>
               </div>
               <div className="flex-1">
                  <div className="h-24 bg-gray-100 border border-gray-200 w-full relative group cursor-pointer overflow-hidden rounded-sm flex items-center justify-center">
                     <span className="text-xs font-bold text-gray-400">Kapak Görseli</span>
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="text-white" size={20}/>
                     </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Önerilen boyutlar: Logo (500x500), Kapak (1200x400). Max 2MB.</p>
               </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Firma Adı</label>
                  <input type="text" defaultValue="Yıldız Yapı Mimarlık" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Sektör</label>
                  <select className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                     <option>İnşaat & Yapı</option>
                     <option>Tekstil</option>
                  </select>
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Hakkımızda</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none" defaultValue="30 yıllık tecrübemizle..."></textarea>
               </div>
               
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Globe size={12}/> Web Sitesi</label>
                  <input type="url" defaultValue="https://yildizyapi.com" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Phone size={12}/> Telefon</label>
                  <input type="tel" defaultValue="+90 212 555 55 55" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
               <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 text-sm font-bold uppercase tracking-widest shadow-md transition-colors flex items-center gap-2">
                  <Save size={16} /> Değişiklikleri Kaydet
               </button>
            </div>

         </div>
      </div>
    </div>
  );
}