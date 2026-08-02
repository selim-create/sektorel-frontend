import Link from "next/link";
import { queryWithFallback } from "@/lib/graphql-client";
import { GET_ALL_SECTORS } from "@/lib/queries";
import { 
  Building2, 
  Search,
  ArrowRight,
  ChevronRight,
  Layers // Fallback ikon
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export const revalidate = 3600; // 1 saatte bir yenile

export default async function SectorsPage() {
  const { data } = await queryWithFallback<any>({ query: GET_ALL_SECTORS }, { sectors: { nodes: [] } }, "sectors listing");
  const sectors = data?.sectors?.nodes || [];

  return (
    <div className="flex flex-col pb-20 bg-gray-50 min-h-screen">
      
      {/* HERO */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">TÜM SEKTÖRLER</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">İş ağınızı genişletmek için doğru sektörü seçin ve binlerce onaylı firmaya ulaşın.</p>
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input type="text" placeholder="Hangi sektörü arıyorsunuz?" className="w-full pl-12 pr-4 py-4 bg-white text-secondary font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-xl text-black" />
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition">Anasayfa</Link>
          <ChevronRight size={12} />
          <span className="text-secondary">Sektörler</span>
        </div>
      </div>

      {/* LISTE */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {sectors.map((sector: any) => {
            // Dinamik İkon
            const IconComponent = (LucideIcons as any)[sector.sectorDetails?.iconName] || Layers;
            const subSectors = sector.children?.nodes || [];

            return (
              <Link 
                key={sector.id} 
                href={`/sektor/${sector.slug}`}
                className="group bg-white border border-gray-200 p-0 hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row h-full"
              >
                {/* Sol Taraf */}
                <div className="p-8 md:w-2/5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 group-hover:bg-primary group-hover:text-white transition-colors duration-300 relative overflow-hidden">
                  <div className="mb-4 p-3 bg-white border border-gray-200 text-primary group-hover:text-primary group-hover:border-white transition-colors shadow-sm rounded-full">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{sector.name}</h3>
                  <span className="text-xs font-mono opacity-60 bg-black/5 px-2 py-1 rounded mt-2">
                    {sector.count} FİRMA
                  </span>
                </div>

                {/* Sağ Taraf */}
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Alt Kategoriler</h4>
                    <ul className="space-y-2">
                      {subSectors.slice(0, 5).map((sub: any) => (
                        <li key={sub.id} className="flex items-center text-sm text-secondary hover:text-primary transition-colors">
                          <span className="w-1.5 h-1.5 bg-gray-300 mr-2 group-hover/li:bg-primary transition-colors"></span>
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end text-primary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Tümünü Gör <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}