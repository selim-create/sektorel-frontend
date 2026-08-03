"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CalendarDays, Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";

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

const SESSION_ROLE_QUERY = gql`
  query SektorelContentRole {
    sektorelSession {
      companyRole
      company { databaseId }
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
  return Number.isNaN(parsedDate.getTime()) ? "Tarih bilgisi yok" : dateFormatter.format(parsedDate);
}

function getPreviewHref(type: string, slug?: string | null) {
  if (!slug) return null;
  if (type === "lead") return `/firsatlar/${slug}`;
  if (type === "career") return `/kariyer/${slug}`;
  if (type === "event") return `/ajanda/${slug}`;
  return null;
}

type OwnedContentManagerProps = {
  title: string;
  description: string;
  types: string[];
  createHref?: string;
  createLabel?: string;
};

export default function OwnedContentManager({ title, description, types, createHref, createLabel }: OwnedContentManagerProps) {
  const singleType = types.length === 1 ? types[0] : undefined;
  const { data, loading, error, refetch } = useQuery(OWNED_CONTENT_QUERY, {
    variables: { type: singleType },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const roleQuery = useQuery(SESSION_ROLE_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [trashContent, { loading: deleting }] = useMutation(TRASH_CONTENT_MUTATION);

  const companyRole = roleQuery.data?.sektorelSession?.companyRole || "";
  const isViewer = companyRole === "viewer";
  const canEdit = !isViewer;
  const allItems = data?.sektorelOwnedContent || [];
  const items = singleType ? allItems : allItems.filter((item: { type: string }) => types.includes(item.type));

  const handleDelete = async (databaseId: number, itemTitle: string) => {
    if (!canEdit || !window.confirm(`“${itemTitle}” çöp kutusuna taşınsın mı?`)) return;
    await trashContent({ variables: { databaseId } });
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {canEdit && createHref && createLabel ? (
          <Link href={createHref} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-white">
            <Plus size={16} /> {createLabel}
          </Link>
        ) : null}
      </div>

      {isViewer ? (
        <div className="border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Görüntüleyici rolüyle firma içeriklerini görebilirsiniz; oluşturma, düzenleme ve silme işlemleri kapalıdır.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span>{error.message}</span>
        </div>
      ) : null}

      <div className="border border-gray-200 bg-white shadow-sm">
        {loading && !data ? (
          <div className="p-8 text-sm text-gray-400">İçerikler yükleniyor...</div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item: { databaseId: number; title: string; type: string; status: string; date?: string | null; slug?: string | null }) => {
              const previewHref = item.status === "publish" ? getPreviewHref(item.type, item.slug) : null;
              return (
                <div key={`${item.type}-${item.databaseId}`} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 text-[10px] font-black uppercase text-gray-600">{typeLabels[item.type] || item.type}</span>
                      <span className="text-[10px] font-black uppercase text-primary">{statusLabels[item.status] || item.status}</span>
                    </div>
                    <h2 className="truncate font-bold text-secondary">{item.title}</h2>
                    <span className="mt-1 block text-xs text-gray-400">{formatContentDate(item.date)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {previewHref ? (
                      <Link href={previewHref} className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 text-xs font-black uppercase text-secondary hover:bg-gray-50">
                        <Eye size={14} /> Önizle
                      </Link>
                    ) : null}
                    {canEdit ? (
                      <>
                        <Link href={`/hesabim/icerik-duzenle/${item.databaseId}`} className="inline-flex items-center gap-2 border border-primary/30 px-3 py-2 text-xs font-black uppercase text-primary hover:bg-orange-50">
                          <Pencil size={14} /> Düzenle
                        </Link>
                        <button type="button" onClick={() => handleDelete(item.databaseId, item.title)} disabled={deleting} className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-xs font-black uppercase text-red-600 hover:bg-red-50 disabled:opacity-50">
                          <Trash2 size={14} /> Sil
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            {types.includes("event") && types.length === 1 ? <CalendarDays size={40} className="mx-auto mb-4 text-gray-300" /> : <FileText size={40} className="mx-auto mb-4 text-gray-300" />}
            <h2 className="font-black uppercase text-secondary">Henüz içerik bulunmuyor</h2>
            <p className="mt-2 text-sm text-gray-500">Firma kapsamında oluşturulan içerikler burada listelenecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
