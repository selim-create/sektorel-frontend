"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureSession, subscribeToAuthChanges } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      setReady(false);
      const authenticated = await ensureSession();

      if (!active) return;

      if (!authenticated) {
        const redirect = pathname || "/hesabim";
        router.replace(`/giris?redirect=${encodeURIComponent(redirect)}`);
        return;
      }

      setReady(true);
    };

    void verifySession();

    const unsubscribe = subscribeToAuthChanges(() => {
      void verifySession();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-500">Oturum doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
