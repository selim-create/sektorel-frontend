"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Check, FileText, X } from "lucide-react";

const INCOMING_OFFERS = gql`
  query SektorelIncomingOffers {
    sektorelIncomingOffers {
      databaseId
      leadDatabaseId
      leadTitle
      leadSlug
      bidderName
      bidderCompany
      amount
      currency
      deliveryDays
      validityDays
      includesShipping
      message
      status
      date
    }
  }
`;

const UPDATE_OFFER_STATUS = gql`
  mutation UpdateSektorelOfferStatus($input: UpdateSektorelOfferStatusInput!) {
    updateSektorelOfferStatus(input: $input) {
      success
      message
      offer { databaseId status }
    }
  }
`;

const statusLabels: Record<string, string> = {
  pending: "Değerlendiriliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};

function formatDate(value?: string | null) {
  if (!value) return "Tarih bilgisi yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih bilgisi yok";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

export default function IncomingOffers() {
  const { data, loading, error, refetch } = useQuery(INCOMING_OFFERS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_OFFER_STATUS, { errorPolicy: "all" });

  const offers = data?.sektorelIncomingOffers || [];

  const handleStatus = async (offerId: number, status: "accepted" | "rejected") => {
    const verb = status === "accepted" ? "kabul etmek" : "reddetmek";
    if (!window.confirm(`Bu teklifi ${verb} istediğinize emin misiniz?`)) return;

    await updateStatus({
      variables: {
        input: {
          clientMutationId: `offer-status-${offerId}`,
          offerId,
          status,
        },
      },
    });
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">Gelen Teklifler</h1>
        <p className="mt-1 text-sm text-gray-500">Taleplerinize gönderilen fiyat ve teslimat tekliflerini yönetin.</p>
      </div>

      {error ? (
        <div className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" /> {error.message}
        </div>
      ) : null}

      <div className="space-y-4">
        {loading && !data ? (
          <div className="border border-gray-200 bg-white p-8 text-sm text-gray-500">Teklifler yükleniyor...</div>
        ) : offers.length ? (
          offers.map((offer: {
            databaseId: number;
            leadTitle: string;
            leadSlug: string;
            bidderName: string;
            bidderCompany?: string | null;
            amount: string;
            currency: string;
            deliveryDays: number;
            validityDays: number;
            includesShipping: boolean;
            message?: string | null;
            status: string;
            date?: string | null;
          }) => (
            <article key={offer.databaseId} className="border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 text-[10px] font-black uppercase text-gray-600">
                      {statusLabels[offer.status] || offer.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(offer.date)}</span>
                  </div>
                  <div>
                    <Link href={`/firsatlar/${offer.leadSlug}`} className="font-black text-secondary hover:text-primary">
                      {offer.leadTitle}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      {offer.bidderCompany || offer.bidderName}
                      {offer.bidderCompany ? ` · ${offer.bidderName}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <strong className="text-lg text-secondary">{offer.amount} {offer.currency}</strong>
                    <span>{offer.deliveryDays} gün teslimat</span>
                    <span>{offer.validityDays} gün geçerli</span>
                    <span>{offer.includesShipping ? "Nakliye dahil" : "Nakliye hariç"}</span>
                  </div>
                  {offer.message ? <p className="max-w-3xl whitespace-pre-wrap text-sm leading-6 text-gray-600">{offer.message}</p> : null}
                </div>

                {offer.status === "pending" ? (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatus(offer.databaseId, "accepted")}
                      disabled={updating}
                      className="inline-flex items-center gap-2 bg-green-600 px-4 py-3 text-xs font-black uppercase text-white disabled:opacity-50"
                    >
                      <Check size={15} /> Kabul Et
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatus(offer.databaseId, "rejected")}
                      disabled={updating}
                      className="inline-flex items-center gap-2 border border-red-200 px-4 py-3 text-xs font-black uppercase text-red-600 disabled:opacity-50"
                    >
                      <X size={15} /> Reddet
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="border border-gray-200 bg-white p-12 text-center shadow-sm">
            <FileText size={40} className="mx-auto mb-4 text-gray-300" />
            <h2 className="font-black uppercase text-secondary">Henüz teklif bulunmuyor</h2>
            <p className="mt-2 text-sm text-gray-500">Yayındaki taleplerinize gönderilen teklifler burada listelenecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
