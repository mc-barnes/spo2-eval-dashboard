/**
 * Design system constants for the SpO2 Eval Dashboard.
 * These mirror the Streamlit theme.py values.
 */

// ── Core palette ──────────────────────────────────────────────
export const TEAL_DARK = "#2C5F5B";
export const TEAL_PRIMARY = "#5BA69E";
export const TEAL_LIGHT = "#6BACA4";
export const SAGE = "#8CBDB7";
export const SAGE_BG = "#E8F1EF";
export const CREAM = "#F7F0EA";
export const WARM_WHITE = "#FEFCFA";
export const BORDER = "#E2DDD8";
export const BODY_TEXT = "#3D4F5F";
export const MUTED = "#7A8B87";
export const URGENT_RED = "#C1565B";
export const AMBER = "#D4A054";
export const NEUTRAL_GRAY = "#9CA3AF";
export const EMERGENCY = "#8B2020";

// ── Label → color map (matches pipeline ground truth labels) ──
export const LABEL_COLORS: Record<string, string> = {
  normal: TEAL_LIGHT,
  borderline: AMBER,
  urgent: URGENT_RED,
  emergency: EMERGENCY,
  artifact: NEUTRAL_GRAY,
};

// ── Urgency → color map (matches HandoffSummary.urgency_level) ─
export const URGENCY_COLORS: Record<string, string> = {
  EMERGENCY: EMERGENCY,
  URGENT: URGENT_RED,
  MONITOR: AMBER,
  ROUTINE: TEAL_PRIMARY,
  "ARTIFACT REVIEW": NEUTRAL_GRAY,
};

// ── Tier chart colors (Tier 1, Tier 2, Expert) ────────────────
export const TIER_COLORS = [TEAL_PRIMARY, SAGE, AMBER] as const;

// ── Eval chart colors ─────────────────────────────────────────
export const EVAL_COLORS = [
  TEAL_PRIMARY,
  TEAL_LIGHT,
  SAGE,
  AMBER,
  URGENT_RED,
] as const;

// ── Plotly layout defaults ────────────────────────────────────
export const PLOTLY_LAYOUT = {
  font: {
    family: "DM Sans, sans-serif",
    color: BODY_TEXT,
    size: 13,
  },
  paper_bgcolor: WARM_WHITE,
  plot_bgcolor: WARM_WHITE,
  margin: { l: 48, r: 24, t: 40, b: 40 },
  colorway: [TEAL_PRIMARY, SAGE, TEAL_DARK, AMBER, URGENT_RED, TEAL_LIGHT],
  hoverlabel: {
    bgcolor: WARM_WHITE,
    bordercolor: BORDER,
    font: { family: "DM Sans, sans-serif", size: 13, color: BODY_TEXT },
  },
} as const;
