import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Sektörel Haberler",
  description: "Sektörlerden güncel haberleri, mevzuat gelişmelerini, şirket duyurularını ve iş dünyasına yön veren içerikleri takip edin.",
  path: "/haberler",
  collectionName: "Sektörel Ajanda Haberler",
};

export const metadata = createListingMetadata(seo);

export default function NewsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
