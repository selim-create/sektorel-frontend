import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { ArrowUpRight } from "lucide-react";

const navGroups = [
  {
    index: "01",
    title: "Keşfet",
    links: [
      { label: "Firma Rehberi", href: "/firmalar" },
      { label: "Sektörler", href: "/sektorler" },
      { label: "Etkinlik Ajandası", href: "/ajanda" },
      { label: "Haberler", href: "/haberler" },
    ],
  },
  {
    index: "02",
    title: "İş Dünyası",
    links: [
      { label: "Ticari Fırsatlar", href: "/firsatlar" },
      { label: "İK & Kariyer", href: "/kariyer" },
      { label: "Haritada Keşfet", href: "/harita" },
      { label: "Firma Ekle", href: "/firma-ekle" },
    ],
  },
  {
    index: "03",
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Reklam Verin", href: "/reklam-verin" },
      { label: "Yardım & Destek", href: "/yardim" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
];

const utilityLinks = [
  { label: "Etkinlik Ekle", href: "/ajanda/etkinlik-ekle" },
  { label: "Fırsat Oluştur", href: "/firsatlar/olustur" },
  { label: "İş İlanı Ver", href: "/kariyer/ilan-ver" },
];

const legalLinks = [
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  { label: "Gizlilik", href: "/gizlilik-politikasi" },
  { label: "Çerezler", href: "/cerez-politikasi" },
  { label: "KVKK", href: "/kvkk" },
];

export default function Footer() {
  return (
    <footer className="mt-20 overflow-hidden bg-[#0a0e14] text-white">
      <section className="border-y border-[#ded7cc] bg-[#f4efe7] text-secondary">
        <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-16">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Sektörel Ajanda Bülteni
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-black leading-[1.05] tracking-[-0.035em] text-[#111827] md:text-5xl">
              İş dünyasında ne değişiyor, haftanın özetinde görün.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Gündem, yaklaşan etkinlikler, mevzuat ve yeni fırsatlar. Gereksiz kalabalık olmadan, seçilmiş başlıklarla.
            </p>
          </div>

          <NewsletterForm source="sektorel-ajanda_footer" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-18 lg:py-20">
        <div className="grid gap-14 xl:grid-cols-[1.05fr_1.45fr] xl:gap-24">
          <div>
            <Link href="/" aria-label="Sektörel Ajanda ana sayfa" className="inline-block">
              <img src="/sektorel-ajanda-logo-white.svg" alt="Sektörel Ajanda" className="h-11 w-auto md:h-12" />
            </Link>

            <p className="mt-7 max-w-lg text-lg font-medium leading-8 text-slate-300 md:text-xl">
              Türkiye&apos;nin sektörlerini, firmalarını ve iş dünyası gündemini aynı yerde buluşturan keşif platformu.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
              Firmaları keşfedin, etkinlikleri takip edin, ticari fırsatları ve kariyer hareketlerini tek merkezden izleyin.
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Platforma katkıda bulun</p>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {utilityLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 transition hover:text-primary">
                    {link.label} <ArrowUpRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-7">
            {navGroups.map((group) => (
              <div key={group.title} className="border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">{group.title}</h3>
                  <span className="text-[10px] font-bold tabular-nums text-slate-700">{group.index}</span>
                </div>
                <nav className="mt-6 space-y-3.5">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="group flex items-center justify-between gap-3 text-sm text-slate-400 transition hover:text-white">
                      <span>{link.label}</span>
                      <ArrowUpRight size={13} className="translate-y-0.5 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 bg-black/10">
        <div className="container mx-auto flex flex-col gap-5 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:gap-3">
            <span>© 2026 Sektörel Ajanda</span>
            <span className="hidden text-white/10 sm:inline">/</span>
            <span>Bir Hip Medya markasıdır.</span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-600">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-slate-300">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
