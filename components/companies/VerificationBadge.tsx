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
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
      <BadgeCheck className="shrink-0" size={12} />
      {featured ? "Öne Çıkan" : "Onaylı"}
    </span>
  );
}
