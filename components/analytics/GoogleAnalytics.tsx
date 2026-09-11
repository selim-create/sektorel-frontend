"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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

function sendPageView(pathname: string) {
  const gtag = ensureGtag();
  gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_location: window.location.href,
    page_path: pathname,
    page_title: document.title,
  });
}

const bootstrapScript = `
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  try {
    var rawConsent = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
    if (rawConsent) {
      var savedConsent = JSON.parse(rawConsent);
      if (savedConsent && savedConsent.version === 1) {
        window.gtag('consent', 'update', {
          analytics_storage: savedConsent.analytics ? 'granted' : 'denied',
          ad_storage: savedConsent.advertising ? 'granted' : 'denied',
          ad_user_data: savedConsent.advertising ? 'granted' : 'denied',
          ad_personalization: savedConsent.advertising ? 'granted' : 'denied'
        });
      }
    }
  } catch (error) {}

  window.gtag('js', new Date());
  window.gtag('config', '${GA_MEASUREMENT_ID}', {
    send_page_view: true
  });
`;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const readyRef = useRef(false);
  const lastTrackedPathRef = useRef(pathname);

  useEffect(() => {
    if (!readyRef.current || !pathname) return;
    if (lastTrackedPathRef.current === pathname) return;

    lastTrackedPathRef.current = pathname;
    sendPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleConsentChanged = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      const consent = customEvent.detail ?? readConsent();
      applyConsent(consent);
    };

    window.addEventListener("sektorel:consent-changed", handleConsentChanged);

    return () => {
      window.removeEventListener("sektorel:consent-changed", handleConsentChanged);
    };
  }, []);

  const markReady = () => {
    readyRef.current = true;
    lastTrackedPathRef.current = pathname;
  };

  return (
    <>
      <Script
        id="google-analytics-bootstrap"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: bootstrapScript }}
      />
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={markReady}
        onReady={markReady}
      />
    </>
  );
}
