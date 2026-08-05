import ListingSeo, { createListingMetadata } from "@/components/seo/ListingSeo";

const seo = {
  title: "Sektörel Ajanda ve Etkinlik Takvimi",
  description: "Fuarları, konferansları, zirveleri, resmi takvimleri ve sektörel etkinlikleri tek ajandada takip edin.",
  path: "/ajanda",
  collectionName: "Sektörel Ajanda Etkinlik Takvimi",
};

export const metadata = createListingMetadata(seo);

export default function EventsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ListingSeo {...seo} />
      {children}
    </>
  );
}
