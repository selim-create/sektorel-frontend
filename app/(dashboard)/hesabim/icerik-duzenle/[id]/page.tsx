import OwnedContentEditor from "@/components/dashboard/OwnedContentEditor";

export default async function OwnedContentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const databaseId = Number.parseInt(resolved.id, 10);

  if (!Number.isInteger(databaseId) || databaseId <= 0) {
    return <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">Geçersiz içerik numarası.</div>;
  }

  return <OwnedContentEditor databaseId={databaseId} />;
}
