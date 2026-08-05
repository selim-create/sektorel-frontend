import { getValidAccessToken } from "@/lib/auth";
import { GRAPHQL_ENDPOINT } from "@/lib/error-handler";

export type JobApplicationStatus = "pending" | "reviewing" | "accepted" | "rejected";

export type JobApplicationItem = {
  databaseId: number;
  jobDatabaseId: number;
  jobTitle: string;
  jobSlug: string;
  applicantName?: string | null;
  applicantEmail?: string | null;
  applicantPhone?: string | null;
  applicantCity?: string | null;
  coverLetter?: string | null;
  cvFileName?: string | null;
  cvDownloadUrl?: string | null;
  status: JobApplicationStatus | string;
  date?: string | null;
};

export const JOB_APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: "Başvuru Alındı",
  reviewing: "Değerlendiriliyor",
  accepted: "Kabul Edildi",
  rejected: "Olumsuz Sonuçlandı",
};

export const JOB_APPLICATION_STATUS_CLASSES: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  reviewing: "border-blue-200 bg-blue-50 text-blue-700",
  accepted: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

const API_BASE = GRAPHQL_ENDPOINT.replace(/\/graphql\/?$/, "");
const CV_UPLOAD_ENDPOINT = `${API_BASE}/wp-json/sektorel/v1/job-application-cv`;

async function parseRestError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || `İşlem başarısız: ${response.status}`;
  } catch {
    return `İşlem başarısız: ${response.status}`;
  }
}

export function validateCvFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["pdf", "docx"].includes(extension)) {
    return "Yalnızca PDF veya DOCX dosyası yükleyebilirsiniz.";
  }
  if (file.size < 1 || file.size > 5 * 1024 * 1024) {
    return "CV dosyası en fazla 5 MB olabilir.";
  }
  return "";
}

export async function uploadJobApplicationCv(file: File) {
  const validationError = validateCvFile(file);
  if (validationError) throw new Error(validationError);

  const token = await getValidAccessToken();
  if (!token) throw new Error("Oturum doğrulanamadı. Lütfen yeniden giriş yapın.");

  const body = new FormData();
  body.append("file", file, file.name);

  const response = await fetch(CV_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!response.ok) {
    throw new Error(await parseRestError(response));
  }

  const payload = (await response.json()) as {
    cvToken?: string;
    fileName?: string;
    fileSize?: number;
  };

  if (!payload.cvToken) {
    throw new Error("CV yükleme anahtarı oluşturulamadı.");
  }

  return {
    cvToken: payload.cvToken,
    fileName: payload.fileName || file.name,
    fileSize: Number(payload.fileSize || file.size),
  };
}

export async function downloadProtectedCv(url: string, fileName = "cv") {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Oturum doğrulanamadı. Lütfen yeniden giriş yapın.");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await parseRestError(response));
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName || "cv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function formatJobApplicationDate(value?: string | null) {
  if (!value) return "Tarih bilgisi yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih bilgisi yok";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}
