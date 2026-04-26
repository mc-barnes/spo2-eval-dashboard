/**
 * MetricCard — KPI display card with accent bar and optional delta badge.
 */
import { TEAL_PRIMARY } from "../../config/theme";

interface MetricCardProps {
  label: string;
  value: string;
  accentColor?: string;
  delta?: string;
  deltaColor?: string;
}

export default function MetricCard({
  label,
  value,
  accentColor = TEAL_PRIMARY,
  delta,
  deltaColor,
}: MetricCardProps) {
  return (
    <div className="bg-white border border-border rounded-card shadow-sm overflow-hidden">
      {/* 4px accent bar */}
      <div
        className="h-1"
        style={{ backgroundColor: accentColor }}
      />
      <div className="px-5 py-4 flex flex-col gap-1">
        <span className="text-muted uppercase tracking-wider font-body" style={{ fontSize: "0.75rem" }}>
          {label}
        </span>
        <span className="text-teal-dark font-semibold" style={{ fontSize: "1.7rem" }}>
          {value}
        </span>
        {delta && (
          <span
            className="text-muted"
            style={{ fontSize: "0.8rem", ...(deltaColor ? { color: deltaColor } : {}) }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
