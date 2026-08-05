import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Kariyer ve İş İlanları",
  description: "Sektörlere göre güncel iş ilanlarını, staj fırsatlarını ve kariyer seçeneklerini inceleyin; yeni işinize ulaşın.",
  path: "/kariyer",
  collectionName: "Sektörel Ajanda Kariyer İlanları",
};

export const metadata = createListingMetadata(seo);

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
