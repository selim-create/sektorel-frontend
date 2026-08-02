import { queryWithFallback } from "@/lib/graphql-client";
import { GET_COMPANIES } from "@/lib/queries";
import CompaniesMap from "@/features/companies/components/CompaniesMap";

export const revalidate = 60;

export default async function CompaniesPage() {
  const { data } = await queryWithFallback({ query: GET_COMPANIES }, { companies: { nodes: [] } }, "companies listing");
  const companies = data?.companies?.nodes || [];

  return <CompaniesMap companies={companies} />;
}