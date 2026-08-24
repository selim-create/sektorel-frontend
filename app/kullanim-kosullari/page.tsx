import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Sektörel Ajanda",
  description: "Sektörel Ajanda platformunun kullanım koşullarını inceleyin.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      description="Bu koşullar, Sektörel Ajanda web sitesi ve bağlı dijital hizmetlerin kullanımına ilişkin temel kuralları açıklar."
      sections={[
        { title: "1. Taraflar ve kapsam", paragraphs: ["Sektörel Ajanda, Hip Medya Limited Şirketi tarafından işletilen bir iş dünyası platformudur. Siteyi ziyaret ederek veya hesap oluşturarak bu koşulları kabul etmiş olursunuz."] },
        { title: "2. Platform hizmetleri", bullets: ["Firma rehberi ve firma profilleri", "Sektörel haber ve içerikler", "Etkinlik/ajanda, takvim ve hatırlatma işlevleri", "Ticari fırsatlar, teklif ve marketplace akışları", "İş ilanları ve kariyer başvuruları", "Firma sahiplenme ve ekip kullanıcı yönetimi"] },
        { title: "3. Hesap ve güvenlik", paragraphs: ["Kullanıcı, hesap bilgilerinin doğruluğundan ve hesabının güvenliğinden sorumludur. Yetkisiz kullanım şüphesi halinde destek ekibiyle iletişime geçilmelidir. Hesapların kötüye kullanım, yanıltıcı içerik veya güvenlik riski halinde sınırlandırılması mümkündür."] },
        { title: "4. Firma profilleri ve sahiplenme", paragraphs: ["Platformda kamuya açık veya kullanıcılar tarafından sağlanan kaynaklardan oluşturulmuş firma profilleri bulunabilir. Bir firma profilinin sahiplenilmesi otomatik sahiplik transferi anlamına gelmez; talepler kontrol edilerek onaylanır. Firma adına işlem yapan kişinin gerekli yetkiye sahip olması beklenir."] },
        { title: "5. Kullanıcı içerikleri", paragraphs: ["Kullanıcıların eklediği firma bilgileri, etkinlikler, fırsatlar, ilanlar, teklifler ve diğer içeriklerin hukuka uygun, doğru ve üçüncü kişi haklarını ihlal etmeyen nitelikte olması gerekir. Platform gerekli hallerde içerikleri inceleyebilir, reddedebilir veya kaldırabilir."] },
        { title: "6. Fikri mülkiyet", paragraphs: ["Sektörel Ajanda tasarımı, yazılımı, marka unsurları ve platform tarafından üretilen özgün içerikler ilgili mevzuat kapsamında korunur. Üçüncü kişilere ait marka, logo ve içerikler kendi hak sahiplerine aittir."] },
        { title: "7. Harici bağlantılar ve bilgiler", paragraphs: ["Platform, üçüncü taraf web sitelerine veya hizmetlere bağlantılar içerebilir. Bu hizmetlerin içerik, güvenlik ve gizlilik uygulamalarından ilgili üçüncü taraflar sorumludur. Firma, etkinlik ve ilan bilgilerinin güncelliği için makul kontroller yapılsa da mutlak doğruluk garantisi verilmez."] },
        { title: "8. Değişiklikler", paragraphs: ["Hizmet kapsamı ve bu koşullar mevzuat, ürün veya operasyon değişikliklerine göre güncellenebilir. Güncel metin bu sayfada yayımlanır."] },
      ]}
    />
  );
}
