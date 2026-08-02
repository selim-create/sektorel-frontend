import { BadgeCheck } from "lucide-react";

type VerificationBadgeProps = {
  isVerified?: boolean | null;
  featured?: boolean;
};

export default function VerificationBadge({ isVerified, featured = false }: VerificationBadgeProps) {
  if (!isVerified) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
      <BadgeCheck size={12} />
      {featured ? "Öne Çıkan" : "Onaylı"}
    </span>
  );
}
