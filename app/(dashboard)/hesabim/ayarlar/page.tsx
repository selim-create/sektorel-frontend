"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Save,
  Share2,
  Sparkles,
} from "lucide-react";
import { GET_ALL_LOCATIONS, GET_ALL_SECTORS } from "@/lib/queries";

const PROFILE_FIELDS = gql`
  fragment SektorelCompanySettingsFields on SektorelCompanySettings {
    databaseId
    title
    officialName
    description
    companyType
    email
    phone
    website
    address
    postalCode
    sector
    city
    district
    status
    logoImage
    coverImage
    linkedinUrl
    instagramUrl
    facebookUrl
    twitterUrl
    youtubeUrl
    servicesText
    productsText
    workingHoursText
    galleryUrlsText
    completionPercent
  }
`;

const COMPANY_SETTINGS_QUERY = gql`
  query SektorelCompanySettings {
    sektorelCompanySettings {
      ...SektorelCompanySettingsFields
    }
  }
  ${PROFILE_FIELDS}
`;

const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateSektorelCompany($input: UpdateSektorelCompanyInput!) {
    updateSektorelCompany(input: $input) {
      success
      message
      company {
        ...SektorelCompanySettingsFields
      }
    }
  }
  ${PROFILE_FIELDS}
`;

type FormState = {
  title: string;
  officialName: string;
  description: string;
  companyType: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  postalCode: string;
  sector: string;
  city: string;
  district: string;
  logoImage: string;
  coverImage: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  servicesText: string;
  productsText: string;
  workingHoursText: string;
  galleryUrlsText: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  officialName: "",
  description: "",
  companyType: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  postalCode: "",
  sector: "",
  city: "",
  district: "",
  logoImage: "",
  coverImage: "",
  linkedinUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  servicesText: "",
  productsText: "",
  workingHoursText: "",
  galleryUrlsText: "",
};

const inputClass =
  "w-full border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white";

const textareaClass = `${inputClass} resize-y`;

function toForm(company: Record<string, unknown>): FormState {
  return Object.keys(EMPTY_FORM).reduce((result, key) => {
    result[key as keyof FormState] = String(company[key] || "");
    return result;
  }, { ...EMPTY_FORM });
}

export default function CompanySettingsPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const settingsQuery = useQuery(COMPANY_SETTINGS_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const sectorsQuery = useQuery(GET_ALL_SECTORS, { errorPolicy: "all" });
  const locationsQuery = useQuery(GET_ALL_LOCATIONS, { errorPolicy: "all" });
  const [updateCompany, { loading: saving }] = useMutation(UPDATE_COMPANY_MUTATION);

  const company = settingsQuery.data?.sektorelCompanySettings;
  const completionPercent = Number(company?.completionPercent || 0);
  const hasNoCompany = Boolean(
    settingsQuery.error?.message?.includes("bağlı bir firma bulunamadı"),
  );

  useEffect(() => {
    if (company) setForm(toForm(company));
  }, [company]);

  const sectors = sectorsQuery.data?.sectors?.nodes || [];
  const locations = useMemo(
    () => locationsQuery.data?.locations?.nodes || [],
    [locationsQuery.data],
  );

  const cityOptions = locations.filter(
    (location: { parentDatabaseId?: number | null }) => !location.parentDatabaseId,
  );
  const districtOptions = locations.filter(
    (location: { parentDatabaseId?: number | null }) => Boolean(location.parentDatabaseId),
  );

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!form.title.trim()) {
      setErrorMessage("Firma adı zorunludur.");
      return;
    }

    try {
      const result = await updateCompany({
        variables: {
          input: {
            clientMutationId: "update-company-settings",
            ...Object.fromEntries(
              Object.entries(form).map(([key, value]) => [key, value.trim()]),
            ),
          },
        },
      });

      const payload = result.data?.updateSektorelCompany;
      if (result.error || !payload?.success) {
        setErrorMessage(result.error?.message || payload?.message || "Firma bilgileri güncellenemedi.");
        return;
      }

      setMessage(payload.message || "Firma profiliniz güncellendi.");
      await settingsQuery.refetch();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Beklenmedik bir hata oluştu.");
    }
  };

  if (settingsQuery.loading && !company) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          <p className="text-sm font-bold text-gray-500">Firma bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hasNoCompany) {
    return (
      <div className="mx-auto max-w-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <Building2 size={42} className="mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-black uppercase text-secondary">Bağlı Firma Bulunamadı</h1>
        <p className="mb-6 mt-3 text-sm text-gray-500">
          Firma ayarlarını kullanabilmek için önce hesabınıza bir firma eklemelisiniz.
        </p>
        <Link href="/firma-ekle" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase text-white">
          <Building2 size={16} /> Firma Ekle
        </Link>
      </div>
    );
  }

  if (settingsQuery.error && !company) {
    return (
      <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-5 text-red-700">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
        <div>
          <h1 className="font-black uppercase">Firma bilgileri alınamadı</h1>
          <p className="mt-1 text-sm">{settingsQuery.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">Firma Ayarları</h1>
          <p className="mt-1 text-sm text-gray-500">
            Public firma profilinizde görünen kurumsal, medya ve hizmet bilgilerini yönetin.
          </p>
        </div>
        {company?.databaseId ? (
          <Link
            href={`/firma/${company.slug || ""}`}
            className="hidden items-center gap-2 text-xs font-black uppercase tracking-wider text-primary"
          >
            Profili Görüntüle <ExternalLink size={14} />
          </Link>
        ) : null}
      </div>

      <div className="border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <Sparkles size={14} /> Profil Tamamlanma
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Daha dolu profiller firma rehberinde daha güvenilir ve faydalı görünür.
            </p>
          </div>
          <strong className="text-3xl font-black text-secondary">%{completionPercent}</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden bg-gray-100">
          <div className="h-full bg-primary transition-all" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {company?.status && company.status !== "publish" ? (
        <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Firmanız şu anda <strong>onay bekliyor</strong>. Bilgileri düzenleyebilirsiniz; yayın durumu yönetici onayından sonra değişir.
        </div>
      ) : null}

      {message ? (
        <div className="flex items-center gap-2 border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          <CheckCircle2 size={18} /> {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          <AlertCircle size={18} /> {errorMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="border border-gray-200 bg-white shadow-sm">
        <Section title="Kurumsal Bilgiler" description="Firma adı, resmî unvan, sektör ve tanıtım metni.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Firma Adı" required>
              <input value={form.title} onChange={(event) => setField("title", event.target.value)} required className={inputClass} />
            </Field>
            <Field label="Resmî Unvan">
              <input value={form.officialName} onChange={(event) => setField("officialName", event.target.value)} className={inputClass} />
            </Field>
            <Field label="Firma Tipi">
              <select value={form.companyType} onChange={(event) => setField("companyType", event.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                <option value="limited">Limited Şirket</option>
                <option value="anonim">Anonim Şirket</option>
                <option value="sahis">Şahıs Firması</option>
                <option value="diger">Diğer</option>
              </select>
            </Field>
            <Field label="Sektör">
              <select value={form.sector} onChange={(event) => setField("sector", event.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {sectors.map((sector: { id: string; name: string; slug: string }) => (
                  <option key={sector.id} value={sector.slug}>{sector.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Firma Hakkında" hint="Profil puanı için en az 100 karakter önerilir.">
              <textarea rows={7} value={form.description} onChange={(event) => setField("description", event.target.value)} className={textareaClass} />
            </Field>
          </div>
        </Section>

        <Section title="İletişim ve Lokasyon" description="Müşterilerin firmanıza ulaşacağı bilgiler.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="E-posta"><input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} className={inputClass} /></Field>
            <Field label="Telefon"><input value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClass} /></Field>
            <Field label="Web Sitesi"><input type="url" value={form.website} onChange={(event) => setField("website", event.target.value)} placeholder="https://" className={inputClass} /></Field>
            <Field label="Posta Kodu"><input value={form.postalCode} onChange={(event) => setField("postalCode", event.target.value)} className={inputClass} /></Field>
            <Field label="Şehir">
              <select value={form.city} onChange={(event) => setField("city", event.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {(cityOptions.length ? cityOptions : locations).map((location: { id: string; name: string; slug: string }) => (
                  <option key={`city-${location.id}`} value={location.slug}>{location.name}</option>
                ))}
              </select>
            </Field>
            <Field label="İlçe">
              <select value={form.district} onChange={(event) => setField("district", event.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {(districtOptions.length ? districtOptions : locations).map((location: { id: string; name: string; slug: string }) => (
                  <option key={`district-${location.id}`} value={location.slug}>{location.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Açık Adres"><textarea rows={4} value={form.address} onChange={(event) => setField("address", event.target.value)} className={textareaClass} /></Field>
          </div>
        </Section>

        <Section title="Logo ve Kapak" description="WordPress medya kütüphanesindeki görsellerin tam URL’lerini kullanın." icon={<ImageIcon size={18} />}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Logo Görseli URL"><input type="url" value={form.logoImage} onChange={(event) => setField("logoImage", event.target.value)} placeholder="https://.../logo.png" className={inputClass} /></Field>
            <Field label="Kapak Görseli URL"><input type="url" value={form.coverImage} onChange={(event) => setField("coverImage", event.target.value)} placeholder="https://.../kapak.jpg" className={inputClass} /></Field>
          </div>
          {(form.logoImage || form.coverImage) ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <PreviewImage url={form.logoImage} label="Logo önizleme" contain />
              <PreviewImage url={form.coverImage} label="Kapak önizleme" />
            </div>
          ) : null}
        </Section>

        <Section title="Hizmetler, Ürünler ve Çalışma Saatleri" description="Her hizmeti veya ürünü ayrı satıra yazın.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Hizmetler" hint="En fazla 30 satır."><textarea rows={8} value={form.servicesText} onChange={(event) => setField("servicesText", event.target.value)} placeholder={"Web Tasarım\nDijital Pazarlama\nDanışmanlık"} className={textareaClass} /></Field>
            <Field label="Ürünler" hint="En fazla 30 satır."><textarea rows={8} value={form.productsText} onChange={(event) => setField("productsText", event.target.value)} placeholder={"Ürün A\nÜrün B\nÜrün C"} className={textareaClass} /></Field>
          </div>
          <div className="mt-5">
            <Field label="Çalışma Saatleri" hint="Gün ve saat bilgisini iki nokta ile ayırın.">
              <textarea rows={5} value={form.workingHoursText} onChange={(event) => setField("workingHoursText", event.target.value)} placeholder={"Pazartesi-Cuma: 09:00-18:00\nCumartesi: 10:00-14:00\nPazar: Kapalı"} className={textareaClass} />
            </Field>
          </div>
        </Section>

        <Section title="Sosyal Medya" description="Yalnızca firmanıza ait tam profil bağlantılarını ekleyin." icon={<Share2 size={18} />}>
          <div className="grid gap-5 md:grid-cols-2">
            <UrlField label="LinkedIn" value={form.linkedinUrl} onChange={(value) => setField("linkedinUrl", value)} />
            <UrlField label="Instagram" value={form.instagramUrl} onChange={(value) => setField("instagramUrl", value)} />
            <UrlField label="Facebook" value={form.facebookUrl} onChange={(value) => setField("facebookUrl", value)} />
            <UrlField label="X / Twitter" value={form.twitterUrl} onChange={(value) => setField("twitterUrl", value)} />
            <UrlField label="YouTube" value={form.youtubeUrl} onChange={(value) => setField("youtubeUrl", value)} />
          </div>
        </Section>

        <Section title="Galeri" description="Her satıra bir görsel URL’si ekleyin; en fazla 12 görsel kaydedilir.">
          <Field label="Galeri Görsel URL’leri">
            <textarea rows={8} value={form.galleryUrlsText} onChange={(event) => setField("galleryUrlsText", event.target.value)} placeholder={"https://.../gorsel-1.jpg\nhttps://.../gorsel-2.jpg"} className={textareaClass} />
          </Field>
        </Section>

        <div className="sticky bottom-0 flex justify-end border-t border-gray-100 bg-white/95 p-6 backdrop-blur">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary px-7 py-3 text-sm font-black uppercase text-white disabled:opacity-60">
            <Save size={16} /> {saving ? "Kaydediliyor..." : "Profili Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, description, icon, children }: { title: string; description: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-b border-gray-100 p-6 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        {icon ? <span className="mt-0.5 text-primary">{icon}</span> : null}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-secondary">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required = false, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-gray-500">{label}{required ? " *" : ""}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-gray-400">{hint}</span> : null}
    </label>
  );
}

function UrlField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={inputClass} />
    </Field>
  );
}

function PreviewImage({ url, label, contain = false }: { url: string; label: string; contain?: boolean }) {
  if (!url) return <div className="h-36 border border-dashed border-gray-200 bg-gray-50" />;
  return (
    <div className="overflow-hidden border border-gray-200 bg-gray-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} className={`h-36 w-full ${contain ? "object-contain p-4" : "object-cover"}`} />
    </div>
  );
}
