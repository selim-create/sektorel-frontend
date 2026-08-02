const GRADIENTS = [
  { from: "#FF6B35", to: "#F7931E" }, // Orange → Red
  { from: "#8B5CF6", to: "#3B82F6" }, // Purple → Blue
  { from: "#10B981", to: "#06B6D4" }, // Green → Teal
  { from: "#6366F1", to: "#A855F7" }, // Indigo → Purple
  { from: "#06B6D4", to: "#0EA5E9" }, // Cyan → Blue
  { from: "#F43F5E", to: "#FB923C" }, // Rose → Orange
  { from: "#F59E0B", to: "#F97316" }, // Amber → Orange
  { from: "#10B981", to: "#14B8A6" }, // Emerald → Teal
];

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
}

export function getAvatarColor(name: string): { from: string; to: string } {
  const index = hashString(name) % GRADIENTS.length;
  return GRADIENTS[index];
}
