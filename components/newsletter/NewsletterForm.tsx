"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import HipostaNewsletterModal from "@/components/newsletter/HipostaNewsletterModal";
import { getNewsletterOptions, subscribeNewsletters } from "@/lib/newsletter-client";
import type { HipostaNewsletterOption, NewsletterSourceId } from "@/lib/hiposta-newsletters";

type Props = {
  source: NewsletterSourceId;
  variant?: "footer" | "sidebar";
};

export default function NewsletterForm({ source, variant = "footer" }: Props) {
  const [options, setOptions] = useState<HipostaNewsletterOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getNewsletterOptions()
      .then((rows) => {
        if (!active) return;
        setOptions(rows);
        setSelected(rows.filter((option) => option.isPrimary).map((option) => option.slug));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const primary = useMemo(() => options.filter((option) => option.isPrimary), [options]);
  const network = useMemo(() => options.filter((option) => !option.isPrimary), [options]);
  const selectedNetwork = useMemo(() => selected.filter((slug) => network.some((option) => option.slug === slug)), [selected, network]);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const applyNetwork = (networkSlugs: string[]) => {
    const primarySlugs = primary.filter((option) => selected.includes(option.slug)).map((option) => option.slug);
    setSelected(Array.from(new Set(primarySlugs.concat(networkSlugs))));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");

    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (selected.length === 0) {
      setStatus("error");
      setMessage("En az bir bülten seçmelisiniz.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage("Bülten aboneliği için onay vermelisiniz.");
      return;
    }

    setSubmitting(true);
    const result = await subscribeNewsletters({ email, newsletters: selected, source, website });
    setSubmitting(false);
    setStatus(result.success ? "success" : "error");
    setMessage(result.message);

    if (result.success) {
      setEmail("");
      setConsent(false);
      setWebsite("");
      setSelected(primary.map((option) => option.slug));
    }
  };

  if (variant === "sidebar") {
    return (
      <div className="mt-8 border-t border-gray-100 pt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-secondary">Sektörel Bültene Abone Ol</h3>
            <p className="mt-1 text-[10px] leading-4 text-gray-500">Gündem, mevzuat, etkinlik ve fırsat seçkileri e-postana gelsin.</p>
          </div>
          <Mail size={18} className="shrink-0 text-primary" />
        </div>

        {status === "success" ? (
          <div className="border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-700"><strong>Seçimin kaydedildi.</strong><br />{message}</div>
        ) : (
          <>
            {!loading && primary.length > 1 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {primary.map((option) => {
                  const checked = selected.includes(option.slug);
                  return (
                    <label key={option.slug} className={`cursor-pointer border px-2 py-1.5 text-[9px] font-black uppercase tracking-wide ${checked ? "border-primary bg-orange-50 text-primary" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                      <input className="sr-only" type="checkbox" checked={checked} onChange={() => setSelected((current) => current.includes(option.slug) ? current.filter((item) => item !== option.slug) : current.concat(option.slug))} />
                      {checked ? "✓ " : "○ "}{option.name}
                    </label>
                  );
                })}
              </div>
            ) : null}

            <form onSubmit={submit} className="space-y-2">
              <div className="flex">
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" className="min-w-0 w-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-primary" required />
                <button type="submit" disabled={submitting || loading || selected.length === 0 || !consent} className="bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">{submitting ? "…" : "→"}</button>
              </div>
              <input type="text" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
            </form>

            <label className="mt-2 flex cursor-pointer items-start gap-2 text-[9px] leading-4 text-gray-400">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-orange-600" />
              <span>Seçtiğim bültenleri e-posta ile almak istiyorum. <Link href="/gizlilik-politikasi" className="font-bold underline">Gizlilik</Link> ve <Link href="/kvkk" className="font-bold underline">KVKK</Link> metinlerini inceledim.</span>
            </label>
            {network.length > 0 ? <button type="button" onClick={() => setModalOpen(true)} className="mt-2 text-[9px] font-black uppercase tracking-wider text-primary hover:underline">hiposta. ağını keşfet {selectedNetwork.length ? `+${selectedNetwork.length}` : ""}</button> : null}
            {status === "error" ? <p className="mt-2 text-[10px] font-semibold text-red-600">{message}</p> : null}
          </>
        )}

        {modalOpen ? <HipostaNewsletterModal open options={network} selected={selectedNetwork} onClose={closeModal} onApply={applyNetwork} /> : null}
      </div>
    );
  }

  return (
    <div className="bg-white p-5 shadow-[0_18px_60px_rgba(17,24,39,0.08)] sm:p-6 md:p-7">
      {status === "success" ? (
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-black text-secondary">Seçimin kaydedildi.</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{message}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">E-posta listesi</p>
              <p className="mt-1 text-sm font-bold text-secondary">Sektörel Ajanda seçkisine katılın.</p>
            </div>
            <Mail className="h-5 w-5 text-primary" />
          </div>

          {primary.length > 1 && !loading ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {primary.map((option) => {
                const checked = selected.includes(option.slug);
                return (
                  <label key={option.slug} className={`cursor-pointer border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition ${checked ? "border-primary bg-orange-50 text-primary" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                    <input className="sr-only" type="checkbox" checked={checked} onChange={() => setSelected((current) => current.includes(option.slug) ? current.filter((item) => item !== option.slug) : current.concat(option.slug))} />
                    {checked ? "✓ " : "○ "}{option.name}
                  </label>
                );
              })}
            </div>
          ) : null}

          <form onSubmit={submit}>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta adresiniz" className="min-w-0 border border-slate-200 bg-[#faf9f6] px-4 py-3.5 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white" required />
              <button type="submit" disabled={submitting || loading || selected.length === 0 || !consent} className="inline-flex items-center justify-center gap-2 bg-secondary px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{submitting ? "Kaydediliyor..." : <>Abone Ol <ArrowRight className="h-4 w-4" /></>}</button>
            </div>
            <input type="text" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
          </form>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <label className="flex max-w-xl cursor-pointer items-start gap-2 text-[10px] leading-5 text-slate-500">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600" />
              <span>E-posta ile bülten almak istiyorum. <Link href="/gizlilik-politikasi" className="font-semibold text-secondary underline">Gizlilik</Link> ve <Link href="/kvkk" className="font-semibold text-secondary underline">KVKK</Link> metinlerini inceledim.</span>
            </label>
            {network.length > 0 ? <button type="button" onClick={() => setModalOpen(true)} className="shrink-0 text-left text-[10px] font-black uppercase tracking-[0.12em] text-primary transition hover:text-secondary sm:text-right">hiposta. diğer bültenler {selectedNetwork.length ? `+${selectedNetwork.length}` : ""}</button> : null}
          </div>

          {status === "error" ? <p className="mt-3 text-xs font-semibold text-red-600">{message}</p> : null}
        </>
      )}

      {modalOpen ? <HipostaNewsletterModal open options={network} selected={selectedNetwork} onClose={closeModal} onApply={applyNetwork} /> : null}
    </div>
  );
}
