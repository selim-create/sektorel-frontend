const CONSENT_STORAGE_KEY = "sektorel.cookieConsent.v1";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

type ConsentSnapshot = {
  analytics?: boolean;
  version?: number;
};

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

function analyticsAllowed() {
  if (typeof window === "undefined") return false;

  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as ConsentSnapshot;
    return parsed.version === 1 && parsed.analytics === true;
  } catch {
    return false;
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (!analyticsAllowed()) return;

  const target = window as GtagWindow;
  if (typeof target.gtag !== "function") return;

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  target.gtag("event", eventName, safeParams);
}

export function trackSuccessfulMutation(operationName: string, variables: Record<string, unknown>, data: unknown) {
  if (!data || typeof data !== "object") return;

  const payload = data as Record<string, unknown>;

  if (operationName === "LoginUser") {
    const login = payload.login;
    if (login && typeof login === "object") {
      const session = login as Record<string, unknown>;
      if (session.authToken && session.refreshToken && session.user) {
        trackAnalyticsEvent("login", { method: "password" });
      }
    }
    return;
  }

  if (operationName === "RegisterUser") {
    const register = payload.registerSektorelUser;
    if (register && typeof register === "object" && (register as Record<string, unknown>).success === true) {
      trackAnalyticsEvent("sign_up", {
        method: "email",
        account_type: typeof variables.accountType === "string" ? variables.accountType : "unknown",
      });
    }
    return;
  }

  if (operationName === "SubmitCompany") {
    const company = payload.submitCompany;
    if (company && typeof company === "object" && (company as Record<string, unknown>).success === true) {
      trackAnalyticsEvent("company_submit", { source: "company_form" });
    }
    return;
  }

  if (operationName === "RequestCompanyClaim") {
    const claim = payload.requestCompanyClaim;
    if (claim && typeof claim === "object" && (claim as Record<string, unknown>).success === true) {
      trackAnalyticsEvent("company_claim_request", { source: "company_profile" });
    }
  }
}
