/**
 * ConditionChip — pill chip for trend-tier conditions (AOP / BPD / CHD interstage).
 */
import {
  CONDITION_COLORS,
  CONDITION_LABELS,
  MUTED,
  TEAL_DARK,
} from "../../config/theme";

interface ConditionChipProps {
  condition: string;
}

export default function ConditionChip({ condition }: ConditionChipProps) {
  const color = CONDITION_COLORS[condition] ?? MUTED;
  const label = CONDITION_LABELS[condition] ?? condition;
  return (
    <span
      className="inline-flex items-center rounded-full font-medium"
      style={{
        backgroundColor: `${color}22`,
        color: TEAL_DARK,
        border: `1px solid ${color}`,
        padding: "2px 10px",
        fontSize: "0.7rem",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}
