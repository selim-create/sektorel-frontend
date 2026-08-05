import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Ticari Fırsatlar ve Alım Talepleri",
  description: "Alım taleplerini, satış ilanlarını, bayilik ve hizmet fırsatlarını keşfedin; işletmeniz için yeni ticari bağlantılar kurun.",
  path: "/firsatlar",
  collectionName: "Sektörel Ajanda Ticari Fırsatlar",
};

export const metadata = createListingMetadata(seo);

export default function OpportunitiesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
