import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { ArrowRight } from "lucide-react";

const primaryLinks = [
  { label: "Firma Rehberi", href: "/firmalar" },
  { label: "Sektörler", href: "/sektorler" },
  { label: "Etkinlikler", href: "/ajanda" },
  { label: "Haberler", href: "/haberler" },
  { label: "Fırsatlar", href: "/firsatlar" },
  { label: "İK & Kariyer", href: "/kariyer" },
];

const corporateLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Reklam Verin", href: "/reklam-verin" },
  { label: "Yardım & Destek", href: "/yardim" },
  { label: "İletişim", href: "/iletisim" },
];

const quickActions = [
  { label: "Firma Ekle", href: "/firma-ekle" },
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
    <footer className="mt-16 border-t border-slate-200 bg-secondary text-white">
      <NewsletterForm source="sektorel-ajanda_footer" />

      <div className="container mx-auto px-4 py-11 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr] lg:gap-14">
          <div className="max-w-xl">
            <Link href="/" aria-label="Sektörel Ajanda ana sayfa" className="inline-block">
              <img src="/sektorel-ajanda-logo-white.svg" alt="Sektörel Ajanda" className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
              Türkiye&apos;deki firmaları, sektörleri, etkinlikleri, haberleri, ticari fırsatları ve kariyer ilanlarını tek merkezde buluşturan iş dünyası platformu.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="inline-flex items-center gap-1.5 border border-white/12 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-slate-300 transition hover:border-primary/60 hover:text-white"
                >
                  {action.label} <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Keşfet</p>
            <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sektörel Ajanda</p>
            <nav className="mt-5 space-y-3">
              {corporateLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-slate-400 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-xs leading-5 text-slate-500">Firmanızın profilini oluşturun, etkinliklerinizi ve fırsatlarınızı doğru kitleyle buluşturun.</p>
              <Link href="/firma-ekle" className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary transition hover:text-white">
                Firma profilini oluştur <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-5 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>© 2026 Sektörel Ajanda. Tüm hakları saklıdır.</p>
            <span className="hidden text-white/15 sm:inline">•</span>
            <p>Sektörel Ajanda, Hip Medya markasıdır.</p>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
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
