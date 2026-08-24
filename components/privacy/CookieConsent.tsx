"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings2, X } from "lucide-react";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
  version: 1;
};

export const CONSENT_STORAGE_KEY = "sektorel.cookieConsent.v1";

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
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      version: 1,
    };
  } catch {
    return null;
  }
}

function persistConsent(analytics: boolean, advertising: boolean) {
  const value: ConsentPreferences = {
    necessary: true,
    analytics,
    advertising,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("sektorel:consent-changed", { detail: value }));
  return value;
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const existing = readConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setAdvertising(existing.advertising);
      } else {
        setOpen(true);
      }
      setMounted(true);
    }, 0);

    const openPreferences = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setAdvertising(current?.advertising ?? false);
      setPreferencesOpen(true);
      setOpen(true);
    };
    window.addEventListener("sektorel:open-cookie-preferences", openPreferences);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("sektorel:open-cookie-preferences", openPreferences);
    };
  }, []);

  if (!mounted || !open) return null;

  const save = (nextAnalytics: boolean, nextAdvertising: boolean) => {
    persistConsent(nextAnalytics, nextAdvertising);
    setAnalytics(nextAnalytics);
    setAdvertising(nextAdvertising);
    setOpen(false);
    setPreferencesOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.14)]">
      <div className="container mx-auto px-4 py-5 md:py-6">
        <div className="flex items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wider text-secondary">Gizlilik Tercihleri</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sektörel Ajanda&apos;nın çalışması için gerekli teknolojileri kullanıyoruz. Analitik ve reklam/kişiselleştirme teknolojileri ise yalnız tercihiniz doğrultusunda etkinleştirilecektir.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
              <Link className="text-primary hover:underline" href="/cerez-politikasi">Çerez Politikası</Link>
              <Link className="text-primary hover:underline" href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            </div>
          </div>
          <button aria-label="Kapat" className="text-gray-400 hover:text-secondary" onClick={() => setOpen(false)} type="button">
            <X size={20} />
          </button>
        </div>

        {preferencesOpen ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-secondary">Gerekli</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">Oturum, güvenlik ve temel site işlevleri.</p>
                </div>
                <span className="bg-secondary px-2 py-1 text-[10px] font-black uppercase text-white">Her zaman açık</span>
              </div>
            </div>
            <label className="cursor-pointer border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-secondary">Analitik</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">Kullanımı ve performansı ölçmemize yardımcı olur.</p>
                </div>
                <input checked={analytics} className="h-5 w-5 accent-orange-600" onChange={(event) => setAnalytics(event.target.checked)} type="checkbox" />
              </div>
            </label>
            <label className="cursor-pointer border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-secondary">Reklam & Kişiselleştirme</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">Reklam ölçümü ve kişiselleştirme amaçlı teknolojiler.</p>
                </div>
                <input checked={advertising} className="h-5 w-5 accent-orange-600" onChange={(event) => setAdvertising(event.target.checked)} type="checkbox" />
              </div>
            </label>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-secondary hover:border-secondary" onClick={() => setPreferencesOpen((value) => !value)} type="button">
            <Settings2 size={15} /> Tercihleri Yönet
          </button>
          <button className="border border-gray-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-secondary hover:border-secondary" onClick={() => save(false, false)} type="button">
            Yalnız Gerekli
          </button>
          {preferencesOpen ? (
            <button className="bg-secondary px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-black" onClick={() => save(analytics, advertising)} type="button">
              Tercihleri Kaydet
            </button>
          ) : null}
          <button className="bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-hover" onClick={() => save(true, true)} type="button">
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
