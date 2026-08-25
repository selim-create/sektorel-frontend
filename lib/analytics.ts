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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function successfulPayload(payload: Record<string, unknown>, key: string) {
  const result = asRecord(payload[key]);
  return result?.success === true ? result : null;
}

function inputRecord(variables: Record<string, unknown>) {
  return asRecord(variables.input) ?? {};
}

function stringParam(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberParam(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function booleanParam(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
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
  const payload = asRecord(data);
  if (!payload) return;

  if (operationName === "LoginUser") {
    const login = asRecord(payload.login);
    if (login?.authToken && login.refreshToken && login.user) {
      trackAnalyticsEvent("login", { method: "password" });
    }
    return;
  }

  if (operationName === "RegisterUser") {
    if (successfulPayload(payload, "registerSektorelUser")) {
      trackAnalyticsEvent("sign_up", {
        method: "email",
        account_type: stringParam(variables.accountType) ?? "unknown",
      });
    }
    return;
  }

  if (operationName === "SubmitCompany") {
    if (successfulPayload(payload, "submitCompany")) {
      trackAnalyticsEvent("company_submit", { source: "company_form" });
    }
    return;
  }

  if (operationName === "RequestCompanyClaim") {
    if (successfulPayload(payload, "requestCompanyClaim")) {
      trackAnalyticsEvent("company_claim_request", { source: "company_profile" });
    }
    return;
  }

  if (operationName === "SubmitLead") {
    if (successfulPayload(payload, "submitSektorelLead")) {
      const input = inputRecord(variables);
      trackAnalyticsEvent("lead_submit", {
        lead_type: stringParam(input.leadType),
        hidden_name: booleanParam(input.isHiddenName),
      });
    }
    return;
  }

  if (operationName === "SubmitJob") {
    if (successfulPayload(payload, "submitSektorelJob")) {
      const input = inputRecord(variables);
      trackAnalyticsEvent("job_submit", {
        work_type: stringParam(input.workType),
        experience: stringParam(input.experience),
      });
    }
    return;
  }

  if (operationName === "SubmitEvent") {
    if (successfulPayload(payload, "submitSektorelEvent")) {
      const input = inputRecord(variables);
      trackAnalyticsEvent("event_submit", {
        event_type: stringParam(input.eventType),
        location_type: stringParam(input.locationType),
      });
    }
    return;
  }

  if (operationName === "SaveSektorelEventReminder") {
    if (successfulPayload(payload, "saveSektorelEventReminder")) {
      const input = inputRecord(variables);
      trackAnalyticsEvent("event_reminder_set", {
        days_before: numberParam(input.daysBefore),
      });
    }
    return;
  }

  if (operationName === "CancelSektorelEventReminder") {
    if (successfulPayload(payload, "cancelSektorelEventReminder")) {
      trackAnalyticsEvent("event_reminder_cancel");
    }
    return;
  }

  if (operationName === "SubmitSektorelOffer") {
    if (successfulPayload(payload, "submitSektorelOffer")) {
      const input = inputRecord(variables);
      trackAnalyticsEvent("offer_submit", {
        currency: stringParam(input.currency),
        includes_shipping: booleanParam(input.includesShipping),
      });
    }
    return;
  }

  if (operationName === "SubmitSektorelJobApplication") {
    if (successfulPayload(payload, "submitSektorelJobApplication")) {
      trackAnalyticsEvent("job_apply", { source: "job_detail" });
    }
  }
}
