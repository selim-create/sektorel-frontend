import Link from "next/link";
import { Scale } from "lucide-react";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  updatedAt?: string;
  sections: LegalSection[];
};

export default function LegalPage({
  eyebrow = "Yasal & Bilgilendirme",
  title,
  description,
  updatedAt = "24 Ağustos 2026",
  sections,
}: LegalPageProps) {
  return (
    <div className="mx-auto max-w-5xl py-6 md:py-12">
      <header className="border border-gray-200 bg-white p-7 shadow-sm md:p-10">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
          <Scale size={15} /> {eyebrow}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-secondary md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">{description}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">Son güncelleme: {updatedAt}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit border border-gray-200 bg-white p-5 lg:sticky lg:top-28">
          <p className="text-xs font-black uppercase tracking-wider text-secondary">Yasal Belgeler</p>
          <nav className="mt-4 space-y-2 text-sm">
            <Link className="block text-gray-600 hover:text-primary" href="/kullanim-kosullari">Kullanım Koşulları</Link>
            <Link className="block text-gray-600 hover:text-primary" href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link className="block text-gray-600 hover:text-primary" href="/cerez-politikasi">Çerez Politikası</Link>
            <Link className="block text-gray-600 hover:text-primary" href="/cerez-tercihleri">Çerez Tercihleri</Link>
            <Link className="block text-gray-600 hover:text-primary" href="/kvkk">KVKK</Link>
            <Link className="block text-gray-600 hover:text-primary" href="/aydinlatma-metni">Aydınlatma Metni</Link>
          </nav>
        </aside>

        <article className="space-y-6">
          {sections.map((section) => (
            <section className="border border-gray-200 bg-white p-6 shadow-sm md:p-8" key={section.title}>
              <h2 className="text-xl font-black text-secondary md:text-2xl">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base md:leading-8" key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-600 md:text-base">
                  {section.bullets.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="border border-primary/20 bg-orange-50 p-6 md:p-8">
            <h2 className="text-lg font-black text-secondary">İletişim</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Bu metinlerle veya kişisel verilerinizle ilgili sorularınız için
              {" "}<a className="font-bold text-primary hover:underline" href="mailto:iletisim@sektorelajanda.com">iletisim@sektorelajanda.com</a>
              {" "}adresinden bize ulaşabilirsiniz.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
