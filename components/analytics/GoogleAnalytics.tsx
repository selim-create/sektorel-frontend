"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  type ConsentPreferences,
} from "@/components/privacy/CookieConsent";

const GA_MEASUREMENT_ID = "G-7PX3QN7P3W";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (parsed.version !== 1) return null;

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
      version: 1,
    };
  } catch {
    return null;
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  return window.gtag;
}

function setDefaultConsent() {
  const gtag = ensureGtag();

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

function applyConsent(consent: ConsentPreferences | null) {
  const gtag = ensureGtag();

  gtag("consent", "update", {
    analytics_storage: consent?.analytics ? "granted" : "denied",
    ad_storage: consent?.advertising ? "granted" : "denied",
    ad_user_data: consent?.advertising ? "granted" : "denied",
    ad_personalization: consent?.advertising ? "granted" : "denied",
  });
}

function sendPageView(pathname: string) {
  const gtag = ensureGtag();
  gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: pathname,
    page_title: document.title,
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [consentInitialized, setConsentInitialized] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const configuredRef = useRef(false);
  const previousAnalyticsAllowedRef = useRef<boolean | null>(null);

  useEffect(() => {
    setDefaultConsent();

    const consent = readConsent();
    applyConsent(consent);
    setAnalyticsAllowed(Boolean(consent?.analytics));
    setConsentInitialized(true);

    const handleConsentChanged = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      const nextConsent = customEvent.detail ?? readConsent();
      applyConsent(nextConsent);
      setAnalyticsAllowed(Boolean(nextConsent?.analytics));
    };

    window.addEventListener("sektorel:consent-changed", handleConsentChanged);

    return () => {
      window.removeEventListener("sektorel:consent-changed", handleConsentChanged);
    };
  }, []);

  useEffect(() => {
    if (!scriptReady || !pathname) return;
    sendPageView(pathname);
  }, [pathname, scriptReady]);

  useEffect(() => {
    const previous = previousAnalyticsAllowedRef.current;

    if (
      scriptReady &&
      pathname &&
      previous === false &&
      analyticsAllowed === true
    ) {
      sendPageView(pathname);
    }

    previousAnalyticsAllowedRef.current = analyticsAllowed;
  }, [analyticsAllowed, pathname, scriptReady]);

  const initializeAnalytics = () => {
    if (configuredRef.current) {
      setScriptReady(true);
      return;
    }

    const gtag = ensureGtag();
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
    });

    configuredRef.current = true;
    setScriptReady(true);
  };

  if (!consentInitialized) return null;

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
      onLoad={initializeAnalytics}
      onReady={initializeAnalytics}
    />
  );
}
