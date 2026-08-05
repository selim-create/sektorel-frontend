"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { getSessionUser, hasSession } from "@/lib/auth";
import { GET_JOB_DATA } from "@/lib/queries";
import { uploadJobApplicationCv } from "@/lib/job-applications";

const SUBMIT_APPLICATION = gql`
  mutation SubmitSektorelJobApplication($input: SubmitSektorelJobApplicationInput!) {
    submitSektorelJobApplication(input: $input) {
      success
      message
      applicationId
    }
  }
`;

const inputClass =
  "w-full border border-gray-200 bg-gray-50 p-4 text-sm font-medium outline-none transition focus:border-primary focus:bg-white";

export default function ApplyJobPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvToken, setCvToken] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const jobQuery = useQuery(GET_JOB_DATA, {
    variables: { slug },
    skip: !slug,
    errorPolicy: "all",
  });
  const [submitApplication, { loading: submitting }] = useMutation(SUBMIT_APPLICATION, {
    errorPolicy: "all",
  });

  useEffect(() => {
    if (!hasSession()) {
      router.replace(`/giris?redirect=${encodeURIComponent(`/kariyer/${slug}/basvur`)}`);
      return;
    }
    const user = getSessionUser();
    setFullName(user?.name || "");
    setEmail(user?.email || "");
  }, [router, slug]);

  const job = jobQuery.data?.job;
  const deadline = job?.jobDetails?.deadline
    ? new Date(job.jobDetails.deadline).toLocaleDateString("tr-TR")
    : null;

  const handleCv = async (file?: File) => {
    if (!file) return;
    setErrorMessage("");
    setSuccessMessage("");
    setUploading(true);
    try {
      const result = await uploadJobApplicationCv(file);
      setCvToken(result.cvToken);
      setCvFileName(result.fileName);
    } catch (error) {
      setCvToken("");
      setCvFileName("");
      setErrorMessage(error instanceof Error ? error.message : "CV yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!cvToken) {
      setErrorMessage("Başvuruyu göndermeden önce CV dosyanızı yükleyin.");
      return;
    }

    const result = await submitApplication({
      variables: {
        input: {
          clientMutationId: `job-application-${slug}`,
          jobSlug: slug,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          coverLetter: coverLetter.trim(),
          cvToken,
        },
      },
    });

    const payload = result.data?.submitSektorelJobApplication;
    if (result.error || !payload?.success) {
      setErrorMessage(result.error?.message || payload?.message || "Başvuru gönderilemedi.");
      return;
    }

    setSuccessMessage(payload.message || "Başvurunuz işverene iletildi.");
    setCvToken("");
    window.setTimeout(() => router.push("/hesabim/basvurularim"), 1200);
  };

  if (jobQuery.loading && !job) {
    return <div className="flex min-h-[500px] items-center justify-center"><Loader2 className="animate-spin text-primary" size={36} /></div>;
  }

  if (!job) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={38} />
          <h1 className="text-2xl font-black uppercase text-secondary">İlan bulunamadı</h1>
          <p className="mt-2 text-sm text-gray-500">İlan kaldırılmış veya başvuruya kapatılmış olabilir.</p>
          <Link href="/kariyer" className="mt-6 inline-flex items-center gap-2 bg-secondary px-5 py-3 text-xs font-black uppercase text-white"><ArrowLeft size={14} /> İlanlara dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <section className="border-b border-gray-800 bg-secondary px-4 py-12 text-white">
        <div className="container mx-auto max-w-3xl">
          <Link href={`/kariyer/${slug}`} className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase text-gray-400 transition-colors hover:text-white">
            <ArrowLeft size={12} /> İlana geri dön
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight md:text-3xl">İş Başvurusu</h1>
          <p className="mt-2 text-sm text-gray-400"><span className="font-bold text-white">{job.title}</span> pozisyonu için başvuruyorsunuz.</p>
          <p className="mt-1 text-xs text-gray-500">{job.jobDetails?.companyName || "Firma adı gizli"}{deadline ? ` · Son başvuru ${deadline}` : ""}</p>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="border border-gray-200 bg-white shadow-sm">
          <div className="flex items-start gap-4 border-b border-gray-200 bg-blue-50 p-6">
            <ShieldCheck className="mt-1 shrink-0 text-blue-600" size={24} />
            <div>
              <h2 className="text-sm font-bold text-blue-900">Kişisel verilerin güvenliği</h2>
              <p className="mt-1 text-xs leading-relaxed text-blue-800/80">Bilgileriniz yalnızca bu ilanı yönetme yetkisi bulunan firma hesabıyla paylaşılır. CV dosyanız şifreli olarak saklanır.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
            {errorMessage ? <div className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{errorMessage}</div> : null}
            {successMessage ? <div className="flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 size={18} className="shrink-0" />{successMessage}</div> : null}

            <section>
              <h2 className="mb-6 border-b border-gray-100 pb-2 text-sm font-black uppercase tracking-widest text-secondary">İletişim Bilgileri</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Ad Soyad"><input required minLength={3} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} /></Field>
                <Field label="E-posta"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></Field>
                <Field label="Telefon"><input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="05xx xxx xx xx" /></Field>
                <Field label="Şehir"><input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} /></Field>
              </div>
            </section>

            <section>
              <h2 className="mb-6 border-b border-gray-100 pb-2 text-sm font-black uppercase tracking-widest text-secondary">Özgeçmiş ve Ön Yazı</h2>
              <div className="space-y-6">
                <Field label="Özgeçmiş (CV)">
                  <label className="flex cursor-pointer items-center justify-center gap-4 border-2 border-dashed border-gray-300 p-6 transition hover:border-primary hover:bg-orange-50/40">
                    {uploading ? <Loader2 className="animate-spin text-primary" size={26} /> : <UploadCloud className="text-primary" size={28} />}
                    <div>
                      <span className="block text-sm font-bold text-secondary">{uploading ? "CV yükleniyor..." : "PDF veya DOCX seçin"}</span>
                      <span className="text-xs text-gray-400">En fazla 5 MB</span>
                    </div>
                    <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" disabled={uploading || submitting} onChange={(e) => handleCv(e.target.files?.[0])} />
                  </label>
                  {cvFileName ? <div className="mt-3 flex items-center gap-2 border border-green-100 bg-green-50 p-3 text-xs font-bold text-green-700"><FileText size={16} /> {cvFileName}</div> : null}
                </Field>
                <Field label="Ön Yazı" optional><textarea rows={6} maxLength={5000} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className={`${inputClass} resize-y`} placeholder="Bu pozisyona neden uygun olduğunuzu kısaca anlatın..." /></Field>
              </div>
            </section>

            <button type="submit" disabled={submitting || uploading || Boolean(successMessage)} className="flex w-full items-center justify-center gap-2 bg-primary py-5 text-sm font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />} {submitting ? "Başvuru gönderiliyor..." : "Başvuruyu tamamla"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, optional = false }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase text-gray-500">{label}{optional ? " (Opsiyonel)" : ""}</span>{children}</label>;
}
