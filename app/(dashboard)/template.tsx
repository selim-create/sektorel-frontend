import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
