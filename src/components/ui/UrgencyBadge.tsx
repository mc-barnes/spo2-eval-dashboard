/**
 * UrgencyBadge — colored pill badge by clinical urgency level.
 */
import { URGENCY_COLORS, TEAL_LIGHT } from "../../config/theme";

interface UrgencyBadgeProps {
  level: string;
}

export default function UrgencyBadge({ level }: UrgencyBadgeProps) {
  const bgColor = URGENCY_COLORS[level] ?? TEAL_LIGHT;

  return (
    <span
      className="inline-block text-white font-semibold rounded-badge"
      style={{
        backgroundColor: bgColor,
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        padding: "6px 18px",
      }}
    >
      {level}
    </span>
  );
}
