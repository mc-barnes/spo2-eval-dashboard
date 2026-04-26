/**
 * HorizontalBar — horizontal progress bars with labels and percentage values.
 */
interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface HorizontalBarProps {
  items: BarItem[];
}

export default function HorizontalBar({ items }: HorizontalBarProps) {
  return (
    <div className="flex flex-col" style={{ gap: "14px" }}>
      {items.map((item) => {
        const widthPct = Math.max(item.value, 3);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-body font-body" style={{ fontSize: "0.85rem" }}>
                {item.label}
              </span>
              <span className="text-body font-body font-medium" style={{ fontSize: "0.85rem" }}>
                {item.value}%
              </span>
            </div>
            <div className="bg-sage-bg overflow-hidden" style={{ height: "10px", borderRadius: "5px" }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: item.color,
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
