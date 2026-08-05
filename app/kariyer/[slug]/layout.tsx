import type { Metadata } from "next";
import { gql } from "@apollo/client";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createContentMetadata, isValidDate } from "@/lib/content-seo";
import { queryWithFallback } from "@/lib/graphql-client";
import { absoluteUrl, compactObject, stripHtml } from "@/lib/site";

const JOB_SEO_QUERY = gql`
  query JobSeo($slug: ID!) {
    job(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      jobDetails {
        companyName
        location
        workType
        experience
        education
        salary
        deadline
      }
    }
  }
`;

type JobSeoData = {
  job?: {
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    date?: string | null;
    content?: string | null;
    jobDetails?: {
      companyName?: string | null;
      location?: string | null;
      workType?: string | null;
      experience?: string | null;
      education?: string | null;
      salary?: string | null;
      deadline?: string | null;
    } | null;
  } | null;
};

async function getJob(slug: string) {
  const { data } = await queryWithFallback<JobSeoData>(
    { query: JOB_SEO_QUERY, variables: { slug } },
    { job: null },
    `job seo ${slug}`,
  );
  return data.job ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  return createContentMetadata({
    title: job?.title,
    slug: job?.slug,
    routePrefix: "/kariyer",
    descriptionSource: job?.content,
    fallbackDescription: `${job?.title || "İş ilanı"} başvuru ve pozisyon detayları.`,
    type: "website",
  });
}

export default async function JobLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job?.title || !job.slug) return children;

  const details = job.jobDetails;
  const url = absoluteUrl(`/kariyer/${job.slug}`);

  const jobSchema = compactObject({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${url}#job`,
    title: job.title,
    description: stripHtml(job.content) || `${job.title} iş ilanı.`,
    datePosted: isValidDate(job.date) ? job.date : undefined,
    validThrough: isValidDate(details?.deadline) ? details?.deadline : undefined,
    employmentType: details?.workType || undefined,
    experienceRequirements: details?.experience || undefined,
    educationRequirements: details?.education || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: details?.companyName || "Firma adı gizli",
    },
    jobLocation: details?.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: details.location,
            addressCountry: "TR",
          },
        }
      : undefined,
    baseSalary: details?.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "TRY",
          value: {
            "@type": "QuantitativeValue",
            value: details.salary,
            unitText: "MONTH",
          },
        }
      : undefined,
    url,
  });

  const breadcrumbItems = [
    { name: "Ana Sayfa", path: "/" },
    { name: "İK & Kariyer", path: "/kariyer" },
    { name: job.title, path: `/kariyer/${job.slug}` },
  ];

  return (
    <>
      <JsonLd data={[jobSchema, createBreadcrumbSchema(breadcrumbItems)]} />
      {children}
    </>
  );
}
