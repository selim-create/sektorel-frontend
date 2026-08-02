import OwnedContentManager from "@/components/dashboard/OwnedContentManager";

export default function OwnedListingsPage() {
  return (
    <OwnedContentManager
      title="İlanlarım & Taleplerim"
      description="Yayınladığınız iş ilanlarını ve ticari talepleri buradan yönetin."
      types={["career", "lead"]}
      createHref="/kariyer/ilan-ver"
      createLabel="Yeni İlan Ver"
    />
  );
}
