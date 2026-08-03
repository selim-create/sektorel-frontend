import DashboardShell from "@/components/dashboard/DashboardShell";
import CompanyProfileMediaEnhancer from "@/components/dashboard/CompanyProfileMediaEnhancer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <CompanyProfileMediaEnhancer />
      {children}
    </DashboardShell>
  );
}
