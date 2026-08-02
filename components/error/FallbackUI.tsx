"use client";

import Link from "next/link";

type FallbackUIProps = {
  title: string;
  message: string;
  actionLabel?: string;
  href?: string;
  onRetry?: () => void;
};

export default function FallbackUI({
  title,
  message,
  actionLabel = "Ana sayfaya dön",
  href,
  onRetry,
}: FallbackUIProps) {
  return (
    <div className="min-h-[320px] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-none border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-black text-secondary">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry ? (
            <button
              className="bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover"
              onClick={onRetry}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}

          {href ? (
            <Link
              className="border border-gray-200 px-5 py-3 text-sm font-bold uppercase tracking-wide text-secondary transition-colors hover:border-primary hover:text-primary"
              href={href}
            >
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
