import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Büyük 404 Yazısı */}
        <h1 className="text-[120px] md:text-[180px] font-black text-gray-200 leading-none select-none">
          404
        </h1>
        
        <div className="relative -mt-12 md:-mt-16 z-10">
          <h2 className="text-2xl md:text-4xl font-black text-secondary uppercase tracking-tight mb-4">
            Aradığınız Sayfa Bulunamadı
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            Ulaşmaya çalıştığınız sayfa silinmiş, taşınmış veya adresi yanlış yazılmış olabilir.
          </p>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 font-bold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              <Home size={16} /> Anasayfaya Dön
            </Link>
            <Link 
              href="/iletisim" 
              className="bg-white border border-gray-300 text-secondary hover:bg-gray-50 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Bize Ulaşın <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>

          {/* Hızlı Linkler */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase mb-4">Popüler Sayfalar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Firmalar", url: "/firmalar" },
                { name: "Haberler", url: "/haberler" },
                { name: "İlanlar", url: "/kariyer" },
                { name: "Etkinlikler", url: "/ajanda" },
              ].map((link, i) => (
                <Link 
                  key={i} 
                  href={link.url}
                  className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-primary hover:text-primary uppercase transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}