import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, MapPinned, Newspaper } from "lucide-react";

const linkGroups = [
  {
    title: "Keşfet",
    icon: MapPinned,
    links: [
      { label: "Firma Rehberi", href: "/firmalar" },
      { label: "Sektörler", href: "/sektorler" },
      { label: "Haritada Keşfet", href: "/harita" },
    ],
  },
  {
    title: "İçerik & Ajanda",
    icon: Newspaper,
    links: [
      { label: "Haberler", href: "/haberler" },
      { label: "Etkinlikler", href: "/ajanda" },
      { label: "Fırsatlar", href: "/firsatlar" },
      { label: "İK & Kariyer", href: "/kariyer" },
    ],
  },
  {
    title: "Hızlı İşlemler",
    icon: BriefcaseBusiness,
    links: [
      { label: "Firma Ekle", href: "/firma-ekle" },
      { label: "Etkinlik Ekle", href: "/ajanda/etkinlik-ekle" },
      { label: "Fırsat Oluştur", href: "/firsatlar/olustur" },
      { label: "İş İlanı Ver", href: "/kariyer/ilan-ver" },
    ],
  },
  {
    title: "Kurumsal",
    icon: Building2,
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Reklam Verin", href: "/reklam-verin" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-secondary text-white">
      <div className="border-b border-white/10 bg-white/[0.03]">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Firmanız Sektörel Ajanda&apos;da mı?</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Firma profilinizi oluşturun veya mevcut profilinizi yönetin.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Firma bilgilerinizi güncel tutun; sektörünüz, etkinlikleriniz, iş fırsatlarınız ve kariyer ilanlarınızla doğru kitleye ulaşın.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Link href="/firma-ekle" className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover">
              Firma Ekle <ArrowRight size={15} />
            </Link>
            <Link href="/firmalar" className="inline-flex items-center justify-center border border-white/20 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-white/40 hover:bg-white/10">
              Firma Rehberini Aç
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.35fr_repeat(4,1fr)] xl:gap-8">
          <div className="max-w-sm">
            <Link href="/" aria-label="Sektörel Ajanda ana sayfa" className="inline-block">
              <img src="/sektorel-ajanda-logo-white.svg" alt="Sektörel Ajanda" className="h-10 w-auto" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-400">Türkiye&apos;deki firmaları, sektörleri, etkinlikleri, haberleri, ticari fırsatları ve kariyer ilanlarını tek merkezde buluşturan iş dünyası platformu.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <span className="border border-white/10 bg-white/5 px-3 py-2">Firma Rehberi</span>
              <span className="border border-white/10 bg-white/5 px-3 py-2">Sektörel Ajanda</span>
              <span className="border border-white/10 bg-white/5 px-3 py-2">İş Fırsatları</span>
            </div>
          </div>

          {linkGroups.map(({ title, icon: Icon, links }) => (
            <div key={title}>
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center bg-primary/15 text-primary">
                  <Icon size={16} />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">{title}</h3>
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sektörel Ajanda. Tüm hakları saklıdır.</p>
          <p>Sektörel Ajanda, Hip Medya markasıdır.</p>
        </div>
      </div>
    </footer>
  );
}
