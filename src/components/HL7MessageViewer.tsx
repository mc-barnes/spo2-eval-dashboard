/**
 * HL7MessageViewer — renders an HL7v2 message with segment-level syntax highlighting.
 * Splits on \r and colors segment IDs and pipe delimiters.
 */
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  TEAL_LIGHT,
  SAGE,
  AMBER,
  URGENT_RED,
  MUTED,
} from "../config/theme.ts";

/** Segment ID → highlight color. */
const SEGMENT_COLORS: Record<string, string> = {
  MSH: TEAL_DARK,
  PID: TEAL_PRIMARY,
  PV1: TEAL_LIGHT,
  OBX: "#6B8F71",
  OBR: "#6B8F71",
  NTE: AMBER,
  DG1: URGENT_RED,
  MSA: TEAL_PRIMARY,
  EVN: SAGE,
};

interface HL7MessageViewerProps {
  message: string;
  title: string;
}

export default function HL7MessageViewer({ message, title }: HL7MessageViewerProps) {
  // Split on \r (HL7 standard) or \n (fallback)
  const segments = message.split(/\r|\n/).filter(Boolean);

  return (
    <div>
      <h4 className="font-heading text-sm font-semibold text-teal-dark mb-2">
        {title}
      </h4>
      <pre className="bg-cream border border-border rounded-table p-4 overflow-x-auto text-xs leading-relaxed">
        {segments.map((seg, i) => {
          const segId = seg.substring(0, 3);
          const segColor = SEGMENT_COLORS[segId] ?? MUTED;

          return (
            <div key={i}>
              {/* Segment ID */}
              <span style={{ color: segColor, fontWeight: 600 }}>{segId}</span>
              {/* Remaining fields with pipe highlighting */}
              {seg
                .substring(3)
                .split("|")
                .map((part, j) => (
                  <span key={j}>
                    <span style={{ color: MUTED }}>|</span>
                    <span style={{ color: segColor, opacity: 0.85 }}>{part}</span>
                  </span>
                ))}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
