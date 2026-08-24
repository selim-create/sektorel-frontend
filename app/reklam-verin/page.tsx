import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Layers3,
  Mail,
  Megaphone,
  Newspaper,
  Sparkles,
  Store,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reklam Verin",
  description:
    "Sektörel Ajanda'da display, native içerik, sponsorluk, firma görünürlüğü, etkinlik ve marketplace çözümleriyle doğru iş kitlesine ulaşın.",
  alternates: { canonical: "/reklam-verin" },
};

const models = [
  {
    icon: Megaphone,
    title: "Display Reklam",
    text: "Ana sayfa, kategori, sektör, firma rehberi ve içerik sayfalarında görünür banner ve özel yerleşim modelleri.",
  },
  {
    icon: Newspaper,
    title: "Native İçerik",
    text: "Marka hikâyesini editoryal akışa uygun biçimde anlatan advertorial, röportaj, dosya içerik ve sektör odaklı içerik çalışmaları.",
  },
  {
    icon: Sparkles,
    title: "Sponsorluk",
    text: "Sektör, kategori, etkinlik, özel dosya ve tematik içerik alanlarında marka sahipliği ve uzun dönem görünürlük.",
  },
  {
    icon: Building2,
    title: "Firma Görünürlüğü",
    text: "Öne çıkan firma, güçlü profil görünürlüğü ve firma rehberi içindeki premium keşif alanlarıyla karar anında öne çıkın.",
  },
  {
    icon: CalendarDays,
    title: "Etkinlik & Ajanda",
    text: "Fuar, konferans, webinar ve kurumsal etkinliklerinizi ajanda, sektör ve lokasyon bağlamında hedefli kitlelere taşıyın.",
  },
  {
    icon: Store,
    title: "Marketplace & Ticari Fırsatlar",
    text: "Talep, teklif, iş birliği ve ticari fırsat akışlarına entegre marka görünürlüğü ve özel proje modelleri.",
  },
];

const advantages = [
  "Sektör ve lokasyon bağlamında yüksek niyetli iş kitlesi",
  "Firma, etkinlik, haber, fırsat ve kariyer akışlarının aynı ekosistemde buluşması",
  "Display + içerik + sponsorluk + marketplace modellerinin birlikte planlanabilmesi",
  "Standart paket yerine hedefe göre özel medya ve içerik planı",
];

export default function AdvertisePage() {
  return (
    <div className="-mx-4 -my-8 bg-slate-50 text-secondary">
      <section className="relative overflow-hidden bg-secondary px-4 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 bg-primary/15 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <Target size={14} /> Reklam & İş Birliği
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black uppercase tracking-tight md:text-6xl">
              İş dünyasının doğru anlarında <span className="text-primary">markanızla görünür olun.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Sektörel Ajanda; firmaları, sektörleri, etkinlikleri, haberleri ve ticari fırsatları aynı platformda buluşturur. Markanızı yalnız erişim için değil, doğru bağlam ve doğru iş kitlesi için konumlandırırız.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:iletisim@sektorelajanda.com?subject=Sektörel%20Ajanda%20Reklam%20ve%20İş%20Birliği" className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-primary-hover">
                Teklif İsteyin <ArrowRight size={16} />
              </a>
              <Link href="/iletisim" className="inline-flex items-center justify-center border border-white/20 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/10">
                İletişime Geçin
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Reklam Modelleri</span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">Tek format değil, bütünleşik görünürlük.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">Hedefinize göre tek bir model veya birden fazla temas noktasını birleştiren özel plan oluşturabiliriz.</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {models.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary"><Icon size={21} /></span>
                <h3 className="mt-5 text-lg font-black uppercase tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Neden Sektörel Ajanda?</span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">İş niyetinin yüksek olduğu ekosistemde yer alın.</h2>
            <div className="mt-7 space-y-4">
              {advantages.map((item) => (
                <div key={item} className="flex gap-3 border-b border-slate-100 pb-4">
                  <BadgeCheck className="mt-0.5 shrink-0 text-primary" size={20} />
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary p-7 text-white md:p-9">
            <div className="flex items-center gap-3 text-primary"><Layers3 size={22} /><span className="text-xs font-black uppercase tracking-[0.2em]">Özel Proje</span></div>
            <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">Standart paketlere bağlı değilsiniz.</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">Ürün lansmanı, sektör sahipliği, etkinlik dönemi, B2B lead üretimi veya marka bilinirliği gibi hedefler için özel medya ve içerik modeli tasarlayabiliriz.</p>
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">Creative & Media Partner</p>
              <p className="mt-1 font-black text-white">Hip Creative Performance Media Partner</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <Mail className="mx-auto text-primary" size={30} />
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight">Markanız için doğru modeli birlikte kuralım.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">Hedef kitlenizi, kampanya amacınızı ve dönem bilgisini paylaşın. Size uygun reklam ve iş birliği planını hazırlayalım.</p>
          <a href="mailto:iletisim@sektorelajanda.com?subject=Sektörel%20Ajanda%20Reklam%20ve%20İş%20Birliği" className="mt-7 inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-primary-hover">
            iletisim@sektorelajanda.com <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
