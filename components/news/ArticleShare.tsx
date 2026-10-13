"use client";

import { useState } from "react";
import { Copy, Facebook, Linkedin, Twitter } from "lucide-react";

export default function ArticleShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const items = [
    { label: "Facebook'ta paylaş", icon: Facebook, url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url) },
    { label: "X'te paylaş", icon: Twitter, url: "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title) },
    { label: "LinkedIn'de paylaş", icon: Linkedin, url: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url) },
  ];
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Bağlantıyı kopyalayın:", url);
    }
  }
  return (
    <nav aria-label="Haberi paylaş" className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-center">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 lg:mb-2 lg:mr-0">Paylaş</span>
      {items.map(({ label, icon: Icon, url: target }) => (
        <a key={label} href={target} aria-label={label} target="_blank" rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-primary hover:text-primary">
          <Icon size={18} />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Bağlantıyı kopyala"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-primary hover:text-primary">
        <Copy size={18} />
      </button>
      {copied && <span role="status" className="text-center text-[10px] font-semibold text-green-700">Kopyalandı</span>}
    </nav>
  );
}
