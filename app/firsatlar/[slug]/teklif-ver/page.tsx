import OfferSubmissionForm from "@/components/forms/OfferSubmissionForm";

export default async function SubmitOfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OfferSubmissionForm slug={slug} />;
}
