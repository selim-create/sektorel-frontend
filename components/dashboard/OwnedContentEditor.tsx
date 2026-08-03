"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { GET_ALL_SECTORS } from "@/lib/queries";

const CONTENT_DETAIL_QUERY = gql`
  query SektorelOwnedContentDetail($databaseId: Int!) {
    sektorelOwnedContentDetail(databaseId: $databaseId) {
      databaseId title description type status slug sector
      leadType budgetString expiryDate deliveryLocation isHiddenName
      companyName location workType experience education salary deadline
      eventType startDate endDate locationType venue address organizer price registrationLink
    }
  }
`;

const UPDATE_CONTENT_MUTATION = gql`
  mutation UpdateSektorelOwnedContent($input: UpdateSektorelOwnedContentInput!) {
    updateSektorelOwnedContent(input: $input) {
      success
      message
      content { databaseId status }
    }
  }
`;

const fieldClass = "w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white";

const emptyForm = {
  title: "", description: "", sector: "", leadType: "alim", budgetString: "", expiryDate: "", deliveryLocation: "", isHiddenName: false,
  companyName: "", location: "", workType: "Tam Zamanlı", experience: "1-3 Yıl", education: "", salary: "", deadline: "",
  eventType: "konferans", startDate: "", endDate: "", locationType: "physical", venue: "", address: "", organizer: "", price: "", registrationLink: "",
};

type FormState = typeof emptyForm;

export default function OwnedContentEditor({ databaseId }: { databaseId: number }) {
  const { data, loading, error } = useQuery(CONTENT_DETAIL_QUERY, {
    variables: { databaseId },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const sectorsQuery = useQuery(GET_ALL_SECTORS, { errorPolicy: "all" });
  const [updateContent, { loading: saving }] = useMutation(UPDATE_CONTENT_MUTATION, { errorPolicy: "all" });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const content = data?.sektorelOwnedContentDetail;

  useEffect(() => {
    if (!content || ready) return;
    setForm({
      ...emptyForm,
      ...Object.fromEntries(Object.keys(emptyForm).map((key) => [key, content[key] ?? emptyForm[key as keyof FormState]])),
      isHiddenName: Boolean(content.isHiddenName),
    } as FormState);
    setReady(true);
  }, [content, ready]);

  const setValue = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setSaveError("");

    const input = {
      clientMutationId: `update-owned-${databaseId}`,
      databaseId,
      ...form,
    };

    try {
      const result = await updateContent({ variables: { input } });
      const graphError = result.error?.message;
      const payload = result.data?.updateSektorelOwnedContent;
      if (graphError || !payload?.success) {
        setSaveError(graphError || payload?.message || "İçerik güncellenemedi.");
        return;
      }
      setMessage(payload.message || "Değişiklikler kaydedildi.");
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : "Beklenmedik bir hata oluştu.");
    }
  };

  if (loading && !content) {
    return <div className="p-8 text-sm text-gray-500">İçerik yükleniyor...</div>;
  }

  if (error || !content) {
    return (
      <div className="space-y-4">
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error?.message || "İçerik bulunamadı."}</div>
        <Link href="/hesabim" className="inline-flex items-center gap-2 text-sm font-bold text-secondary"><ArrowLeft size={16} /> Panele dön</Link>
      </div>
    );
  }

  const sectors = sectorsQuery.data?.sectors?.nodes || [];
  const backHref = content.type === "event" ? "/hesabim/etkinlikler" : "/hesabim/ilanlarim";

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-secondary"><ArrowLeft size={16} /> Listeye dön</Link>
        <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-secondary">İçeriği Düzenle</h1>
        <p className="mt-1 text-sm text-gray-500">Değişiklikler kaydedildiğinde içerik yeniden editör onayına gönderilir.</p>
      </div>

      {message ? <div className="flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 size={18} /> {message}</div> : null}
      {saveError ? <div className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} /> {saveError}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <Field label="Başlık"><input required minLength={5} value={form.title} onChange={(e) => setValue("title", e.target.value)} className={fieldClass} /></Field>
        <Field label="Açıklama"><textarea required minLength={20} rows={7} value={form.description} onChange={(e) => setValue("description", e.target.value)} className={fieldClass} /></Field>

        {content.type !== "event" ? (
          <Field label="Sektör">
            <select value={form.sector} onChange={(e) => setValue("sector", e.target.value)} className={fieldClass}>
              <option value="">Sektör seçin</option>
              {sectors.map((sector: { id: string; name: string; slug: string }) => <option key={sector.id} value={sector.slug}>{sector.name}</option>)}
            </select>
          </Field>
        ) : null}

        {content.type === "lead" ? <LeadFields form={form} setValue={setValue} /> : null}
        {content.type === "career" ? <JobFields form={form} setValue={setValue} /> : null}
        {content.type === "event" ? <EventFields form={form} setValue={setValue} /> : null}

        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-white disabled:opacity-60">
          <Save size={17} /> {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-xs font-bold uppercase text-gray-500">{label}</label>{children}</div>;
}

function LeadFields({ form, setValue }: { form: FormState; setValue: (key: keyof FormState, value: string | boolean) => void }) {
  return <div className="grid gap-5 md:grid-cols-2">
    <select value={form.leadType} onChange={(e) => setValue("leadType", e.target.value)} className={fieldClass}><option value="alim">Alım Talebi</option><option value="hizmet">Hizmet Talebi</option><option value="bayilik">Bayilik</option><option value="ortaklik">Çözüm Ortaklığı</option><option value="satis">Satış İlanı</option></select>
    <input value={form.budgetString} onChange={(e) => setValue("budgetString", e.target.value)} placeholder="Bütçe bilgisi" className={fieldClass} />
    <input type="date" value={form.expiryDate} onChange={(e) => setValue("expiryDate", e.target.value)} className={fieldClass} />
    <input value={form.deliveryLocation} onChange={(e) => setValue("deliveryLocation", e.target.value)} placeholder="Teslimat / hizmet yeri" className={fieldClass} />
    <label className="flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 text-sm font-bold md:col-span-2"><input type="checkbox" checked={form.isHiddenName} onChange={(e) => setValue("isHiddenName", e.target.checked)} /> Firma adımı gizle</label>
  </div>;
}

function JobFields({ form, setValue }: { form: FormState; setValue: (key: keyof FormState, value: string | boolean) => void }) {
  return <div className="grid gap-5 md:grid-cols-2">
    <input value={form.companyName} onChange={(e) => setValue("companyName", e.target.value)} placeholder="Firma adı" className={fieldClass} />
    <input value={form.location} onChange={(e) => setValue("location", e.target.value)} placeholder="Lokasyon" className={fieldClass} />
    <select value={form.workType} onChange={(e) => setValue("workType", e.target.value)} className={fieldClass}><option>Tam Zamanlı</option><option>Yarı Zamanlı</option><option>Uzaktan</option><option>Hibrit</option><option>Staj</option></select>
    <select value={form.experience} onChange={(e) => setValue("experience", e.target.value)} className={fieldClass}><option>Tecrübesiz</option><option>1-3 Yıl</option><option>3-5 Yıl</option><option>5-10 Yıl</option><option>10+ Yıl</option></select>
    <input value={form.education} onChange={(e) => setValue("education", e.target.value)} placeholder="Eğitim seviyesi" className={fieldClass} />
    <input value={form.salary} onChange={(e) => setValue("salary", e.target.value)} placeholder="Maaş bilgisi" className={fieldClass} />
    <input type="date" value={form.deadline} onChange={(e) => setValue("deadline", e.target.value)} className={fieldClass} />
  </div>;
}

function EventFields({ form, setValue }: { form: FormState; setValue: (key: keyof FormState, value: string | boolean) => void }) {
  return <div className="grid gap-5 md:grid-cols-2">
    <select value={form.eventType} onChange={(e) => setValue("eventType", e.target.value)} className={fieldClass}><option value="fuar">Fuar</option><option value="webinar">Webinar</option><option value="konferans">Konferans / Zirve</option><option value="egitim">Eğitim</option></select>
    <select value={form.locationType} onChange={(e) => setValue("locationType", e.target.value)} className={fieldClass}><option value="physical">Fiziksel</option><option value="online">Online</option></select>
    <input type="datetime-local" required value={form.startDate} onChange={(e) => setValue("startDate", e.target.value)} className={fieldClass} />
    <input type="datetime-local" value={form.endDate} onChange={(e) => setValue("endDate", e.target.value)} className={fieldClass} />
    <input value={form.venue} onChange={(e) => setValue("venue", e.target.value)} placeholder="Mekan / platform" className={fieldClass} />
    <input value={form.address} onChange={(e) => setValue("address", e.target.value)} placeholder="Açık adres" className={fieldClass} />
    <input value={form.organizer} onChange={(e) => setValue("organizer", e.target.value)} placeholder="Organizatör" className={fieldClass} />
    <input value={form.price} onChange={(e) => setValue("price", e.target.value)} placeholder="Ücret bilgisi" className={fieldClass} />
    <input type="url" value={form.registrationLink} onChange={(e) => setValue("registrationLink", e.target.value)} placeholder="Kayıt bağlantısı" className={`${fieldClass} md:col-span-2`} />
  </div>;
}
