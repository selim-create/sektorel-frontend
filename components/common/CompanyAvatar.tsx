import { getAvatarColor, getInitials } from "@/lib/avatar-utils";

type CompanyAvatarProps = {
  name: string;
  className?: string;
};

export default function CompanyAvatar({ name, className = "" }: CompanyAvatarProps) {
  const initials = getInitials(name);
  const { from, to } = getAvatarColor(name);

  return (
    <div
      aria-label={name}
      className={`flex h-full w-full items-center justify-center ${className}`}
      role="img"
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      <span
        className="select-none font-black tracking-wider text-white"
        style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        {initials}
      </span>
    </div>
  );
}
