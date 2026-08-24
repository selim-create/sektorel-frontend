"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Building2, CheckCircle2, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { ensureSession, subscribeToAuthChanges } from "@/lib/auth";

const COMPANY_CLAIM_STATUS = gql`
  query CompanyClaimStatus($slug: ID!) {
    company(id: $slug, idType: SLUG) {
      databaseId
      title
      sektorelClaimStatus {
        ownershipStatus
        myRequestStatus
        canRequest
      }
    }
  }
`;

const REQUEST_COMPANY_CLAIM = gql`
  mutation RequestCompanyClaim($input: RequestCompanyClaimInput!) {
    requestCompanyClaim(input: $input) {
      success
      message
      requestId
      status
    }
  }
`;

type ClaimStatusData = {
  company?: {
    databaseId?: number | null;
    title?: string | null;
    sektorelClaimStatus?: {
      ownershipStatus?: string | null;
      myRequestStatus?: string | null;
      canRequest?: boolean | null;
    } | null;
  } | null;
};

type ClaimStatusVariables = {
  slug: string;
};

type ClaimMutationData = {
  requestCompanyClaim?: {
    success?: boolean | null;
    message?: string | null;
    requestId?: string | null;
    status?: string | null;
  } | null;
};

type ClaimMutationVariables = {
  input: {
    clientMutationId: string;
    companyId: string;
    note?: string;
  };
};

export default function CompanyClaimControl({ companySlug }: { companySlug: string }) {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"checking" | "guest" | "authenticated">("checking");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [manualStatus, setManualStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const authenticated = await ensureSession();
      if (active) {
        setAuthState(authenticated ? "authenticated" : "guest");
      }
    };

    void verifySession();
    const unsubscribe = subscribeToAuthChanges(() => void verifySession());

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const { data, loading, error, refetch } = useQuery<ClaimStatusData, ClaimStatusVariables>(
    COMPANY_CLAIM_STATUS,
    {
      variables: { slug: companySlug },
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  );

  const [requestClaim, { loading: submitting }] = useMutation<ClaimMutationData, ClaimMutationVariables>(
    REQUEST_COMPANY_CLAIM,
    { errorPolicy: "all" },
  );

  const company = data?.company;
  const claimStatus = company?.sektorelClaimStatus;
  const ownershipStatus = claimStatus?.ownershipStatus || "";
  const requestStatus = manualStatus || claimStatus?.myRequestStatus || "";

  if (loading || authState === "checking") {
    return (
      <div className="border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          <Loader2 size={14} className="animate-spin" /> Firma sahipliği kontrol ediliyor
        </div>
      </div>
    );
  }

  if (!company || ownershipStatus === "claimed") {
    return null;
  }

  if (authState === "guest") {
    const redirect = pathname || `/firma/${companySlug}`;
    return (
      <div className="border border-primary/20 bg-primary/5 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Building2 size={20} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-secondary">Bu firma sizin mi?</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">Firma profilini yönetmek için hesabınıza giriş yapıp sahiplenme talebi gönderebilirsiniz.</p>
          </div>
        </div>
        <Link
          href={`/giris?redirect=${encodeURIComponent(redirect)}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover"
        >
          <LogIn size={14} /> Giriş Yap ve Sahiplen
        </Link>
      </div>
    );
  }

  if (requestStatus === "pending") {
    return (
      <div className="border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-start gap-3 text-amber-800">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-black uppercase tracking-wide">Sahiplenme talebiniz inceleniyor</p>
            <p className="mt-1 text-xs leading-5">Yönetici onayı verilene kadar firma sahipliği değişmez.</p>
          </div>
        </div>
      </div>
    );
  }

  if (requestStatus === "approved") {
    return (
      <div className="border border-green-200 bg-green-50 p-5 shadow-sm">
        <div className="flex items-start gap-3 text-green-700">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-black uppercase tracking-wide">Firma hesabınıza bağlandı</p>
            <p className="mt-1 text-xs leading-5">Firma yönetim alanına hesabınız üzerinden erişebilirsiniz.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!company.databaseId) return;

    setMessage("");
    setActionError("");

    try {
      const result = await requestClaim({
        variables: {
          input: {
            clientMutationId: `company-claim-${company.databaseId}`,
            companyId: String(company.databaseId),
            note: note.trim(),
          },
        },
      });

      const payload = result.data?.requestCompanyClaim;
      const graphError = result.error?.message;
      if (graphError || !payload?.success) {
        setActionError(graphError || payload?.message || "Sahiplenme talebi gönderilemedi.");
        return;
      }

      setManualStatus(payload.status || "pending");
      setMessage(payload.message || "Sahiplenme talebiniz alındı.");
      setNote("");
      await refetch();
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Sahiplenme talebi gönderilemedi.");
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Building2 size={20} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-secondary">Bu firma sizin mi?</p>
          <p className="mt-1 text-xs leading-5 text-gray-600">Talebiniz yönetici tarafından kontrol edilir. Onay verilmeden firma hesabınıza aktarılmaz.</p>
        </div>
      </div>

      {claimStatus?.canRequest ? (
        <>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="İsterseniz firma ile ilişkinizi kısaca açıklayın."
            className="mt-4 w-full resize-y border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white"
          />
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit()}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            {submitting ? "Gönderiliyor" : "Sahiplenme Talebi Gönder"}
          </button>
        </>
      ) : (
        <p className="mt-4 border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium leading-5 text-gray-600">
          Bu hesap şu anda firma sahiplenme talebi oluşturmaya uygun değil.
        </p>
      )}

      {message ? <p className="mt-3 text-xs font-bold leading-5 text-green-700">{message}</p> : null}
      {actionError || error ? <p className="mt-3 text-xs font-bold leading-5 text-red-600">{actionError || error?.message}</p> : null}
    </div>
  );
}
