"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function applyConsent(consent: ConsentPreferences | null) {
  const gtag = ensureGtag();

  gtag("consent", "update", {
    analytics_storage: consent?.analytics ? "granted" : "denied",
    ad_storage: consent?.advertising ? "granted" : "denied",
    ad_user_data: consent?.advertising ? "granted" : "denied",
    ad_personalization: consent?.advertising ? "granted" : "denied",
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const consent = readConsent();
      applyConsent(consent);
      setAnalyticsAllowed(Boolean(consent?.analytics));
    }, 0);

    const handleConsentChanged = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      const consent = customEvent.detail ?? readConsent();
      applyConsent(consent);
      setAnalyticsAllowed(Boolean(consent?.analytics));
    };

    window.addEventListener("sektorel:consent-changed", handleConsentChanged);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("sektorel:consent-changed", handleConsentChanged);
    };
  }, []);

  useEffect(() => {
    if (!analyticsAllowed || !scriptReady || !pathname) return;

    const gtag = ensureGtag();
    gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [analyticsAllowed, pathname, scriptReady]);

  if (!analyticsAllowed) return null;

  return (
    <>
      <Script
        id="google-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        onReady={() => {
          const consent = readConsent();
          applyConsent(consent);

          const gtag = ensureGtag();
          gtag("js", new Date());
          gtag("config", GA_MEASUREMENT_ID, {
            send_page_view: false,
          });
          setScriptReady(true);
        }}
      />
    </>
  );
}
