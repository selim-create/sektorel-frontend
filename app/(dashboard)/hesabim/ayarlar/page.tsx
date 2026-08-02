"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Building2, CheckCircle2, Save } from "lucide-react";
import { GET_ALL_LOCATIONS, GET_ALL_SECTORS } from "@/lib/queries";

const COMPANY_SETTINGS_QUERY = gql`
  query SektorelCompanySettings {
    sektorelCompanySettings {
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
    }
  }
`;

const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateSektorelCompany(
    $title: String!
    $officialName: String
    $description: String
    $companyType: String
    $email: String
    $phone: String
    $website: String
    $address: String
    $postalCode: String
    $sector: String
    $city: String
    $district: String
  ) {
    updateSektorelCompany(
      input: {
        clientMutationId: "update-company-settings"
        title: $title
        officialName: $officialName
        description: $description
        companyType: $companyType
        email: $email
        phone: $phone
        website: $website
        address: $address
        postalCode: $postalCode
        sector: $sector
        city: $city
        district: $district
      }
    ) {
      success
      message
      company {
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
      }
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
};

const inputClass =
  "w-full border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-white";

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
  const hasNoCompany = Boolean(
    settingsQuery.error?.message?.includes("bağlı bir firma bulunamadı"),
  );

  useEffect(() => {
    if (!company) return;

    setForm({
      title: company.title || "",
      officialName: company.officialName || "",
      description: company.description || "",
      companyType: company.companyType || "",
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      address: company.address || "",
      postalCode: company.postalCode || "",
      sector: company.sector || "",
      city: company.city || "",
      district: company.district || "",
    });
  }, [company]);

  const sectors = sectorsQuery.data?.sectors?.nodes || [];
  const locations = useMemo(
    () => locationsQuery.data?.locations?.nodes || [],
    [locationsQuery.data],
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
          ...form,
          title: form.title.trim(),
          officialName: form.officialName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          website: form.website.trim(),
          postalCode: form.postalCode.trim(),
        },
      });

      const payload = result.data?.updateSektorelCompany;
      if (!payload?.success) {
        setErrorMessage(payload?.message || "Firma bilgileri güncellenemedi.");
        return;
      }

      setMessage(payload.message || "Firma bilgileriniz güncellendi.");
      await settingsQuery.refetch();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Beklenmedik bir hata oluştu.");
    }
  };

  if (settingsQuery.loading && !company) {
    return (
      <div className="min-h-[360px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-500">Firma bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hasNoCompany) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-10 text-center shadow-sm">
        <Building2 size={42} className="mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-black text-secondary uppercase">Bağlı Firma Bulunamadı</h1>
        <p className="text-sm text-gray-500 mt-3 mb-6">
          Firma ayarlarını kullanabilmek için önce hesabınıza bir firma eklemelisiniz.
        </p>
        <Link
          href="/firma-ekle"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-black uppercase"
        >
          <Building2 size={16} /> Firma Ekle
        </Link>
      </div>
    );
  }

  if (settingsQuery.error && !company) {
    return (
      <div className="bg-red-50 border border-red-200 p-5 text-red-700 flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <h1 className="font-black uppercase">Firma bilgileri alınamadı</h1>
          <p className="text-sm mt-1">{settingsQuery.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Firma Ayarları</h1>
        <p className="text-sm text-gray-500 mt-1">
          Firma profilinizde görünen temel kurumsal ve iletişim bilgilerini yönetin.
        </p>
      </div>

      {company?.status && company.status !== "publish" && (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Firmanız şu anda <strong>onay bekliyor</strong>. Bilgileri düzenleyebilirsiniz; yayın durumu yönetici onayından sonra değişir.
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 p-4 text-green-700 flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 p-4 text-red-700 flex items-center gap-2 text-sm font-bold">
          <AlertCircle size={18} /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm">
        <section className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-black text-secondary uppercase mb-5">Kurumsal Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Firma Adı" required>
              <input value={form.title} onChange={(e) => setField("title", e.target.value)} required className={inputClass} />
            </Field>
            <Field label="Resmî Unvan">
              <input value={form.officialName} onChange={(e) => setField("officialName", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Firma Tipi">
              <select value={form.companyType} onChange={(e) => setField("companyType", e.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                <option value="limited">Limited Şirket</option>
                <option value="anonim">Anonim Şirket</option>
                <option value="sahis">Şahıs Firması</option>
                <option value="diger">Diğer</option>
              </select>
            </Field>
            <Field label="Sektör">
              <select value={form.sector} onChange={(e) => setField("sector", e.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {sectors.map((sector: { id: string; name: string; slug: string }) => (
                  <option key={sector.id} value={sector.slug}>{sector.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Firma Hakkında">
              <textarea rows={6} value={form.description} onChange={(e) => setField("description", e.target.value)} className={`${inputClass} resize-y`} />
            </Field>
          </div>
        </section>

        <section className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-black text-secondary uppercase mb-5">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="E-posta">
              <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Telefon">
              <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Web Sitesi">
              <input type="url" value={form.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://" className={inputClass} />
            </Field>
            <Field label="Posta Kodu">
              <input value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-black text-secondary uppercase mb-5">Lokasyon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Şehir">
              <select value={form.city} onChange={(e) => setField("city", e.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {locations.map((location: { id: string; name: string; slug: string }) => (
                  <option key={`city-${location.id}`} value={location.slug}>{location.name}</option>
                ))}
              </select>
            </Field>
            <Field label="İlçe">
              <select value={form.district} onChange={(e) => setField("district", e.target.value)} className={inputClass}>
                <option value="">Seçiniz</option>
                {locations.map((location: { id: string; name: string; slug: string }) => (
                  <option key={`district-${location.id}`} value={location.slug}>{location.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Açık Adres">
              <textarea rows={4} value={form.address} onChange={(e) => setField("address", e.target.value)} className={`${inputClass} resize-y`} />
            </Field>
          </div>
        </section>

        <div className="p-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 text-sm font-black uppercase flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-gray-500 uppercase mb-2">
        {label}{required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
