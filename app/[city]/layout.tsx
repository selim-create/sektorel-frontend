import { CitySectorLinks } from "@/components/location/DirectoryFacetLinks";

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  return (
    <>
      {children}
      <CitySectorLinks citySlug={city} />
    </>
  );
}
