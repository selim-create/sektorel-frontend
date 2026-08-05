import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Firma Rehberi",
  description: "Türkiye genelindeki firmaları sektör, şehir ve doğrulanma durumuna göre keşfedin; şirket profillerini ve iletişim bilgilerini inceleyin.",
  path: "/firmalar",
  collectionName: "Sektörel Ajanda Firma Rehberi",
};

export const metadata = createListingMetadata(seo);

export default function CompaniesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
