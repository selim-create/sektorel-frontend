"use client";

import { useEffect, useRef } from "react";

type XWidgets = { widgets?: { load?: (element?: HTMLElement) => void } };
declare global { interface Window { twttr?: XWidgets } }

export default function ArticleEmbeds() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current?.previousElementSibling as HTMLElement | null;
    if (!element || !element.querySelector("blockquote.twitter-tweet, .twitter-tweet")) return;
    const load = () => window.twttr?.widgets?.load?.(element);
    if (window.twttr?.widgets?.load) { load(); return; }
    const scriptId = "sektorel-x-widgets";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.head.appendChild(script);
    }
    script.addEventListener("load", load);
    return () => script?.removeEventListener("load", load);
  }, []);
  return <div ref={ref} hidden aria-hidden="true" />;
}
