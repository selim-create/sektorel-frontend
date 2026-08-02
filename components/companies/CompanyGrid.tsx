import CompanyCard from "@/components/companies/CompanyCard";

type TaxonomyNode = {
  name?: string | null;
  slug?: string | null;
};

type Company = {
  id: string;
  title?: string | null;
  slug?: string | null;
  companyDetails?: {
    isVerified?: boolean | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  sectors?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
  locations?: {
    nodes?: Array<TaxonomyNode | null> | null;
  } | null;
};

type CompanyGridProps = {
  companies: Company[];
  featured?: boolean;
};

export default function CompanyGrid({ companies, featured = false }: CompanyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard company={company} featured={featured} key={company.id} />
      ))}
    </div>
  );
}
