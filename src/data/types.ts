/**
 * TypeScript interfaces for all pipeline JSON data.
 * Mirrors the Python dataclasses in the eval pipeline.
 */

// ── Pipeline overview ─────────────────────────────────────────
export interface PipelineSummary {
  total_traces: number;
  tier1_auto: number;
  tier2_auto: number;
  expert_queue: number;
  tier1_pct: number;
  tier2_pct: number;
  expert_pct: number;
  overall_accuracy: number;
  tier1_accuracy: number;
  tier2_accuracy: number;
  expert_accuracy: number;
  emergency_count: number;
  urgent_false_negatives: number;
}

// ── Baby / trace metadata ─────────────────────────────────────
export interface BabyInfo {
  baby_id: string;
  gestational_age_weeks: number;
  ga_category: string;
  birth_weight_grams: number;
  days_since_birth: number;
  known_conditions: string[];
  spo2_baseline: number;
  spo2_variability: number;
}

export interface TraceStats {
  mean_spo2: number;
  min_spo2: number;
  std_spo2: number;
  n_events: number;
}

export interface TraceMeta {
  night_id: string;
  baby: BabyInfo;
  night_number: number;
  ground_truth_label: string;
  final_label: string;
  source: string;
  confidence: number;
  stats: TraceStats;
}

// ── Coverage / confusion matrix ───────────────────────────────
export interface CrosstabRow {
  ground_truth: string;
  "Tier 1": number;
  "Tier 2": number;
  Expert: number;
}

export interface LabelMetrics {
  sensitivity: number;
  ppv: number;
  f1: number;
  support: number;
}

export interface CoverageBreakdown {
  crosstab: CrosstabRow[];
  per_label_metrics: Record<string, LabelMetrics>;
  tier_accuracy: Record<string, number>;
}

// ── Rule discovery ────────────────────────────────────────────
export interface Rule {
  rule_id: string;
  source: string;
  description: string;
  confidence: number;
  support: number;
  consequent: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface RulesDiscovered {
  total_rules: number;
  tree_rules_count: number;
  apriori_rules_count: number;
  rules: Rule[];
  feature_importance: FeatureImportance[];
}

// ── LLM-as-judge eval scores ──────────────────────────────────
export interface EvalSummary {
  pass_rate: number;
  total: number;
  pass_count: number;
}

export interface EvalDetail {
  trace_id: string;
  evaluator: string;
  answer: string;
  source: string;
}

export interface EvalScores {
  overall_pass_rate: number;
  overall_total: number;
  summary: Record<string, EvalSummary>;
  details: EvalDetail[];
}

// ── Expert handoff samples ────────────────────────────────────
export interface HandoffSample {
  trace_id: string;
  urgency_level: string;
  summary_text: string;
  source: string;
  final_label: string;
  baby: BabyInfo;
  stats: {
    mean_spo2: number;
    min_spo2: number;
    n_events: number;
  };
}

export type HandoffSamples = Record<string, HandoffSample>;

// ── Trend tier (multi-night EWMA features) ────────────────────
export interface TrendBaby {
  baby_id: string;
  condition: string;
  n_nights: number;
  sat_seconds_series: number[];
  ewma_series: number[];
  trend_score: number;
  trend_direction: "deteriorating" | "stable" | string;
  flagged: boolean;
  flag_reason: string;
  baseline_sat_seconds: number;
}

export interface TrendFeatures {
  schema_version: number;
  generated_at: string;
  babies: Record<string, TrendBaby>;
}

// ── Waveform data ─────────────────────────────────────────────
export interface WaveformData {
  spo2: number[];
  accel: number[];
  hours: number[];
}

// ── HL7v2 interoperability ────────────────────────────────────
export interface RoundTripField {
  field: string;
  original: string;
  parsed: string;
  match: boolean;
}

export interface HL7LabelData {
  trace_id: string;
  adt_a01: string;
  ack_a01: string;
  oru_r01: string;
  round_trip_fields: RoundTripField[];
  adt_segment_count: number;
  oru_obx_count: number;
  round_trip_match: boolean;
  urgency_level: string;
  final_label: string;
  baby: BabyInfo;
  stats: {
    mean_spo2: number;
    min_spo2: number;
    n_events: number;
  };
}

export interface SegmentMapping {
  field: string;
  name: string;
  source: string;
  description: string;
}

export interface ProductionNote {
  title: string;
  description: string;
}

export type HL7Messages = Record<string, HL7LabelData> & {
  _segment_mapping: SegmentMapping[];
  _production_notes: ProductionNote[];
};
