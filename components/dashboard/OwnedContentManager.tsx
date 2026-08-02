"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CalendarDays, FileText, Plus, Trash2 } from "lucide-react";

const OWNED_CONTENT_QUERY = gql`
  query SektorelOwnedContent($type: String) {
    sektorelOwnedContent(type: $type) {
      databaseId
      title
      type
      status
      date
      slug
    }
  }
`;

const TRASH_CONTENT_MUTATION = gql`
  mutation TrashSektorelOwnedContent($databaseId: Int!) {
    trashSektorelOwnedContent(
      input: {
        clientMutationId: "trash-owned-content"
        databaseId: $databaseId
      }
    ) {
      success
      message
    }
  }
`;

const typeLabels: Record<string, string> = {
  lead: "Talep",
  career: "İş İlanı",
  event: "Etkinlik",
};

const statusLabels: Record<string, string> = {
  publish: "Yayında",
  pending: "Onay Bekliyor",
  draft: "Taslak",
  private: "Özel",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function formatContentDate(value?: string | null) {
  if (!value) return "Tarih bilgisi yok";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Tarih bilgisi yok";
  }

  return dateFormatter.format(parsedDate);
}

type OwnedContentManagerProps = {
  title: string;
  description: string;
  types: string[];
  createHref?: string;
  createLabel?: string;
};

export default function OwnedContentManager({
  title,
  description,
  types,
  createHref,
  createLabel,
}: OwnedContentManagerProps) {
  const singleType = types.length === 1 ? types[0] : undefined;
  const { data, loading, error, refetch } = useQuery(OWNED_CONTENT_QUERY, {
    variables: { type: singleType },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [trashContent, { loading: deleting }] = useMutation(TRASH_CONTENT_MUTATION);

  const allItems = data?.sektorelOwnedContent || [];
  const items = singleType
    ? allItems
    : allItems.filter((item: { type: string }) => types.includes(item.type));

  const handleDelete = async (databaseId: number, itemTitle: string) => {
    const confirmed = window.confirm(`“${itemTitle}” çöp kutusuna taşınsın mı?`);
    if (!confirmed) return;

    await trashContent({ variables: { databaseId } });
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {createHref && createLabel ? (
          <Link
            href={createHref}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 text-sm font-black uppercase tracking-wide"
          >
            <Plus size={16} /> {createLabel}
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error.message}</span>
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 shadow-sm">
        {loading && !data ? (
          <div className="p-8 text-sm text-gray-400">İçerikler yükleniyor...</div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item: {
              databaseId: number;
              title: string;
              type: string;
              status: string;
              date?: string | null;
            }) => (
              <div key={`${item.type}-${item.databaseId}`} className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-600 px-2 py-1">
                      {typeLabels[item.type] || item.type}
                    </span>
                    <span className="text-[10px] font-black uppercase text-primary">
                      {statusLabels[item.status] || item.status}
                    </span>
                  </div>
                  <h2 className="font-bold text-secondary truncate">{item.title}</h2>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {formatContentDate(item.date)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.databaseId, item.title)}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 border border-red-200 text-red-600 px-3 py-2 text-xs font-black uppercase hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Sil
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            {types.includes("event") && types.length === 1 ? (
              <CalendarDays size={40} className="mx-auto text-gray-300 mb-4" />
            ) : (
              <FileText size={40} className="mx-auto text-gray-300 mb-4" />
            )}
            <h2 className="font-black text-secondary uppercase">Henüz içerik bulunmuyor</h2>
            <p className="text-sm text-gray-500 mt-2">
              Oluşturduğunuz içerikler burada listelenecek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
