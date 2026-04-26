/**
 * DetailRow — key/value row for patient or trace detail panels.
 */
interface DetailRowProps {
  label: string;
  value: string;
}

export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div
      className="flex items-baseline justify-between border-b border-border"
      style={{ padding: "6px 0" }}
    >
      <span className="text-teal-light" style={{ fontSize: "0.85rem" }}>
        {label}
      </span>
      <span className="text-teal-dark font-medium text-right" style={{ fontSize: "0.85rem" }}>
        {value}
      </span>
    </div>
  );
}
