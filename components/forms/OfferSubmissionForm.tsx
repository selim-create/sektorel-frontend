"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

const LEAD_QUERY = gql`
  query OfferLead($slug: ID!) {
    lead(id: $slug, idType: SLUG) {
      title
      slug
      leadDetails {
        status
        expiryDate
      }
    }
  }
`;

const SUBMIT_OFFER = gql`
  mutation SubmitSektorelOffer($input: SubmitSektorelOfferInput!) {
    submitSektorelOffer(input: $input) {
      success
      message
      offerId
    }
  }
`;

const fieldClass =
  "w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white";

export default function OfferSubmissionForm({ slug }: { slug: string }) {
  const { data, loading: leadLoading, error: leadError } = useQuery(LEAD_QUERY, {
    variables: { slug },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const [submitOffer, { loading }] = useMutation(SUBMIT_OFFER, { errorPolicy: "all" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) || "").trim();

    setMessage("");
    setError("");

    try {
      const result = await submitOffer({
        variables: {
          input: {
            clientMutationId: `offer-${slug}`,
            leadSlug: slug,
            amount: value("amount"),
            currency: value("currency"),
            deliveryDays: Number(value("deliveryDays")),
            validityDays: Number(value("validityDays")),
            includesShipping: form.get("includesShipping") === "on",
            message: value("message"),
          },
        },
      });

      const graphError = result.error?.message || result.errors?.[0]?.message;
      const payload = result.data?.submitSektorelOffer;
      if (graphError || !payload?.success) {
        setError(graphError || payload?.message || "Teklif gönderilemedi.");
        return;
      }

      setMessage(payload.message || "Teklifiniz gönderildi.");
      setSubmitted(true);
      formElement.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Beklenmedik bir hata oluştu.");
    }
  };

  const lead = data?.lead;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link href={`/firsatlar/${slug}`} className="text-sm font-bold text-gray-500 hover:text-secondary">
            ← İlana dön
          </Link>

          <div className="mt-5 mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-secondary">Teklif Hazırlama</h1>
            <p className="mt-2 text-gray-500">
              {leadLoading ? "İlan yükleniyor..." : lead?.title ? `“${lead.title}” ilanı için teklif veriyorsunuz.` : "İlan bilgisi alınamadı."}
            </p>
          </div>

          {leadError ? (
            <div className="mb-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" /> {leadError.message}
            </div>
          ) : null}

          {message ? (
            <div className="mb-6 flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={18} className="shrink-0" />
              <div>
                <p className="font-bold">{message}</p>
                <Link href="/firsatlar" className="mt-2 inline-block font-bold underline">Fırsatlara dön</Link>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Toplam teklif tutarı</label>
                <input name="amount" type="number" min="0.01" step="0.01" required className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Para birimi</label>
                <select name="currency" defaultValue="TRY" className={fieldClass}>
                  <option value="TRY">TRY</option><option value="USD">USD</option><option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Teslim süresi (gün)</label>
                <input name="deliveryDays" type="number" min="1" max="365" defaultValue="7" required className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Teklif geçerliliği (gün)</label>
                <select name="validityDays" defaultValue="7" className={fieldClass}>
                  <option value="7">7 gün</option><option value="15">15 gün</option><option value="30">30 gün</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-secondary">
              <input name="includesShipping" type="checkbox" /> Fiyata nakliye dahildir
            </label>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Açıklama / notlar</label>
              <textarea name="message" rows={6} className={fieldClass} placeholder="Ürün, teslimat ve ödeme koşullarını açıklayın." />
            </div>

            <button
              type="submit"
              disabled={loading || submitted || !lead}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} /> {loading ? "Gönderiliyor..." : submitted ? "Teklif Gönderildi" : "Teklifi Gönder"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
