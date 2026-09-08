"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export default function LegacyNewsletterBridge() {
  useEffect(() => {
    const heading = Array.from(document.querySelectorAll("h3")).find(
      (element) => element.textContent?.trim() === "Bültene Abone Ol"
    );
    const target = heading?.parentElement;
    if (!target) return;

    const originalChildren = Array.from(target.children) as HTMLElement[];
    originalChildren.forEach((child) => { child.style.display = "none"; });

    const mount = document.createElement("div");
    target.appendChild(mount);
    const root = createRoot(mount);
    root.render(<NewsletterForm source="sektorel-ajanda_news_sidebar" variant="sidebar" />);

    return () => {
      root.unmount();
      mount.remove();
      originalChildren.forEach((child) => { child.style.removeProperty("display"); });
    };
  }, []);

  return null;
}
