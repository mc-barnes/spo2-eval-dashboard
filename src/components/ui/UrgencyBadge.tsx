/**
 * UrgencyBadge — colored pill badge by clinical urgency level. Pairs color with
 * a leading glyph so urgent vs emergency don't collapse for colorblind users or
 * under dim ambient lighting. Emergency additionally carries an outline ring.
 */
import { URGENCY_COLORS, URGENCY_GLYPHS, TEAL_LIGHT } from "../../config/theme";

interface UrgencyBadgeProps {
  level: string;
}

export default function UrgencyBadge({ level }: UrgencyBadgeProps) {
  const bgColor = URGENCY_COLORS[level] ?? TEAL_LIGHT;
  const glyph = URGENCY_GLYPHS[level];
  const isEmergency = level === "EMERGENCY";

  return (
    <span
      className="inline-flex items-center gap-1.5 text-white font-semibold rounded-badge"
      style={{
        backgroundColor: bgColor,
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        padding: "6px 18px",
        ...(isEmergency
          ? { boxShadow: `0 0 0 2px ${bgColor}, 0 0 0 4px rgba(139,32,32,0.25)` }
          : {}),
      }}
      aria-label={`Urgency: ${level}`}
    >
      {glyph && (
        <span aria-hidden="true" style={{ fontSize: "0.75rem", lineHeight: 1 }}>
          {glyph}
        </span>
      )}
      {level}
    </span>
  );
}
