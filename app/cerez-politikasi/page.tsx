import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Çerez Politikası | Sektörel Ajanda",
  description: "Sektörel Ajanda çerez ve benzeri depolama teknolojileri politikasını inceleyin.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="Bu politika, Sektörel Ajanda'da kullanılan çerezleri ve benzeri tarayıcı depolama teknolojilerini açıklar."
      sections={[
        { title: "1. Çerez ve benzeri teknolojiler", paragraphs: ["Çerezler, localStorage ve sessionStorage gibi tarayıcı depolama teknolojileri; oturumun sürdürülmesi, tercihlerin hatırlanması, güvenlik ve isteğe bağlı ölçüm işlevleri için kullanılabilir."] },
        { title: "2. Gerekli teknolojiler", paragraphs: ["Hesap oturumu, güvenlik, sayfa işlevleri ve temel kullanıcı tercihlerinin çalışması için gerekli teknolojiler devre dışı bırakılamaz. Bunlar reklam veya pazarlama amacıyla kullanılmaz."] },
        { title: "3. Analitik", paragraphs: ["Analitik teknolojiler, sitenin nasıl kullanıldığını ve performansını anlamamıza yardımcı olur. Bu kategori yalnızca kullanıcının izin vermesi halinde etkinleştirilir."] },
        { title: "4. Reklam ve kişiselleştirme", paragraphs: ["Reklam ölçümü, kampanya performansı ve kişiselleştirme amaçlı teknolojiler yalnızca açık tercih verilmesi halinde etkinleştirilebilir."] },
        { title: "5. Mevcut tarayıcı depolamaları", bullets: ["Oturum/access token sürekliliği için sessionStorage", "Arama geçmişi gibi kullanıcı tercihlerinde localStorage", "Ajanda görünüm tercihleri ve benzeri arayüz ayarlarında localStorage", "Çerez tercih kaydının localStorage'da saklanması"] },
        { title: "6. Tercihlerinizi değiştirme", paragraphs: ["Çerez Tercihleri sayfasından analitik ve reklam kategorilerini istediğiniz zaman değiştirebilirsiniz. Tarayıcı ayarlarınızdan da depolanan verileri silebilirsiniz; ancak gerekli depolamaların silinmesi oturumun kapanmasına veya bazı özelliklerin yeniden ayarlanmasına neden olabilir."] },
      ]}
    />
  );
}
