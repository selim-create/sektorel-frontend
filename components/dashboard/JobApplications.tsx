"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  downloadProtectedCv,
  formatJobApplicationDate,
  JOB_APPLICATION_STATUS_CLASSES,
  JOB_APPLICATION_STATUS_LABELS,
  type JobApplicationItem,
} from "@/lib/job-applications";

const MY_APPLICATIONS = gql`
  query SektorelMyJobApplications {
    sektorelMyJobApplications {
      databaseId
      jobDatabaseId
      jobTitle
      jobSlug
      cvFileName
      cvDownloadUrl
      status
      date
    }
  }
`;

const INCOMING_APPLICATIONS = gql`
  query SektorelIncomingJobApplications {
    sektorelIncomingJobApplications {
      databaseId
      jobDatabaseId
      jobTitle
      jobSlug
      applicantName
      applicantEmail
      applicantPhone
      applicantCity
      coverLetter
      cvFileName
      cvDownloadUrl
      status
      date
    }
  }
`;

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateSektorelJobApplicationStatus($input: UpdateSektorelJobApplicationStatusInput!) {
    updateSektorelJobApplicationStatus(input: $input) {
      success
      message
      application {
        databaseId
        status
      }
    }
  }
`;

type Mode = "mine" | "incoming";

export default function JobApplications({ mode }: { mode: Mode }) {
  const query = mode === "mine" ? MY_APPLICATIONS : INCOMING_APPLICATIONS;
  const { data, loading, error, refetch } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_APPLICATION_STATUS, {
    errorPolicy: "all",
  });

  const applications: JobApplicationItem[] =
    mode === "mine"
      ? data?.sektorelMyJobApplications || []
      : data?.sektorelIncomingJobApplications || [];

  const handleStatus = async (applicationId: number, status: string) => {
    const result = await updateStatus({
      variables: {
        input: {
          clientMutationId: `job-application-status-${applicationId}`,
          applicationId,
          status,
        },
      },
    });
    if (result.error || !result.data?.updateSektorelJobApplicationStatus?.success) {
      window.alert(result.error?.message || result.data?.updateSektorelJobApplicationStatus?.message || "Başvuru durumu güncellenemedi.");
      return;
    }
    await refetch();
  };

  const handleDownload = async (application: JobApplicationItem) => {
    if (!application.cvDownloadUrl) return;
    try {
      await downloadProtectedCv(application.cvDownloadUrl, application.cvFileName || "cv");
    } catch (downloadError) {
      window.alert(downloadError instanceof Error ? downloadError.message : "CV indirilemedi.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">
          {mode === "mine" ? "Başvurularım" : "Gelen Başvurular"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "mine"
            ? "Gönderdiğiniz iş başvurularını ve güncel durumlarını takip edin."
            : "İş ilanlarınıza gelen adayları inceleyin ve başvuru durumunu yönetin."}
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" /> {error.message}
        </div>
      ) : null}

      {loading && !data ? (
        <div className="flex min-h-[260px] items-center justify-center border border-gray-200 bg-white">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : applications.length ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <article key={application.databaseId} className="border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`border px-2.5 py-1 text-[10px] font-black uppercase ${JOB_APPLICATION_STATUS_CLASSES[application.status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                      {JOB_APPLICATION_STATUS_LABELS[application.status] || application.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatJobApplicationDate(application.date)}</span>
                  </div>

                  <div>
                    <Link href={`/kariyer/${application.jobSlug}`} className="text-lg font-black text-secondary hover:text-primary">
                      {application.jobTitle}
                    </Link>
                  </div>

                  {mode === "incoming" ? (
                    <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <span className="flex items-center gap-2"><UserRound size={15} className="text-gray-400" /> {application.applicantName || "Aday"}</span>
                      <span className="flex items-center gap-2"><Mail size={15} className="text-gray-400" /> {application.applicantEmail || "-"}</span>
                      <span className="flex items-center gap-2"><Phone size={15} className="text-gray-400" /> {application.applicantPhone || "-"}</span>
                      <span className="flex items-center gap-2"><MapPin size={15} className="text-gray-400" /> {application.applicantCity || "Şehir belirtilmedi"}</span>
                    </div>
                  ) : null}

                  {mode === "incoming" && application.coverLetter ? (
                    <div className="border-l-4 border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600 whitespace-pre-wrap">
                      {application.coverLetter}
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                  {application.cvDownloadUrl ? (
                    <button type="button" onClick={() => handleDownload(application)} className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 text-xs font-black uppercase text-secondary hover:border-primary hover:text-primary">
                      <Download size={15} /> {application.cvFileName || "CV İndir"}
                    </button>
                  ) : null}

                  {mode === "incoming" ? (
                    <>
                      {application.status !== "reviewing" ? (
                        <button type="button" onClick={() => handleStatus(application.databaseId, "reviewing")} disabled={updating} className="inline-flex items-center justify-center gap-2 border border-blue-200 px-4 py-3 text-xs font-black uppercase text-blue-700 disabled:opacity-50">
                          <FileText size={15} /> İncelemeye Al
                        </button>
                      ) : null}
                      {application.status !== "accepted" ? (
                        <button type="button" onClick={() => handleStatus(application.databaseId, "accepted")} disabled={updating} className="inline-flex items-center justify-center gap-2 bg-green-600 px-4 py-3 text-xs font-black uppercase text-white disabled:opacity-50">
                          <CheckCircle2 size={15} /> Kabul Et
                        </button>
                      ) : null}
                      {application.status !== "rejected" ? (
                        <button type="button" onClick={() => handleStatus(application.databaseId, "rejected")} disabled={updating} className="inline-flex items-center justify-center gap-2 border border-red-200 px-4 py-3 text-xs font-black uppercase text-red-600 disabled:opacity-50">
                          <XCircle size={15} /> Reddet
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 bg-white p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-black uppercase text-secondary">
            {mode === "mine" ? "Henüz başvurunuz yok" : "Henüz başvuru bulunmuyor"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "mine"
              ? "Kariyer ilanlarına yaptığınız başvurular burada listelenecek."
              : "Yayındaki iş ilanlarınıza gelen başvurular burada listelenecek."}
          </p>
          {mode === "mine" ? <Link href="/kariyer" className="mt-5 inline-flex bg-primary px-5 py-3 text-xs font-black uppercase text-white">İlanları incele</Link> : null}
        </div>
      )}
    </div>
  );
}
