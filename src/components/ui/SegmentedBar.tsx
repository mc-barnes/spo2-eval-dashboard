/**
 * SegmentedBar — multi-segment stacked horizontal bar with legend.
 */
interface Segment {
  label: string;
  count: number;
  color: string;
}

interface SegmentedBarProps {
  segments: Segment[];
  total: number;
  title?: string;
  subtitle?: string;
}

export default function SegmentedBar({
  segments,
  total,
  title,
  subtitle,
}: SegmentedBarProps) {
  return (
    <div className="bg-white border border-border rounded-card shadow-sm" style={{ padding: "24px" }}>
      {title && (
        <>
          <div className="mb-3">
            <h3
              className="font-heading text-teal-dark"
              style={{ fontSize: "1.15rem", fontWeight: 500 }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-muted mt-0.5" style={{ fontSize: "0.8rem" }}>
                {subtitle}
              </p>
            )}
          </div>
          <hr className="border-border mb-4" />
        </>
      )}

      {/* Segmented bar */}
      <div
        className="flex overflow-hidden"
        style={{ height: "40px", borderRadius: "8px" }}
      >
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.count / total) * 100 : 0;
          return (
            <div
              key={seg.label}
              className="flex items-center justify-center text-white font-semibold"
              style={{
                width: `${pct}%`,
                backgroundColor: seg.color,
                fontSize: "0.8rem",
              }}
              title={`${seg.label}: ${seg.count}`}
            >
              {seg.count > 0 && seg.count}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {segments.map((seg) => {
          const pct = total > 0 ? ((seg.count / total) * 100).toFixed(1) : "0.0";
          return (
            <div key={seg.label} className="flex items-center gap-2 text-body" style={{ fontSize: "0.85rem" }}>
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{ width: "10px", height: "10px", backgroundColor: seg.color }}
              />
              <span className="font-medium">{seg.label}</span>
              <span className="text-muted">
                {seg.count} traces &middot; {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
