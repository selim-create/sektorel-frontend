import Link from "next/link";
import { 
  Building2, 
  Users, 
  Target, 
  Globe, 
  CheckCircle, 
  ArrowRight 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-secondary text-white py-20 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
           <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
             BİZ KİMİZ?
           </span>
           <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
             İş Dünyasının <br/><span className="text-primary">Dijital Pusulası</span>
           </h1>
           <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             Sektörel Ajanda, firmaları, fırsatları ve bilgiyi tek bir merkezde toplayarak Türkiye'nin ticaret hacmini artırmayı hedefleyen yeni nesil bir iş platformudur.
           </p>
        </div>
      </section>

      {/* 2. MİSYON & VİZYON */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 border border-gray-200 shadow-lg border-t-4 border-t-primary">
              <Target className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-black text-secondary uppercase mb-3">Misyonumuz</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                KOBİ'lerden holdinglere kadar tüm işletmelerin dijital görünürlüğünü artırmak ve doğru iş ortaklarını bulmalarını sağlamak.
              </p>
           </div>
           <div className="bg-white p-8 border border-gray-200 shadow-lg border-t-4 border-t-secondary">
              <Globe className="text-secondary mb-4" size={32} />
              <h3 className="text-xl font-black text-secondary uppercase mb-3">Vizyonumuz</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Türkiye'nin ve bölgenin en güvenilir, en güncel ve en etkileşimli sektörel veri ve ticaret merkezi olmak.
              </p>
           </div>
           <div className="bg-white p-8 border border-gray-200 shadow-lg border-t-4 border-t-gray-400">
              <Building2 className="text-gray-400 mb-4" size={32} />
              <h3 className="text-xl font-black text-secondary uppercase mb-3">Değerlerimiz</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Şeffaflık, güvenilirlik, yenilikçilik ve sürdürülebilir büyüme odaklı bir ticaret ekosistemi yaratmak.
              </p>
           </div>
        </div>
      </div>

      {/* 3. HİKAYEMİZ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                 <div className="relative p-4 border border-gray-200 bg-white">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800" 
                      alt="Ofis" 
                      className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 shadow-xl hidden md:block">
                       <span className="block text-4xl font-black">10+</span>
                       <span className="text-xs font-bold uppercase tracking-widest">Yıllık Tecrübe</span>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2">
                 <h2 className="text-3xl font-black text-secondary uppercase tracking-tight mb-6">
                   Neden Sektörel Ajanda?
                 </h2>
                 <p className="text-gray-600 mb-6 leading-relaxed">
                   Geleneksel firma rehberlerinin statik yapısından sıkıldık. İş dünyasının yaşayan, nefes alan ve sürekli güncellenen bir platforma ihtiyacı olduğunu gördük.
                 </p>
                 <p className="text-gray-600 mb-8 leading-relaxed">
                   Sadece "kimin nerede olduğunu" değil, "kimin neye ihtiyacı olduğunu" ve "sektörde neler olduğunu" gösteren bir yapı kurduk. Bugün binlerce firma, Sektörel Ajanda üzerinden yeni müşteriler buluyor ve ihracat kapılarını aralıyor.
                 </p>
                 
                 <ul className="space-y-3 mb-8">
                    {["Doğrulanmış Firma Veritabanı", "Gerçek Zamanlı Ticari Talepler", "Sektörel Haber ve Mevzuat Takibi"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-secondary">
                         <CheckCircle size={16} className="text-primary" /> {item}
                      </li>
                    ))}
                 </ul>

                 <Link href="/kayit" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors">
                   Aramıza Katılın <ArrowRight size={16} />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 4. İSTATİSTİKLER (Siyah Bant) */}
      <section className="bg-secondary text-white py-16 px-4">
         <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-700">
               <div>
                  <span className="block text-4xl md:text-5xl font-black text-primary mb-2">5K+</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kayıtlı Firma</span>
               </div>
               <div>
                  <span className="block text-4xl md:text-5xl font-black text-primary mb-2">12K</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aktif İlan</span>
               </div>
               <div>
                  <span className="block text-4xl md:text-5xl font-black text-primary mb-2">85M</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ticaret Hacmi (TL)</span>
               </div>
               <div>
                  <span className="block text-4xl md:text-5xl font-black text-primary mb-2">450</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sektörel Etkinlik</span>
               </div>
            </div>
         </div>
      </section>

      {/* 5. EKİP (Opsiyonel) */}
      <section className="py-20 px-4 bg-white">
         <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight mb-12">
              Yönetim Ekibi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="group">
                    <div className="aspect-square bg-gray-100 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                       <img src={`https://placehold.co/300x300/e5e7eb/333?text=Ekip+Uyyesi`} alt="Ekip" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-secondary text-sm uppercase">İsim Soyisim</h4>
                    <span className="text-xs text-gray-500 font-medium">Unvan / Pozisyon</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}