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
            {!loading && primary.length > 0 ? (
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
    <section className="border-b border-white/10 bg-white/[0.035]">
      <div className="container mx-auto grid gap-7 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary"><Mail className="h-4 w-4" /> Sektörel Ajanda Bülteni</span>
          <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight text-white md:text-3xl">İş dünyasının gündemi, yaklaşan etkinlikler ve yeni fırsatlar tek e-postada.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Sektörler, mevzuat, etkinlikler, firmalar, ticari fırsatlar ve kariyer başlıklarından editör seçkileri.</p>
        </div>

        <div>
          {status === "success" ? (
            <div className="flex items-start gap-3 border border-emerald-400/20 bg-emerald-400/10 p-4 text-white"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-emerald-700"><Check className="h-4 w-4" /></span><div><p className="text-sm font-bold">Seçimin kaydedildi.</p><p className="mt-1 text-xs leading-5 text-slate-300">{message}</p></div></div>
          ) : (
            <>
              {!loading ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {primary.map((option) => {
                    const checked = selected.includes(option.slug);
                    return (
                      <label key={option.slug} className={`cursor-pointer border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition ${checked ? "border-white/40 bg-white text-secondary" : "border-white/15 bg-white/5 text-slate-500"}`}>
                        <input className="sr-only" type="checkbox" checked={checked} onChange={() => setSelected((current) => current.includes(option.slug) ? current.filter((item) => item !== option.slug) : current.concat(option.slug))} />
                        {checked ? "✓ " : "○ "}{option.name}
                      </label>
                    );
                  })}
                  {network.length > 0 ? <button type="button" onClick={() => setModalOpen(true)} className="border border-primary/60 bg-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white">hiposta. keşfet {selectedNetwork.length ? `+${selectedNetwork.length}` : ""}</button> : null}
                </div>
              ) : <p className="mb-3 text-xs text-slate-500">Bültenler hazırlanıyor...</p>}

              <form onSubmit={submit}>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta adresiniz" className="min-w-0 border border-white/15 bg-white px-4 py-3 text-sm text-secondary outline-none focus:border-primary" required />
                  <button type="submit" disabled={submitting || loading || selected.length === 0 || !consent} className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500">{submitting ? "Kaydediliyor..." : <>Abone Ol <ArrowRight className="h-4 w-4" /></>}</button>
                </div>
                <input type="text" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
              </form>

              <label className="mt-2.5 flex cursor-pointer items-start gap-2 text-[10px] leading-5 text-slate-500">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600" />
                <span>Seçtiğim bültenleri e-posta ile almak istiyorum. <Link href="/gizlilik-politikasi" className="font-semibold text-slate-300 underline">Gizlilik</Link> ve <Link href="/kvkk" className="font-semibold text-slate-300 underline">KVKK</Link> metinlerini inceledim.</span>
              </label>
              {status === "error" ? <p className="mt-2 text-xs font-semibold text-red-300">{message}</p> : null}
            </>
          )}
        </div>
      </div>
      {modalOpen ? <HipostaNewsletterModal open options={network} selected={selectedNetwork} onClose={closeModal} onApply={applyNetwork} /> : null}
    </section>
  );
}
