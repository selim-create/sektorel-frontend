"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { GET_ALL_SECTORS } from "@/lib/queries";

type Mode = "lead" | "job" | "event";

type Props = {
  mode: Mode;
};

const SUBMIT_LEAD = gql`
  mutation SubmitLead($input: SubmitSektorelLeadInput!) {
    submitSektorelLead(input: $input) { success message postId }
  }
`;

const SUBMIT_JOB = gql`
  mutation SubmitJob($input: SubmitSektorelJobInput!) {
    submitSektorelJob(input: $input) { success message postId }
  }
`;

const SUBMIT_EVENT = gql`
  mutation SubmitEvent($input: SubmitSektorelEventInput!) {
    submitSektorelEvent(input: $input) { success message postId }
  }
`;

const fieldClass = "w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white";

const MODE_META = {
  lead: {
    title: "Yeni Alım Talebi",
    description: "İhtiyacınızı detaylandırın ve talebinizi editör onayına gönderin.",
    successHref: "/hesabim/ilanlarim",
    successLabel: "Taleplerime Git",
  },
  job: {
    title: "İş İlanı Oluştur",
    description: "Pozisyon bilgilerini girin ve ilanınızı editör onayına gönderin.",
    successHref: "/hesabim/ilanlarim",
    successLabel: "İlanlarıma Git",
  },
  event: {
    title: "Etkinlik Oluştur",
    description: "Etkinlik bilgilerini girin ve ajanda onayına gönderin.",
    successHref: "/hesabim/etkinlikler",
    successLabel: "Etkinliklerime Git",
  },
} as const;

function getSubmissionError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      graphQLErrors?: Array<{ message?: string }>;
      networkError?: { message?: string };
    };
    const graphQLError = candidate.graphQLErrors?.find((item) => item.message)?.message;
    if (graphQLError) return graphQLError;
    if (candidate.networkError?.message) return candidate.networkError.message;
  }

  return "Beklenmedik bir hata oluştu.";
}

export default function ContentSubmissionForm({ mode }: Props) {
  const meta = MODE_META[mode];
  const sectorsQuery = useQuery(GET_ALL_SECTORS, { errorPolicy: "all" });
  const mutation = mode === "lead" ? SUBMIT_LEAD : mode === "job" ? SUBMIT_JOB : SUBMIT_EVENT;
  const [submitContent, { loading }] = useMutation(mutation, { errorPolicy: "all" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    setMessage("");
    setError("");

    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) || "").trim();

    const input: Record<string, unknown> = {
      clientMutationId: `submit-${mode}`,
      title: value("title"),
      description: value("description"),
    };

    if (mode === "lead") {
      Object.assign(input, {
        leadType: value("leadType"),
        budgetString: value("budgetString"),
        expiryDate: value("expiryDate"),
        deliveryLocation: value("deliveryLocation"),
        sector: value("sector"),
        isHiddenName: form.get("isHiddenName") === "on",
      });
    }

    if (mode === "job") {
      Object.assign(input, {
        companyName: value("companyName"),
        location: value("location"),
        workType: value("workType"),
        experience: value("experience"),
        education: value("education"),
        salary: value("salary"),
        deadline: value("deadline"),
        sector: value("sector"),
      });
    }

    if (mode === "event") {
      Object.assign(input, {
        eventType: value("eventType"),
        startDate: value("startDate"),
        endDate: value("endDate"),
        locationType: value("locationType"),
        venue: value("venue"),
        address: value("address"),
        organizer: value("organizer"),
        price: value("price"),
        registrationLink: value("registrationLink"),
      });
    }

    try {
      const result = await submitContent({ variables: { input } });
      const payload = mode === "lead"
        ? result.data?.submitSektorelLead
        : mode === "job"
          ? result.data?.submitSektorelJob
          : result.data?.submitSektorelEvent;

      const resultError = result.error?.message;
      if (resultError && !payload?.success) {
        setError(resultError);
        return;
      }

      if (!payload?.success) {
        setError(payload?.message || "İçerik gönderilemedi. Lütfen alanları kontrol edip tekrar deneyin.");
        return;
      }

      setMessage(payload.message || "İçeriğiniz onaya gönderildi.");
      setSubmitted(true);
      formElement.reset();
    } catch (submissionError) {
      setError(getSubmissionError(submissionError));
    }
  };

  const sectors = sectorsQuery.data?.sectors?.nodes || [];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-secondary">{meta.title}</h1>
            <p className="mt-2 text-gray-500">{meta.description}</p>
          </div>

          {message ? (
            <div className="mb-6 border border-green-200 bg-green-50 p-4 text-green-700 flex items-start gap-3">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">{message}</p>
                <Link href={meta.successHref} className="mt-2 inline-block text-sm font-bold underline">
                  {meta.successLabel}
                </Link>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 text-red-700 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Başlık</label>
              <input name="title" required minLength={5} className={fieldClass} />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Açıklama</label>
              <textarea name="description" required minLength={20} rows={7} className={fieldClass} />
            </div>

            {mode !== "event" ? (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-gray-500">Sektör</label>
                <select name="sector" className={fieldClass} defaultValue="">
                  <option value="">Sektör seçin</option>
                  {sectors.map((sector: { id: string; name: string; slug: string }) => (
                    <option key={sector.id} value={sector.slug}>{sector.name}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {mode === "lead" ? <LeadFields /> : null}
            {mode === "job" ? <JobFields /> : null}
            {mode === "event" ? <EventFields /> : null}

            <button
              type="submit"
              disabled={loading || submitted}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} /> {loading ? "Gönderiliyor..." : submitted ? "Onaya Gönderildi" : "Onaya Gönder"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}

function LeadFields() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <select name="leadType" className={fieldClass} defaultValue="alim">
        <option value="alim">Alım Talebi</option><option value="hizmet">Hizmet Talebi</option><option value="bayilik">Bayilik</option><option value="ortaklik">Çözüm Ortaklığı</option><option value="satis">Satış İlanı</option>
      </select>
      <input name="budgetString" placeholder="Bütçe bilgisi" className={fieldClass} />
      <input name="expiryDate" type="date" className={fieldClass} />
      <input name="deliveryLocation" placeholder="Teslimat / hizmet yeri" className={fieldClass} />
      <label className="md:col-span-2 flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-secondary">
        <input name="isHiddenName" type="checkbox" /> Firma adımı gizle
      </label>
    </div>
  );
}

function JobFields() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <input name="companyName" placeholder="Firma adı" className={fieldClass} />
      <input name="location" placeholder="Lokasyon" className={fieldClass} />
      <select name="workType" className={fieldClass} defaultValue="Tam Zamanlı"><option>Tam Zamanlı</option><option>Yarı Zamanlı</option><option>Uzaktan</option><option>Hibrit</option><option>Staj</option></select>
      <select name="experience" className={fieldClass} defaultValue="1-3 Yıl"><option>Tecrübesiz</option><option>1-3 Yıl</option><option>3-5 Yıl</option><option>5-10 Yıl</option><option>10+ Yıl</option></select>
      <input name="education" placeholder="Eğitim seviyesi" className={fieldClass} />
      <input name="salary" placeholder="Maaş bilgisi" className={fieldClass} />
      <input name="deadline" type="date" className={fieldClass} />
    </div>
  );
}

function EventFields() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <select name="eventType" className={fieldClass} defaultValue="konferans"><option value="fuar">Fuar</option><option value="webinar">Webinar</option><option value="konferans">Konferans / Zirve</option><option value="egitim">Eğitim</option></select>
      <select name="locationType" className={fieldClass} defaultValue="physical"><option value="physical">Fiziksel</option><option value="online">Online</option></select>
      <input name="startDate" type="datetime-local" required className={fieldClass} />
      <input name="endDate" type="datetime-local" className={fieldClass} />
      <input name="venue" placeholder="Mekan / platform" className={fieldClass} />
      <input name="address" placeholder="Açık adres" className={fieldClass} />
      <input name="organizer" placeholder="Organizatör" className={fieldClass} />
      <input name="price" placeholder="Ücret bilgisi" className={fieldClass} />
      <input name="registrationLink" type="url" placeholder="Kayıt bağlantısı" className={`${fieldClass} md:col-span-2`} />
    </div>
  );
}
