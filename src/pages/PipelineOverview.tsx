/**
 * PipelineOverview — landing page. Shows pipeline flow diagram, KPI cards,
 * accuracy breakdown, ground truth distribution, triage bar, and clinical metrics.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { usePipelineData } from "../hooks/usePipelineData.tsx";
import { loadCoverageBreakdown, loadTrendFeatures } from "../data/loader.ts";
import type { CoverageBreakdown, TrendFeatures } from "../data/types.ts";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import HorizontalBar from "../components/ui/HorizontalBar.tsx";
import SegmentedBar from "../components/ui/SegmentedBar.tsx";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE,
  AMBER,
  URGENT_RED,
  NEUTRAL_GRAY,
  MUTED,
  LABEL_COLORS,
  LABEL_GLYPHS,
  TIER_COLORS,
} from "../config/theme.ts";

/** Phase data for the pipeline flow diagram. */
const PHASES = [
  { num: 1, name: "Synthetic Data", metric: "400 traces" },
  { num: 2, name: "Tier 1 Rules", metric: "58% auto" },
  { num: 3, name: "Pattern Mining", metric: "28 rules" },
  { num: 4, name: "Tier 2 ML", metric: "39% auto" },
  { num: 5, name: "Expert Queue", metric: "2.7% review" },
  { num: 6, name: "Handoff Gen", metric: "8 samples" },
  { num: 7, name: "LLM Evals", metric: "85% pass" },
];

export default function PipelineOverview() {
  const { summary, traces, loading, error } = usePipelineData();
  const [coverage, setCoverage] = useState<CoverageBreakdown | null>(null);
  const [trend, setTrend] = useState<TrendFeatures | null>(null);

  useEffect(() => {
    loadCoverageBreakdown().then(setCoverage).catch(console.error);
    loadTrendFeatures().then(setTrend).catch(console.error);
  }, []);

  if (loading) {
    return <div className="text-muted text-sm">Loading pipeline data...</div>;
  }
  if (error) {
    return <div className="text-urgent-red text-sm">Error: {error}</div>;
  }
  if (!summary) {
    return null;
  }

  // --- Ground truth distribution for pie chart ---
  const labelCounts: Record<string, number> = {};
  for (const t of traces) {
    const lbl = t.ground_truth_label.toLowerCase();
    labelCounts[lbl] = (labelCounts[lbl] ?? 0) + 1;
  }
  const pieData = Object.entries(labelCounts).map(([label, count]) => ({
    name: label,
    value: count,
  }));

  // --- Per-label metrics table rows ---
  // When support < 5, sensitivity/PPV/F1 are not statistically meaningful — render "—".
  const LOW_SUPPORT_THRESHOLD = 5;
  const metricsRows = coverage
    ? Object.entries(coverage.per_label_metrics).map(([label, m]) => {
        const lowSupport = m.support < LOW_SUPPORT_THRESHOLD;
        return {
          label,
          sensitivityRaw: m.sensitivity,
          sensitivity: lowSupport ? "—" : m.sensitivity.toFixed(1) + "%",
          ppv: lowSupport ? "—" : m.ppv.toFixed(1) + "%",
          f1: lowSupport ? "—" : m.f1.toFixed(1) + "%",
          n: m.support,
          isHighStakes: label === "urgent" || label === "emergency",
          lowSupport,
        };
      })
    : [];
  const anyLowSupport = metricsRows.some((r) => r.lowSupport);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="font-heading text-2xl font-semibold">Pipeline Overview</h1>

      {/* Intro stats */}
      <PageIntro>
        {summary.total_traces} traces processed &middot; Tier 1 covers{" "}
        {summary.tier1_pct.toFixed(1)}% of traces automatically &middot; Tier 1
        accuracy {summary.tier1_accuracy.toFixed(1)}%
      </PageIntro>

      {/* ─── How It Works: pipeline flow diagram ─────────────────── */}
      <SectionCard title="How It Works" subtitle="7-phase evaluation pipeline">
        <div className="flex items-center gap-0 overflow-x-auto py-2">
          {PHASES.map((phase, i) => (
            <div key={phase.num} className="flex items-center shrink-0">
              {/* Phase box */}
              <div
                className="border-2 rounded-card px-4 py-3 min-w-[120px] text-center bg-warm-white"
                style={{ borderColor: TEAL_PRIMARY }}
              >
                <div
                  className="uppercase tracking-wider mb-1"
                  style={{ color: TEAL_PRIMARY, fontSize: "0.65rem", fontWeight: 600 }}
                >
                  Phase {phase.num}
                </div>
                <div
                  className="font-semibold text-teal-dark leading-tight"
                  style={{ fontSize: "0.75rem" }}
                >
                  {phase.name}
                </div>
                <div className="text-muted mt-1" style={{ fontSize: "0.65rem" }}>
                  {phase.metric}
                </div>
              </div>
              {/* Arrow connector (skip after last) */}
              {i < PHASES.length - 1 && (
                <div className="flex items-center px-1 text-teal-primary">
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path
                      d="M0 6h20m0 0l-4-4m4 4l-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ─── KPI metric cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Traces"
          value={String(summary.total_traces)}
          accentColor={TEAL_DARK}
        />
        <MetricCard
          label="Tier 1 Rules"
          value={String(summary.tier1_auto)}
          accentColor={TEAL_PRIMARY}
          delta={`${summary.tier1_pct.toFixed(1)}% of total`}
          deltaColor={TEAL_PRIMARY}
        />
        <MetricCard
          label="Tier 2 ML"
          value={String(summary.tier2_auto)}
          accentColor={SAGE}
          delta={`${summary.tier2_pct.toFixed(1)}% of total`}
          deltaColor={SAGE}
        />
        <MetricCard
          label="Expert Queue"
          value={String(summary.expert_queue)}
          accentColor={AMBER}
          delta={`${summary.expert_pct.toFixed(1)}% of total`}
          deltaColor={AMBER}
        />
      </div>

      {/* ─── Trend tier tile (per-baby denominator) ──────────────── */}
      {trend && (() => {
        const babies = Object.values(trend.babies);
        const flagged = babies.filter((b) => b.flagged).length;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Link
              to="/pipeline/trends"
              className="block lg:col-span-2 transition-shadow hover:shadow-md rounded-card"
            >
              <MetricCard
                label="Trend tier (multi-night)"
                value={String(flagged)}
                accentColor={URGENT_RED}
                delta={`${flagged} of ${babies.length} babies flagged · click Trends →`}
                deltaColor={URGENT_RED}
              />
            </Link>
          </div>
        );
      })()}

      {/* ─── Two-column: Accuracy + Pie ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Accuracy by Tier */}
        <SectionCard title="Accuracy by Tier">
          <HorizontalBar
            items={[
              {
                label: "Tier 1 — Rule-Based",
                value: Math.round(summary.tier1_accuracy),
                color: TIER_COLORS[0],
              },
              {
                label: "Tier 2 — ML Classifier",
                value: Math.round(summary.tier2_accuracy),
                color: TIER_COLORS[1],
              },
              {
                label: "Expert Review",
                value: Math.round(summary.expert_accuracy),
                color: TIER_COLORS[2],
              },
            ]}
          />

          {/* Domain shift warning */}
          <div
            className="mt-4 px-4 py-3 rounded-table leading-relaxed"
            style={{
              backgroundColor: "#FFF8E7",
              borderLeft: `3px solid ${AMBER}`,
              fontSize: "0.8rem",
            }}
          >
            <span className="font-semibold">Tier 2 domain shift:</span> ML
            accuracy drops on preterm neonates with low baseline SpO2. Pattern
            mining rules partially compensate but additional training data from
            the &lt;32-week cohort would improve classifier performance.
          </div>

          <p className="text-muted mt-3" style={{ fontSize: "0.75rem" }}>
            Expert accuracy reflects inter-rater agreement with the synthetic ground truth.
            In production, expert labels would replace ground truth for the expert-queue
            cohort.
          </p>
        </SectionCard>

        {/* Right: Ground Truth Distribution donut */}
        <SectionCard title="Ground Truth Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={LABEL_COLORS[entry.name] ?? NEUTRAL_GRAY}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
              {/* Center annotation */}
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-heading"
                style={{ fontSize: 18, fontWeight: 600, fill: TEAL_DARK }}
              >
                {summary.total_traces}
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: 10, fill: MUTED }}
              >
                traces
              </text>
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ─── Triage distribution segmented bar ───────────────────── */}
      <SegmentedBar
        title="Triage Distribution"
        subtitle="How traces are routed through the pipeline"
        segments={[
          { label: "Tier 1", count: summary.tier1_auto, color: TIER_COLORS[0] },
          { label: "Tier 2", count: summary.tier2_auto, color: TIER_COLORS[1] },
          { label: "Expert", count: summary.expert_queue, color: TIER_COLORS[2] },
        ]}
        total={summary.total_traces}
      />

      {/* ─── Per-label clinical metrics table ────────────────────── */}
      {coverage && (
        <SectionCard
          title="Per-Label Clinical Metrics"
          subtitle="Sensitivity, PPV, and F1 by ground truth label"
        >
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="bg-sage-bg">
                  {["Label", "Sensitivity", "PPV", "F1", "N"].map((h) => (
                    <th
                      key={h}
                      className={`text-teal-dark border-b border-border ${h === "Label" ? "text-left" : "text-right"}`}
                      style={{ fontWeight: 600, fontSize: "0.82rem", padding: "10px 16px" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricsRows.map((row) => {
                  const sensColor =
                    !row.lowSupport && row.isHighStakes && row.sensitivityRaw < 95
                      ? URGENT_RED
                      : undefined;
                  const labelColor =
                    LABEL_COLORS[row.label.toLowerCase()] ?? NEUTRAL_GRAY;

                  const glyph = LABEL_GLYPHS[row.label.toLowerCase()];
                  const isEmergency = row.label.toLowerCase() === "emergency";

                  return (
                    <tr key={row.label} className="border-b border-border">
                      <td style={{ padding: "10px 16px" }}>
                        <span
                          className="inline-flex items-center gap-1 text-white font-semibold rounded-badge"
                          style={{
                            backgroundColor: labelColor,
                            fontSize: "0.78rem",
                            padding: "3px 12px",
                            ...(isEmergency
                              ? {
                                  boxShadow: `0 0 0 1.5px ${labelColor}, 0 0 0 3px rgba(139,32,32,0.25)`,
                                }
                              : {}),
                          }}
                        >
                          {glyph && (
                            <span
                              aria-hidden="true"
                              style={{ fontSize: "0.7rem", lineHeight: 1 }}
                            >
                              {glyph}
                            </span>
                          )}
                          {row.label}
                        </span>
                      </td>
                      <td className="text-right" style={{ padding: "10px 16px", fontSize: "0.85rem" }}>
                        <span
                          style={{
                            fontWeight: row.isHighStakes && !row.lowSupport ? 700 : 400,
                            color: sensColor,
                          }}
                        >
                          {row.sensitivity}
                          {row.lowSupport && <sup style={{ color: MUTED }}>†</sup>}
                        </span>
                      </td>
                      <td className="text-right text-body" style={{ padding: "10px 16px", fontSize: "0.85rem" }}>
                        {row.ppv}
                      </td>
                      <td className="text-right text-body" style={{ padding: "10px 16px", fontSize: "0.85rem" }}>
                        {row.f1}
                      </td>
                      <td className="text-right text-muted" style={{ padding: "10px 16px", fontSize: "0.85rem" }}>
                        {row.n}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {anyLowSupport && (
            <p className="text-muted mt-3" style={{ fontSize: "0.75rem" }}>
              † Sensitivity/PPV/F1 not reported when support &lt; {LOW_SUPPORT_THRESHOLD} —
              not statistically meaningful.
            </p>
          )}
        </SectionCard>
      )}
    </div>
  );
}
