"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";

export default function CookiePreferencesPage() {
  const openPreferences = () => {
    window.dispatchEvent(new Event("sektorel:open-cookie-preferences"));
  };

  return (
    <div className="mx-auto max-w-4xl py-8 md:py-14">
      <div className="border border-gray-200 bg-white p-7 shadow-sm md:p-10">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
          <Settings2 size={15} /> Gizlilik Tercihleri
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-secondary md:text-5xl">Çerez Tercihleri</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
          Gerekli teknolojiler site ve hesap işlevlerinin çalışması için her zaman aktiftir. Analitik ile reklam/kişiselleştirme kategorilerini dilediğiniz zaman değiştirebilirsiniz.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-gray-200 bg-gray-50 p-5">
            <p className="font-black text-secondary">Gerekli</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Oturum, güvenlik ve temel platform işlevleri.</p>
            <span className="mt-4 inline-block bg-secondary px-2 py-1 text-[10px] font-black uppercase text-white">Her zaman açık</span>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <p className="font-black text-secondary">Analitik</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Kullanımı, performansı ve ürün deneyimini ölçmemize yardımcı olur.</p>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <p className="font-black text-secondary">Reklam & Kişiselleştirme</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Reklam ölçümü ve isteğe bağlı kişiselleştirme teknolojileri.</p>
          </div>
        </div>

        <button className="mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-hover" onClick={openPreferences} type="button">
          <Settings2 size={16} /> Tercihlerimi Yönet
        </button>

        <p className="mt-6 text-sm leading-7 text-gray-500">
          Ayrıntılı bilgi için <Link className="font-bold text-primary hover:underline" href="/cerez-politikasi">Çerez Politikası</Link> ve <Link className="font-bold text-primary hover:underline" href="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfalarını inceleyebilirsiniz.
        </p>
      </div>
    </div>
  );
}
