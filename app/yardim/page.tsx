import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleHelp,
  FilePlus2,
  Handshake,
  Mail,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Yardım ve Destek",
  description:
    "Sektörel Ajanda üyelik, firma ekleme ve sahiplenme, etkinlikler, fırsatlar, kariyer ve hesap yönetimi için yardım merkezi.",
  alternates: { canonical: "/yardim" },
};

const topics = [
  {
    title: "Üyelik & Hesap",
    icon: UserPlus,
    description: "Kayıt olma, giriş yapma ve hesap ayarlarıyla ilgili temel adımlar.",
    links: [
      ["Nasıl üye olurum?", "#uyelik"],
      ["Şifremi unuttum", "#sifre"],
      ["Kurumsal hesaba nasıl geçerim?", "#kurumsal-hesap"],
    ],
  },
  {
    title: "Firma Profili",
    icon: Building2,
    description: "Firma ekleme, mevcut firmayı sahiplenme ve profil yönetimi.",
    links: [
      ["Firma nasıl eklenir?", "#firma-ekleme"],
      ["Firma nasıl sahiplenilir?", "#firma-sahiplenme"],
      ["Firma bilgileri nasıl güncellenir?", "#firma-yonetimi"],
    ],
  },
  {
    title: "Etkinlikler",
    icon: CalendarDays,
    description: "Etkinlik ekleme, kişisel takvime aktarma ve hatırlatma oluşturma.",
    links: [
      ["Etkinlik nasıl eklenir?", "#etkinlik-ekleme"],
      ["Takvime nasıl eklenir?", "#takvime-ekleme"],
      ["Hatırlatma nasıl kurulur?", "#hatirlatma"],
    ],
  },
  {
    title: "Fırsatlar & Teklifler",
    icon: Handshake,
    description: "Ticari fırsat oluşturma, inceleme ve teklif akışları.",
    links: [
      ["Fırsat nasıl oluşturulur?", "#firsat"],
      ["Teklif nasıl verilir?", "#teklif"],
    ],
  },
  {
    title: "İK & Kariyer",
    icon: FilePlus2,
    description: "İş ilanı verme ve ilanlara başvuru akışları.",
    links: [
      ["İş ilanı nasıl verilir?", "#is-ilani"],
      ["İş ilanına nasıl başvurulur?", "#is-basvurusu"],
    ],
  },
  {
    title: "Ekip & Yetkiler",
    icon: Users,
    description: "Kurumsal hesapta ekip üyeleri ve içerik yönetimi.",
    links: [["Ekip kullanıcıları nasıl yönetilir?", "#ekip"]],
  },
];

const guides = [
  {
    id: "uyelik",
    title: "Nasıl üye olurum?",
    steps: [
      "Üst menüdeki Kayıt Ol bağlantısını açın.",
      "İstenen hesap bilgilerini doldurun ve kaydı tamamlayın.",
      "Hesabınızla giriş yaptıktan sonra Hesabım alanından profil ve kurumsal işlemlerinizi yönetebilirsiniz.",
    ],
    action: ["Kayıt Ol", "/kayit"],
  },
  {
    id: "sifre",
    title: "Şifremi unuttum",
    steps: [
      "Giriş ekranındaki Şifremi Unuttum bağlantısını açın.",
      "Hesabınızda kullandığınız e-posta adresini girin.",
      "Gönderilen bağlantı üzerinden yeni şifrenizi belirleyin.",
    ],
    action: ["Şifre Yenileme", "/sifremi-unuttum"],
  },
  {
    id: "kurumsal-hesap",
    title: "Kurumsal hesaba nasıl geçerim?",
    steps: [
      "Yeni bir firma oluşturabilir veya rehberde zaten bulunan firmanız için sahiplenme talebi gönderebilirsiniz.",
      "Firma sahiplenme talepleri yönetici kontrolünden geçer; onay verilmeden firma hesabınıza aktarılmaz.",
      "Onaydan sonra firma yönetimi kurumsal hesabınıza bağlanır.",
    ],
  },
  {
    id: "firma-ekleme",
    title: "Firma nasıl eklenir?",
    steps: [
      "Firma Ekle sayfasını açın ve firma bilgilerini eksiksiz doldurun.",
      "Sektör, konum ve iletişim bilgilerini mümkün olduğunca doğru girin.",
      "Gönderim sonrasında kayıt sistemdeki kontrol ve yayın akışına göre işlenir.",
    ],
    action: ["Firma Ekle", "/firma-ekle"],
  },
  {
    id: "firma-sahiplenme",
    title: "Mevcut firma nasıl sahiplenilir?",
    steps: [
      "Firma Rehberi'nden firmanızın profilini bulun.",
      "Firma sahipsizse profil üzerinde Bu Firma Sizin mi? alanı görünür.",
      "Giriş yaptıktan sonra Sahiplenme Talebi Gönder aksiyonunu kullanın.",
      "Talep yönetici tarafından incelenir. Onaylandığında firma hesabınıza bağlanır ve yönetilebilir hale gelir.",
    ],
    action: ["Firma Rehberi", "/firmalar"],
  },
  {
    id: "firma-yonetimi",
    title: "Firma bilgileri nasıl güncellenir?",
    steps: [
      "Firmanız hesabınıza bağlıysa Yönetim Paneli'ni açın.",
      "İçerik ve firma profil yönetimi alanlarından size açık olan bilgileri güncelleyin.",
      "Ekip üyeleriniz varsa erişim yetkilerine göre aynı kurumsal alanı kullanabilirler.",
    ],
    action: ["Yönetim Paneli", "/hesabim"],
  },
  {
    id: "etkinlik-ekleme",
    title: "Etkinlik nasıl eklenir?",
    steps: [
      "Etkinlik Ekle sayfasını açın.",
      "Etkinlik adı, tarih, konum ve gerekli detayları doldurun.",
      "Gönderilen etkinlikler yayın akışına göre kontrol edilir; gönderim doğrudan herkese açık yayın garantisi vermez.",
    ],
    action: ["Etkinlik Ekle", "/ajanda/etkinlik-ekle"],
  },
  {
    id: "takvime-ekleme",
    title: "Etkinliği takvimime nasıl eklerim?",
    steps: [
      "İlgilendiğiniz etkinliğin detay sayfasını açın.",
      "Takvime Ekle aksiyonunu kullanın.",
      "Sunulan takvim seçeneğini seçerek etkinliği kişisel takviminize aktarın.",
    ],
    action: ["Etkinlikleri Gör", "/ajanda"],
  },
  {
    id: "hatirlatma",
    title: "Etkinlik hatırlatması nasıl oluşturulur?",
    steps: [
      "Etkinlik detayında hatırlatma alanını açın.",
      "Hatırlatma için giriş yapmış olmanız gerekir.",
      "1 gün, 3 gün veya 1 hafta önce seçeneklerinden birini belirleyebilirsiniz.",
      "Aktif hatırlatmayı daha sonra güncelleyebilir veya iptal edebilirsiniz.",
    ],
  },
  {
    id: "firsat",
    title: "Ticari fırsat nasıl oluşturulur?",
    steps: [
      "Fırsatlar bölümündeki Fırsat Oluştur ekranını açın.",
      "İhtiyacı veya iş birliği fırsatını açık ve anlaşılır biçimde girin.",
      "Gönderimden sonra fırsat, sistemdeki içerik ve yayın akışına göre işlenir.",
    ],
    action: ["Fırsat Oluştur", "/firsatlar/olustur"],
  },
  {
    id: "teklif",
    title: "Bir fırsata nasıl teklif verilir?",
    steps: [
      "Fırsatlar sayfasından ilgili ilanı açın.",
      "İlan detayındaki teklif aksiyonunu kullanın.",
      "İstenen bilgileri doldurup teklifinizi gönderin.",
    ],
    action: ["Fırsatları Gör", "/firsatlar"],
  },
  {
    id: "is-ilani",
    title: "İş ilanı nasıl verilir?",
    steps: [
      "İK & Kariyer bölümündeki İlan Ver ekranını açın.",
      "Pozisyon, çalışma biçimi ve ilan detaylarını doldurun.",
      "İlanınız sistemdeki yayın akışına göre işlenir.",
    ],
    action: ["İlan Ver", "/kariyer/ilan-ver"],
  },
  {
    id: "is-basvurusu",
    title: "İş ilanına nasıl başvurulur?",
    steps: [
      "Kariyer sayfasından ilgilendiğiniz ilanı açın.",
      "İlan detayındaki Başvur aksiyonunu kullanın.",
      "Başvuru formunu ve gerekli belgeleri tamamlayıp gönderin.",
    ],
    action: ["İlanları Gör", "/kariyer"],
  },
  {
    id: "ekip",
    title: "Ekip kullanıcıları nasıl yönetilir?",
    steps: [
      "Kurumsal hesabınızda Yönetim Paneli'ni açın.",
      "Kullanıcılar alanı yetkiniz varsa ekip üyelerini ve rollerini yönetmek için kullanılır.",
      "Sahiplik ve yetki kontrolleri firma hesabı üzerinden uygulanır; erişemediğiniz bir işlem için firma sahibinizle iletişime geçin.",
    ],
    action: ["Yönetim Paneli", "/hesabim"],
  },
];

export default function HelpPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-800 bg-secondary px-4 py-16 text-white md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-primary">Yardım Merkezi</span>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Sektörel Ajanda'yı kullanmak için ihtiyacınız olan her şey.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">Üyelikten firma sahiplenmeye, etkinliklerden ticari fırsatlara kadar temel işlemleri adım adım öğrenin.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map(({ title, icon: Icon, description, links }) => (
            <article key={title} className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center bg-orange-50 text-primary"><Icon size={21} /></div>
              <h2 className="mt-5 text-lg font-black text-secondary">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                {links.map(([label, href]) => (
                  <Link key={href} href={href} className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 transition hover:text-primary">
                    {label}<ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Adım Adım Rehberler</span>
            <h2 className="mt-3 text-3xl font-black text-secondary md:text-4xl">En sık yapılan işlemler</h2>
          </div>
          <div className="space-y-5">
            {guides.map((guide, index) => (
              <article id={guide.id} key={guide.id} className="scroll-mt-28 border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center bg-secondary text-xs font-black text-white">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="text-xl font-black text-secondary">{guide.title}</h3>
                    </div>
                    <ol className="mt-5 space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={step} className="flex gap-3 text-sm leading-6 text-slate-600">
                          <span className="mt-0.5 font-black text-primary">{stepIndex + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {guide.action ? (
                    <Link href={guide.action[1]} className="inline-flex shrink-0 items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-secondary transition hover:border-primary hover:text-primary">
                      {guide.action[0]} <ArrowRight size={14} />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-secondary p-8 text-white md:p-10">
            <div className="flex h-11 w-11 items-center justify-center bg-primary text-white"><CircleHelp size={22} /></div>
            <h2 className="mt-5 text-2xl font-black">Aradığınız yanıtı bulamadınız mı?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Teknik sorun, hesap erişimi, firma sahiplenme veya içerik işlemleri için Sektörel Ajanda ekibine doğrudan ulaşabilirsiniz.</p>
            <a href="mailto:iletisim@sektorelajanda.com?subject=Sektörel%20Ajanda%20Destek" className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover">
              <Mail size={15} /> Destek Ekibine Yaz
            </a>
          </div>
          <div className="border border-slate-200 bg-white p-8 md:p-10">
            <ShieldCheck className="text-primary" size={28} />
            <h2 className="mt-4 text-xl font-black text-secondary">Güvenli işlem</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Firma sahiplenme gibi yetki değiştiren işlemler doğrudan aktarım yapmaz. Talep önce kontrol edilir; onay sonrasında sahiplik hesabınıza bağlanır.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
