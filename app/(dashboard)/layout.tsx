import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";
import CompanyProfileMediaEnhancer from "@/components/dashboard/CompanyProfileMediaEnhancer";
import { createNoIndexMetadata } from "@/lib/noindex-metadata";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Hesabım",
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <CompanyProfileMediaEnhancer />
      {children}
    </DashboardShell>
  );
}
