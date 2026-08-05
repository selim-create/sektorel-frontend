"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CheckCircle2, Download, ExternalLink, FileText, Loader2, XCircle } from "lucide-react";
import {
  downloadProtectedCv,
  formatJobApplicationDate,
  JOB_APPLICATION_STATUS_CLASSES,
  JOB_APPLICATION_STATUS_LABELS,
  openProtectedCv,
  type JobApplicationItem,
} from "@/lib/job-applications";

const MY_APPLICATIONS = gql`
  query SektorelMyJobApplicationsV2Client {
    sektorelMyJobApplications {
      databaseId jobDatabaseId jobTitle jobSlug cvFileName cvDownloadUrl status date
    }
  }
`;

const INCOMING_APPLICATIONS = gql`
  query SektorelIncomingJobApplicationsV2Client {
    sektorelIncomingJobApplicationsV2 {
      databaseId jobDatabaseId jobTitle jobSlug applicantName applicantEmail applicantPhone applicantCity
      coverLetter cvFileName cvDownloadUrl status date
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateSektorelJobApplicationStatusV2Client($input: UpdateSektorelJobApplicationStatusV2Input!) {
    updateSektorelJobApplicationStatusV2(input: $input) {
      success message application { databaseId status }
    }
  }
`;

type Mode = "mine" | "incoming";

export default function JobApplicationsV2({ mode }: { mode: Mode }) {
  const { data, loading, error, refetch } = useQuery(mode === "mine" ? MY_APPLICATIONS : INCOMING_APPLICATIONS, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_STATUS, { errorPolicy: "all" });

  const applications: JobApplicationItem[] = mode === "mine"
    ? data?.sektorelMyJobApplications || []
    : data?.sektorelIncomingJobApplicationsV2 || [];

  const changeStatus = async (applicationId: number, status: string) => {
    const result = await updateStatus({ variables: { input: { clientMutationId: `application-${applicationId}`, applicationId, status } } });
    const payload = result.data?.updateSektorelJobApplicationStatusV2;
    if (result.error || !payload?.success) {
      window.alert(result.error?.message || payload?.message || "Başvuru durumu güncellenemedi.");
      return;
    }
    await refetch();
  };

  const runCvAction = async (application: JobApplicationItem, action: "open" | "download") => {
    if (!application.cvDownloadUrl) return;
    try {
      if (action === "open") await openProtectedCv(application.cvDownloadUrl);
      else await downloadProtectedCv(application.cvDownloadUrl, application.cvFileName || "cv");
    } catch (cvError) {
      window.alert(cvError instanceof Error ? cvError.message : "CV dosyası açılamadı.");
    }
  };

  if (loading && !data) {
    return <div className="flex min-h-[260px] items-center justify-center border border-gray-200 bg-white"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">{mode === "mine" ? "Başvurularım" : "Gelen Başvurular"}</h1>
        <p className="mt-1 text-sm text-gray-500">{mode === "mine" ? "Gönderdiğiniz başvuruları takip edin." : "İlanlarınıza gelen adayları yönetin."}</p>
      </div>

      {error ? <div className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} /> {error.message}</div> : null}

      {applications.length ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <article key={application.databaseId} className="border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`border px-2.5 py-1 text-[10px] font-black uppercase ${JOB_APPLICATION_STATUS_CLASSES[application.status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                      {JOB_APPLICATION_STATUS_LABELS[application.status] || application.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatJobApplicationDate(application.date)}</span>
                  </div>
                  <Link href={`/kariyer/${application.jobSlug}`} className="text-lg font-black text-secondary hover:text-primary">{application.jobTitle}</Link>
                  {mode === "incoming" ? (
                    <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <span><strong>Aday:</strong> {application.applicantName || "-"}</span>
                      <span><strong>E-posta:</strong> {application.applicantEmail || "-"}</span>
                      <span><strong>Telefon:</strong> {application.applicantPhone || "-"}</span>
                      <span><strong>Şehir:</strong> {application.applicantCity || "-"}</span>
                    </div>
                  ) : null}
                  {mode === "incoming" && application.coverLetter ? <div className="border-l-4 border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap">{application.coverLetter}</div> : null}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  {application.cvDownloadUrl ? (
                    <>
                      {application.cvFileName?.toLowerCase().endsWith(".pdf") ? (
                        <button type="button" onClick={() => runCvAction(application, "open")} className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 text-xs font-black uppercase text-secondary">
                          <ExternalLink size={15} /> PDF Aç
                        </button>
                      ) : null}
                      <button type="button" onClick={() => runCvAction(application, "download")} className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 text-xs font-black uppercase text-secondary">
                        <Download size={15} /> CV İndir
                      </button>
                    </>
                  ) : null}
                  {mode === "incoming" ? (
                    <>
                      <button type="button" disabled={updating} onClick={() => changeStatus(application.databaseId, "reviewing")} className="border border-blue-200 px-4 py-3 text-xs font-black uppercase text-blue-700 disabled:opacity-50"><FileText size={15} className="inline mr-2" />İncelemeye Al</button>
                      <button type="button" disabled={updating} onClick={() => changeStatus(application.databaseId, "accepted")} className="bg-green-600 px-4 py-3 text-xs font-black uppercase text-white disabled:opacity-50"><CheckCircle2 size={15} className="inline mr-2" />Kabul Et</button>
                      <button type="button" disabled={updating} onClick={() => changeStatus(application.databaseId, "rejected")} className="border border-red-200 px-4 py-3 text-xs font-black uppercase text-red-600 disabled:opacity-50"><XCircle size={15} className="inline mr-2" />Reddet</button>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 bg-white p-12 text-center"><FileText size={40} className="mx-auto mb-4 text-gray-300" /><strong>{mode === "mine" ? "Henüz başvurunuz yok" : "Henüz başvuru bulunmuyor"}</strong></div>
      )}
    </div>
  );
}
