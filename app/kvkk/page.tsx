import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KVKK | Sektörel Ajanda",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki haklarınızı inceleyin.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki temel haklarınız ve Sektörel Ajanda'ya başvuru yolları."
      sections={[
        { title: "1. Veri sorumlusu", paragraphs: ["Veri sorumlusu Hip Medya Limited Şirketi'dir. Sektörel Ajanda, Hip Medya Limited Şirketi tarafından işletilmektedir. İş yeri adresi: Caferağa Mah. Şifa Sk. No: 19 Kadıköy/İstanbul."] },
        { title: "2. Kanun kapsamındaki haklarınız", bullets: ["Kişisel verilerinizin işlenip işlenmediğini öğrenme", "İşlenmişse buna ilişkin bilgi talep etme", "İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme", "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme", "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme", "Kanuni şartlar oluştuğunda silinmesini veya yok edilmesini isteme", "Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme", "Münhasıran otomatik sistemlerle analiz sonucunda aleyhinize bir sonuç doğmasına itiraz etme", "Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme"] },
        { title: "3. Başvuru yöntemi", paragraphs: ["Haklarınıza ilişkin taleplerinizi iletisim@sektorelajanda.com adresine iletebilirsiniz. Başvurunun güvenli biçimde sonuçlandırılabilmesi için kimliğinizi ve talebinizin kapsamını doğrulamaya yönelik bilgi talep edilebilir."] },
        { title: "4. Başvuruların değerlendirilmesi", paragraphs: ["Başvurular ilgili mevzuatta öngörülen usul ve süreler çerçevesinde değerlendirilir. Talebin niteliğine göre ek bilgi veya belge istenebilir."] },
      ]}
    />
  );
}
