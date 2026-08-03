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
  Loader2,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { GET_ALL_SECTORS } from "@/lib/queries";
import { GRAPHQL_ENDPOINT } from "@/lib/error-handler";
import { getValidAccessToken } from "@/lib/auth";

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

const CITY_OPTIONS_QUERY = gql`
  query SektorelCityOptions {
    sektorelLocationOptions(type: "city", parentSlug: "turkiye", first: 100) {
      databaseId
      name
      slug
    }
  }
`;

const DISTRICT_OPTIONS_QUERY = gql`
  query SektorelDistrictOptions($parentSlug: String!) {
    sektorelLocationOptions(type: "district", parentSlug: $parentSlug, first: 200) {
      databaseId
      name
      slug
    }
  }
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

type LocationOption = { databaseId: number; name: string; slug: string };
type WorkRow = { days: string; time: string };
type MediaType = "logo" | "cover" | "gallery";

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
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-orange-50";

const textareaClass = `${inputClass} resize-y`;
const MEDIA_ENDPOINT = `${GRAPHQL_ENDPOINT.replace(/\/graphql\/?$/, "")}/wp-json/sektorel/v1/company-media`;

function toForm(company: Record<string, unknown>): FormState {
  return Object.keys(EMPTY_FORM).reduce((result, key) => {
    result[key as keyof FormState] = String(company[key] || "");
    return result;
  }, { ...EMPTY_FORM });
}

function lines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function socialHandle(value: string, platform: string) {
  const trimmed = value.trim().replace(/^@/, "");
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const path = url.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (platform === "linkedin") return path.replace(/^company\//, "").replace(/^in\//, "");
    if (platform === "youtube") return path.replace(/^@/, "").replace(/^channel\//, "").replace(/^c\//, "");
    return path;
  } catch {
    return trimmed;
  }
}

function socialUrl(platform: string, value: string) {
  const handle = socialHandle(value, platform);
  if (!handle) return "";
  const bases: Record<string, string> = {
    linkedin: "https://www.linkedin.com/company/",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    twitter: "https://x.com/",
    youtube: "https://www.youtube.com/@",
  };
  return `${bases[platform]}${handle}`;
}

function parseWorkRows(value: string): WorkRow[] {
  const parsed = lines(value).map((line) => {
    const [days, ...rest] = line.split(":");
    return { days: days.trim(), time: rest.join(":").trim() };
  });
  return parsed.length ? parsed : [{ days: "Pazartesi - Cuma", time: "09:00 - 18:00" }];
}

export default function CompanySettingsPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [workRows, setWorkRows] = useState<WorkRow[]>(parseWorkRows(""));
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploading, setUploading] = useState<MediaType | null>(null);

  const settingsQuery = useQuery(COMPANY_SETTINGS_QUERY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const sectorsQuery = useQuery(GET_ALL_SECTORS, { errorPolicy: "all" });
  const citiesQuery = useQuery(CITY_OPTIONS_QUERY, { errorPolicy: "all" });
  const districtsQuery = useQuery(DISTRICT_OPTIONS_QUERY, {
    variables: { parentSlug: form.city || "__none__" },
    skip: !form.city,
    errorPolicy: "all",
  });
  const [updateCompany, { loading: saving }] = useMutation(UPDATE_COMPANY_MUTATION);

  const company = settingsQuery.data?.sektorelCompanySettings;
  const completionPercent = Number(company?.completionPercent || 0);
  const hasNoCompany = Boolean(settingsQuery.error?.message?.includes("bağlı bir firma bulunamadı"));

  useEffect(() => {
    if (!company) return;
    const next = toForm(company);
    next.linkedinUrl = socialHandle(next.linkedinUrl, "linkedin");
    next.instagramUrl = socialHandle(next.instagramUrl, "instagram");
    next.facebookUrl = socialHandle(next.facebookUrl, "facebook");
    next.twitterUrl = socialHandle(next.twitterUrl, "twitter");
    next.youtubeUrl = socialHandle(next.youtubeUrl, "youtube");
    setForm(next);
    setServices(lines(next.servicesText));
    setProducts(lines(next.productsText));
    setWorkRows(parseWorkRows(next.workingHoursText));
    setGallery(lines(next.galleryUrlsText));
  }, [company]);

  const sectors = sectorsQuery.data?.sectors?.nodes || [];
  const cities: LocationOption[] = citiesQuery.data?.sektorelLocationOptions || [];
  const districts: LocationOption[] = districtsQuery.data?.sektorelLocationOptions || [];

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadMedia = async (type: MediaType, file: File) => {
    setErrorMessage("");
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Yalnızca görsel dosyaları yükleyebilirsiniz.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Görsel en fazla 5 MB olabilir.");
      return;
    }

    setUploading(type);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Oturum doğrulanamadı. Lütfen yeniden giriş yapın.");
      const body = new FormData();
      body.append("file", file);
      body.append("type", type);
      const response = await fetch(MEDIA_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const payload = await response.json();
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.message || "Görsel yüklenemedi.");
      }

      if (type === "logo") setField("logoImage", payload.url);
      if (type === "cover") setField("coverImage", payload.url);
      if (type === "gallery") setGallery((current) => [...current, payload.url].slice(0, 12));
      setMessage("Görsel yüklendi. Profil bilgilerini kaydetmeyi unutmayın.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!form.title.trim()) {
      setErrorMessage("Firma adı zorunludur.");
      return;
    }

    const workingHoursText = workRows
      .filter((row) => row.days.trim() || row.time.trim())
      .map((row) => `${row.days.trim()}: ${row.time.trim()}`)
      .join("\n");

    try {
      const result = await updateCompany({
        variables: {
          input: {
            clientMutationId: "update-company-settings",
            ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])),
            linkedinUrl: socialUrl("linkedin", form.linkedinUrl),
            instagramUrl: socialUrl("instagram", form.instagramUrl),
            facebookUrl: socialUrl("facebook", form.facebookUrl),
            twitterUrl: socialUrl("twitter", form.twitterUrl),
            youtubeUrl: socialUrl("youtube", form.youtubeUrl),
            servicesText: services.join("\n"),
            productsText: products.join("\n"),
            workingHoursText,
            galleryUrlsText: gallery.join("\n"),
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
    return <div className="flex min-h-[360px] items-center justify-center"><Loader2 className="animate-spin text-primary" size={36} /></div>;
  }

  if (hasNoCompany) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <Building2 size={42} className="mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-black uppercase text-secondary">Bağlı Firma Bulunamadı</h1>
        <p className="mb-6 mt-3 text-sm text-gray-500">Firma ayarlarını kullanabilmek için önce hesabınıza bir firma eklemelisiniz.</p>
        <Link href="/firma-ekle" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black uppercase text-white"><Building2 size={16} /> Firma Ekle</Link>
      </div>
    );
  }

  if (settingsQuery.error && !company) {
    return <Notice error>{settingsQuery.error.message}</Notice>;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">Firma Profili</h1>
          <p className="mt-1 text-sm text-gray-500">Firmanızın dijital vitrinini kolay adımlarla tamamlayın.</p>
        </div>
        {company?.slug ? <Link href={`/firma/${company.slug}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">Profili Görüntüle <ExternalLink size={14} /></Link> : null}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary"><Sparkles size={14} /> Profil Tamamlanma</p>
            <p className="mt-2 text-sm text-gray-500">Eksik alanları tamamladıkça firmanız daha güvenilir görünür.</p>
          </div>
          <strong className="text-3xl font-black text-secondary">%{completionPercent}</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completionPercent}%` }} /></div>
      </div>

      {message ? <Notice>{message}</Notice> : null}
      {errorMessage ? <Notice error>{errorMessage}</Notice> : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Görsel Kimlik" description="Logo ve kapak görselinizi cihazınızdan yükleyin." icon={<ImageIcon size={18} />}>
          <div className="grid gap-5 md:grid-cols-2">
            <MediaUploader type="logo" title="Firma Logosu" description="Kare PNG veya WebP önerilir." value={form.logoImage} uploading={uploading === "logo"} onUpload={uploadMedia} contain />
            <MediaUploader type="cover" title="Kapak Görseli" description="Yatay, en az 1200×400 px önerilir." value={form.coverImage} uploading={uploading === "cover"} onUpload={uploadMedia} />
          </div>
        </Section>

        <Section title="Kurumsal Bilgiler" description="Firmanızı ziyaretçilere net biçimde tanıtın.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Firma Adı" required><input value={form.title} onChange={(event) => setField("title", event.target.value)} required className={inputClass} /></Field>
            <Field label="Resmî Unvan"><input value={form.officialName} onChange={(event) => setField("officialName", event.target.value)} className={inputClass} /></Field>
            <Field label="Firma Tipi"><select value={form.companyType} onChange={(event) => setField("companyType", event.target.value)} className={inputClass}><option value="">Seçiniz</option><option value="limited">Limited Şirket</option><option value="anonim">Anonim Şirket</option><option value="sahis">Şahıs Firması</option><option value="diger">Diğer</option></select></Field>
            <Field label="Sektör"><select value={form.sector} onChange={(event) => setField("sector", event.target.value)} className={inputClass}><option value="">Seçiniz</option>{sectors.map((sector: { id: string; name: string; slug: string }) => <option key={sector.id} value={sector.slug}>{sector.name}</option>)}</select></Field>
          </div>
          <div className="mt-5"><Field label="Firma Hakkında" hint={`${form.description.length}/100 karakter — en az 100 karakter önerilir.`}><textarea rows={6} value={form.description} onChange={(event) => setField("description", event.target.value)} className={textareaClass} placeholder="Firmanız ne yapıyor, kimlere hizmet veriyor ve sizi farklılaştıran nedir?" /></Field></div>
        </Section>

        <Section title="İletişim ve Lokasyon" description="Şehir seçildiğinde ilgili ilçeler otomatik gelir.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="E-posta"><input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} className={inputClass} /></Field>
            <Field label="Telefon"><input value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClass} /></Field>
            <Field label="Web Sitesi"><input type="url" value={form.website} onChange={(event) => setField("website", event.target.value)} placeholder="https://" className={inputClass} /></Field>
            <Field label="Posta Kodu"><input value={form.postalCode} onChange={(event) => setField("postalCode", event.target.value)} className={inputClass} /></Field>
            <Field label="Şehir"><select value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value, district: "" }))} className={inputClass}><option value="">Şehir seçin</option>{cities.map((location) => <option key={location.databaseId} value={location.slug}>{location.name}</option>)}</select>{citiesQuery.loading ? <SmallLoading /> : null}</Field>
            <Field label="İlçe"><select value={form.district} onChange={(event) => setField("district", event.target.value)} disabled={!form.city || districtsQuery.loading} className={inputClass}><option value="">{form.city ? "İlçe seçin" : "Önce şehir seçin"}</option>{districts.map((location) => <option key={location.databaseId} value={location.slug}>{location.name}</option>)}</select>{districtsQuery.loading ? <SmallLoading /> : null}</Field>
          </div>
          <div className="mt-5"><Field label="Açık Adres"><textarea rows={3} value={form.address} onChange={(event) => setField("address", event.target.value)} className={textareaClass} /></Field></div>
        </Section>

        <Section title="Hizmetler ve Ürünler" description="Yazıp Enter’a basın; her kayıt ayrı bir etiket olur.">
          <div className="grid gap-6 md:grid-cols-2">
            <TagEditor label="Hizmetler" items={services} setItems={setServices} placeholder="Örn. Web tasarım" />
            <TagEditor label="Ürünler" items={products} setItems={setProducts} placeholder="Örn. Endüstriyel raf" />
          </div>
        </Section>

        <Section title="Çalışma Saatleri" description="Gün ve saatleri ayrı alanlardan yönetin.">
          <div className="space-y-3">
            {workRows.map((row, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
                <input value={row.days} onChange={(event) => setWorkRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, days: event.target.value } : item))} placeholder="Pazartesi - Cuma" className={inputClass} />
                <input value={row.time} onChange={(event) => setWorkRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, time: event.target.value } : item))} placeholder="09:00 - 18:00 veya Kapalı" className={inputClass} />
                <button type="button" onClick={() => setWorkRows((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500"><Trash2 size={17} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setWorkRows((current) => [...current, { days: "", time: "" }])} className="mt-4 flex items-center gap-2 text-sm font-bold text-primary"><Plus size={16} /> Saat satırı ekle</button>
        </Section>

        <Section title="Sosyal Medya" description="Tam bağlantı yerine yalnızca kullanıcı adını yazın." icon={<Share2 size={18} />}>
          <div className="grid gap-5 md:grid-cols-2">
            <HandleField label="LinkedIn" prefix="linkedin.com/company/" value={form.linkedinUrl} onChange={(value) => setField("linkedinUrl", value)} />
            <HandleField label="Instagram" prefix="instagram.com/" value={form.instagramUrl} onChange={(value) => setField("instagramUrl", value)} />
            <HandleField label="Facebook" prefix="facebook.com/" value={form.facebookUrl} onChange={(value) => setField("facebookUrl", value)} />
            <HandleField label="X / Twitter" prefix="x.com/" value={form.twitterUrl} onChange={(value) => setField("twitterUrl", value)} />
            <HandleField label="YouTube" prefix="youtube.com/@" value={form.youtubeUrl} onChange={(value) => setField("youtubeUrl", value)} />
          </div>
        </Section>

        <Section title="Galeri" description="Görselleri tek tek yükleyin; en fazla 12 görsel." icon={<ImageIcon size={18} />}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((url, index) => (
              <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt={`Galeri ${index + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"><X size={15} /></button>
              </div>
            ))}
            {gallery.length < 12 ? <MediaUploader type="gallery" title="Görsel Ekle" description={`${gallery.length}/12`} uploading={uploading === "gallery"} onUpload={uploadMedia} compact /> : null}
          </div>
        </Section>

        <div className="sticky bottom-4 flex justify-end rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <button type="submit" disabled={saving || Boolean(uploading)} className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-black uppercase text-white disabled:opacity-60"><Save size={16} /> {saving ? "Kaydediliyor..." : "Profili Kaydet"}</button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, description, icon, children }: { title: string; description: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"><div className="mb-6 flex items-start gap-3">{icon ? <span className="mt-0.5 text-primary">{icon}</span> : null}<div><h2 className="text-sm font-black uppercase tracking-wider text-secondary">{title}</h2><p className="mt-1 text-xs leading-5 text-gray-500">{description}</p></div></div>{children}</section>;
}

function Field({ label, required = false, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-gray-500">{label}{required ? " *" : ""}</span>{children}{hint ? <span className="mt-2 block text-xs text-gray-400">{hint}</span> : null}</label>;
}

function Notice({ children, error = false }: { children: React.ReactNode; error?: boolean }) {
  return <div className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-bold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{children}</div>;
}

function SmallLoading() {
  return <span className="mt-2 flex items-center gap-2 text-xs text-gray-400"><Loader2 size={13} className="animate-spin" /> Yükleniyor</span>;
}

function HandleField({ label, prefix, value, onChange }: { label: string; prefix: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:ring-4 focus-within:ring-orange-50"><span className="flex items-center border-r border-gray-200 bg-gray-100 px-3 text-xs text-gray-500">{prefix}</span><input value={value} onChange={(event) => onChange(socialHandle(event.target.value, label.toLowerCase()))} placeholder="kullaniciadi" className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm outline-none" /></div></Field>;
}

function TagEditor({ label, items, setItems, placeholder }: { label: string; items: string[]; setItems: React.Dispatch<React.SetStateAction<string[]>>; placeholder: string }) {
  const [value, setValue] = useState("");
  const add = () => {
    const item = value.trim();
    if (!item || items.includes(item) || items.length >= 30) return;
    setItems((current) => [...current, item]);
    setValue("");
  };
  return <div><p className="mb-2 text-xs font-bold uppercase text-gray-500">{label}</p><div className="min-h-32 rounded-xl border border-gray-200 bg-gray-50 p-3"><div className="mb-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-secondary shadow-sm">{item}<button type="button" onClick={() => setItems((current) => current.filter((entry) => entry !== item))}><X size={13} /></button></span>)}</div><div className="flex gap-2"><input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" /><button type="button" onClick={add} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"><Plus size={17} /></button></div></div></div>;
}

function MediaUploader({ type, title, description, value, uploading, onUpload, contain = false, compact = false }: { type: MediaType; title: string; description: string; value?: string; uploading: boolean; onUpload: (type: MediaType, file: File) => void; contain?: boolean; compact?: boolean }) {
  const id = `upload-${type}`;
  return <label htmlFor={id} className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:border-primary hover:bg-orange-50 ${compact ? "aspect-square min-h-36" : "min-h-56"}`}>{value ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={value} alt={title} className={`absolute inset-0 h-full w-full ${contain ? "object-contain p-6" : "object-cover"}`} /><div className="absolute inset-0 bg-black/40 opacity-0 transition hover:opacity-100" /></> : null}<div className={`relative z-10 flex flex-col items-center ${value ? "rounded-xl bg-white/90 p-4 shadow" : ""}`}>{uploading ? <Loader2 className="animate-spin text-primary" size={28} /> : <Upload className="text-primary" size={28} />}<strong className="mt-3 text-sm text-secondary">{uploading ? "Yükleniyor..." : value ? "Görseli Değiştir" : title}</strong><span className="mt-1 text-xs text-gray-500">{description}</span></div><input id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(type, file); event.currentTarget.value = ""; }} className="hidden" /></label>;
}
