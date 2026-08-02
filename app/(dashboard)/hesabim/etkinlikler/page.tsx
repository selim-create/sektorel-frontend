import OwnedContentManager from "@/components/dashboard/OwnedContentManager";

export default function OwnedEventsPage() {
  return (
    <OwnedContentManager
      title="Etkinliklerim"
      description="Oluşturduğunuz etkinlik kayıtlarını ve yayın durumlarını buradan takip edin."
      types={["event"]}
    />
  );
}
