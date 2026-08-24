import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Aydınlatma Metni | Sektörel Ajanda",
  description: "Sektörel Ajanda kişisel veri işleme aydınlatma metnini inceleyin.",
  alternates: { canonical: "/aydinlatma-metni" },
};

export default function DisclosurePage() {
  return (
    <LegalPage
      title="Aydınlatma Metni"
      description="Hip Medya Limited Şirketi tarafından Sektörel Ajanda hizmetleri kapsamında işlenen kişisel verilere ilişkin aydınlatma metni."
      sections={[
        { title: "1. Veri sorumlusu", paragraphs: ["6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu Hip Medya Limited Şirketi'dir. Adres: Caferağa Mah. Şifa Sk. No: 19 Kadıköy/İstanbul. Sektörel Ajanda iletişim adresi: iletisim@sektorelajanda.com."] },
        { title: "2. Kişisel verilerin toplanma yöntemleri", paragraphs: ["Kişisel veriler; üyelik ve hesap formları, firma/etkinlik/fırsat/ilan işlemleri, sahiplenme talepleri, destek iletişimleri, platform kullanım kayıtları ve tarayıcı depolama teknolojileri üzerinden elektronik ortamda toplanabilir."] },
        { title: "3. İşlenen veri kategorileri", bullets: ["Kimlik ve hesap verileri", "İletişim verileri", "Firma ve mesleki bilgiler", "İşlem ve talep kayıtları", "İçerik, etkinlik, fırsat, teklif, ilan ve başvuru bilgileri", "Oturum, cihaz, güvenlik ve kullanım verileri", "Tercih ve onay kayıtları"] },
        { title: "4. İşleme amaçları", bullets: ["Üyelik, oturum ve hesap güvenliğini sağlamak", "Firma profili, sahiplenme ve ekip yönetimi süreçlerini yürütmek", "Etkinlik, takvim, hatırlatma ve içerik hizmetlerini sunmak", "Fırsat, teklif, marketplace ve kariyer işlevlerini yürütmek", "Destek taleplerini yanıtlamak", "Kötüye kullanım, hata ve güvenlik olaylarını önlemek", "Açık tercih verilmesi halinde analitik ve reklam ölçümü yapmak", "Mevzuattan doğan yükümlülükleri yerine getirmek"] },
        { title: "5. Hukuki sebepler", paragraphs: ["Kişisel veriler; sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun hukuki yükümlülüğü, bir hakkın tesisi/kullanılması/korunması, temel hak ve özgürlüklere zarar vermemek kaydıyla meşru menfaat ve ilgili işlemlerde açık rıza gibi Kanunda öngörülen hukuki sebeplere dayanılarak işlenebilir."] },
        { title: "6. Aktarım", paragraphs: ["Veriler; teknik altyapı ve barındırma hizmet sağlayıcıları, e-posta ve güvenlik hizmetleri gibi hizmetin sunulması için gerekli iş ortaklarıyla; yasal yükümlülük halinde yetkili kurumlarla ve işlemin niteliği gerektiriyorsa ilgili taraflarla sınırlı ve ölçülü şekilde paylaşılabilir."] },
        { title: "7. Haklar ve başvuru", paragraphs: ["KVKK kapsamındaki haklarınıza ilişkin taleplerinizi iletisim@sektorelajanda.com adresine iletebilirsiniz. Ayrıntılı hak listesi için KVKK sayfasını inceleyebilirsiniz."] },
      ]}
    />
  );
}
