import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Sektörler",
  description: "Türkiye'deki sektörleri ve alt sektörleri keşfedin; ilgili firmalara, haberlere, etkinliklere ve iş fırsatlarına ulaşın.",
  path: "/sektorler",
  collectionName: "Sektörel Ajanda Sektörler Dizini",
};

export const metadata = createListingMetadata(seo);

export default function SectorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
