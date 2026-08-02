export type TaxonomyNode = {
  name?: string | null;
  slug?: string | null;
};

export type MapCompany = {
  id: string;
  title?: string | null;
  slug?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    mapLat?: string | null;
    mapLng?: string | null;
  } | null;
  sectors?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
  locations?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
};

export type MappedCompany = MapCompany & {
  lat: number;
  lng: number;
};
