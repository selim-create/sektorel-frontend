import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Sektörel Ajanda",
  description: "Sektörel Ajanda gizlilik politikasını inceleyin.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description="Sektörel Ajanda'yı kullanırken hangi verilerin hangi amaçlarla işlendiğini ve gizlilik yaklaşımımızı açıklar."
      sections={[
        { title: "1. Veri sorumlusu", paragraphs: ["Veri sorumlusu Hip Medya Limited Şirketi'dir. Sektörel Ajanda, Hip Medya Limited Şirketi tarafından işletilen dijital bir markadır."] },
        { title: "2. İşlenebilecek veri kategorileri", bullets: ["Kimlik ve hesap bilgileri", "İletişim bilgileri", "Firma ve mesleki profil bilgileri", "Etkinlik, fırsat, teklif, ilan ve başvuru içerikleri", "Oturum, güvenlik ve cihaz/tarayıcı verileri", "Tercih ve kullanım verileri", "Destek ve iletişim kayıtları"] },
        { title: "3. İşleme amaçları", bullets: ["Üyelik ve oturum yönetimi", "Firma profili oluşturma ve sahiplenme taleplerini yürütme", "Etkinlik, fırsat, teklif ve kariyer hizmetlerini sağlama", "Güvenlik, kötüye kullanım ve hata tespiti", "Kullanıcı deneyimi ve performans geliştirme", "Yasal yükümlülüklerin yerine getirilmesi", "Açık tercih verilmesi halinde analitik ve reklam ölçümü"] },
        { title: "4. Veri paylaşımı", paragraphs: ["Kişisel veriler; hizmetin sağlanması için gerekli teknik hizmet sağlayıcılarla, hukuki yükümlülük halinde yetkili kamu kurumlarıyla ve ilgili işlemin doğası gerektiriyorsa kullanıcı tarafından seçilen taraflarla sınırlı ve amaçla bağlantılı şekilde paylaşılabilir."] },
        { title: "5. Saklama", paragraphs: ["Veriler, ilgili işleme amacı ve yasal saklama yükümlülükleri devam ettiği süre boyunca saklanır; amaç sona erdiğinde mevzuata uygun biçimde silinir, yok edilir veya anonim hale getirilir."] },
        { title: "6. Güvenlik", paragraphs: ["Yetkisiz erişim, veri kaybı veya kötüye kullanımı önlemek amacıyla erişim kontrolü, oturum güvenliği ve teknik/organizasyonel tedbirler uygulanır. Hiçbir internet hizmetinin mutlak güvenlik garantisi vermediği dikkate alınmalıdır."] },
        { title: "7. Haklarınız", paragraphs: ["6698 sayılı Kanun kapsamındaki başvuru haklarınızı kullanmak için iletisim@sektorelajanda.com adresinden bizimle iletişime geçebilirsiniz. Kimliğin doğrulanması veya başvurunun kapsamının netleştirilmesi için ek bilgi talep edilebilir."] },
      ]}
    />
  );
}
