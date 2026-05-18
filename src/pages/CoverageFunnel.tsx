/**
 * CoverageFunnel — coverage breakdown by tier, with crosstab table
 * showing how ground truth labels distribute across tiers.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePipelineData } from "../hooks/usePipelineData.tsx";
import { loadCoverageBreakdown, loadTrendFeatures } from "../data/loader.ts";
import type { CoverageBreakdown, TrendFeatures } from "../data/types.ts";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import HorizontalBar from "../components/ui/HorizontalBar.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import { TIER_COLORS, LABEL_COLORS, URGENT_RED, AMBER, MUTED, TEAL_DARK } from "../config/theme.ts";

export default function CoverageFunnel() {
  const { summary, loading, error } = usePipelineData();
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

  // Convert crosstab rows to DataTable format (columns are plain strings)
  const crosstabColumns = ["Ground Truth", "Tier 1", "Tier 2", "Expert"];
  const crosstabRows: Array<Record<string, string | number>> = coverage
    ? coverage.crosstab.map((row) => ({
        "Ground Truth": row.ground_truth,
        "Tier 1": row["Tier 1"],
        "Tier 2": row["Tier 2"],
        Expert: row.Expert,
      }))
    : [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">
        Coverage &amp; Accuracy
      </h1>

      <PageIntro>
        {summary.total_traces} traces triaged across 3 single-night tiers. Tier 1
        rule-based engine handles {summary.tier1_pct.toFixed(1)}% automatically,
        Tier 2 ML covers {summary.tier2_pct.toFixed(1)}%, and{" "}
        {summary.expert_pct.toFixed(1)}% route to expert review. A separate
        multi-night trend tier flags babies on a per-baby denominator.
      </PageIntro>

      {/* ─── Metric cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Tier 1 — Rules"
          value={String(summary.tier1_auto)}
          accentColor={TIER_COLORS[0]}
          delta={`${summary.tier1_pct.toFixed(1)}% of total`}
          deltaColor={TIER_COLORS[0]}
        />
        <MetricCard
          label="Tier 2 — ML"
          value={String(summary.tier2_auto)}
          accentColor={TIER_COLORS[1]}
          delta={`${summary.tier2_pct.toFixed(1)}% of total`}
          deltaColor={TIER_COLORS[1]}
        />
        <MetricCard
          label="Expert Queue"
          value={String(summary.expert_queue)}
          accentColor={TIER_COLORS[2]}
          delta={`${summary.expert_pct.toFixed(1)}% of total`}
          deltaColor={TIER_COLORS[2]}
        />
      </div>

      {/* ─── Trend tier (separate denominator: per-baby, not per-trace) ── */}
      {trend && (() => {
        const babies = Object.values(trend.babies);
        const flagged = babies.filter((b) => b.flagged).length;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/pipeline/trends" className="block transition-shadow hover:shadow-md rounded-card">
              <MetricCard
                label="Tier 4 — Trend (multi-night)"
                value={String(flagged)}
                accentColor={URGENT_RED}
                delta={`${flagged} of ${babies.length} babies · per-baby, not per-trace`}
                deltaColor={URGENT_RED}
              />
            </Link>
          </div>
        );
      })()}

      {/* ─── Coverage by Tier bar chart ──────────────────────────── */}
      {coverage && (
        <SectionCard
          title="Coverage by Tier"
          subtitle="Accuracy of each triage tier"
        >
          <HorizontalBar
            items={Object.entries(coverage.tier_accuracy).map(
              ([tier, acc], i) => ({
                label: tier,
                value: Math.round(acc),
                color: TIER_COLORS[i] ?? TIER_COLORS[0],
              })
            )}
          />
        </SectionCard>
      )}

      {/* ─── Crosstab: Ground Truth x Tier ───────────────────────── */}
      {coverage && (
        <SectionCard
          title="Breakdown by Pattern Type"
          subtitle="Ground truth label distribution across pipeline tiers"
        >
          <DataTable
            columns={crosstabColumns}
            rows={crosstabRows}
            labelColorMap={LABEL_COLORS}
          />
        </SectionCard>
      )}

      {/* ─── Alarm-fatigue panel: false-positive rate at high-stakes tiers ── */}
      {coverage && summary && (
        <AlarmFatiguePanel
          coverage={coverage}
          totalTraces={summary.total_traces}
        />
      )}
    </div>
  );
}

/**
 * AlarmFatiguePanel — false-positive counts at the urgent and emergency tiers,
 * split by escalation pathway because the downstream cost is different:
 *   urgent FP   → clinician outreach call (labor cost, no ED utilization)
 *   emergency FP → ED visit / cardiac center transfer (utilization cost)
 *
 * Costs are illustrative anchors, marked as such. The load-bearing metric is
 * the per-night false-positive rate, not the dollar figure.
 */
const COST_PER_OUTREACH = 50; // illustrative — clinician labor per outreach call
const COST_PER_ED_VISIT = 500; // illustrative — HCUP pediatric ED national avg
const LOW_SUPPORT_THRESHOLD = 5;

function falsePositives(m: {
  sensitivity: number;
  ppv: number;
  support: number;
}): number {
  // FP = TP * (1 - PPV) / PPV, where TP = (sensitivity/100) * support.
  if (m.ppv <= 0) return 0;
  const tp = (m.sensitivity / 100) * m.support;
  return Math.max(0, Math.round((tp * (100 - m.ppv)) / m.ppv));
}

function AlarmFatiguePanel({
  coverage,
  totalTraces,
}: {
  coverage: CoverageBreakdown;
  totalTraces: number;
}) {
  const urgentM = coverage.per_label_metrics.urgent;
  const emergencyM = coverage.per_label_metrics.emergency;

  // Urgent's confidence is gated on support size; emergency is always reported.
  const urgentFP =
    urgentM.support < LOW_SUPPORT_THRESHOLD ? null : falsePositives(urgentM);
  const emergencyFP = falsePositives(emergencyM);

  const urgentLabel =
    urgentFP === null ? "—" : String(urgentFP);
  const knownFPCount = (urgentFP ?? 0) + emergencyFP;
  const ratePrefix = urgentFP === null ? "≥ " : "";
  const nightlyRate = (knownFPCount / totalTraces) * 100;

  const urgentCost = (urgentFP ?? 0) * COST_PER_OUTREACH;
  const emergencyCost = emergencyFP * COST_PER_ED_VISIT;
  const illustrativeCost = urgentCost + emergencyCost;

  return (
    <SectionCard
      title="Alarm-fatigue check"
      subtitle="False-positive rate at the high-stakes tiers — what most monitor-abandonment is driven by"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MetricCard
          label="High-stakes false positives"
          value={`${urgentLabel} / ${emergencyFP}`}
          accentColor={AMBER}
          delta={
            urgentFP === null
              ? `Urgent N=${urgentM.support} too small · emergency N=${emergencyM.support} confirmed`
              : `Urgent: ${urgentFP} · emergency: ${emergencyFP}`
          }
          deltaColor={MUTED}
        />
        <MetricCard
          label="Per-night false-positive rate"
          value={`${ratePrefix}${nightlyRate.toFixed(1)}%`}
          accentColor={AMBER}
          delta={
            urgentFP === null
              ? `Emergency-confirmed lower bound; urgent FP rate unknown (N too small)`
              : `${knownFPCount} of ${totalTraces} nights triggered an avoidable escalation`
          }
          deltaColor={MUTED}
        />
        <MetricCard
          label="Illustrative avoidable cost"
          value={`~$${illustrativeCost.toLocaleString()}`}
          accentColor={TEAL_DARK}
          delta={`Urgent @ ~$${COST_PER_OUTREACH}/outreach · emergency @ ~$${COST_PER_ED_VISIT}/ED visit (illustrative)`}
          deltaColor={MUTED}
        />
      </div>
      <div
        className="px-5 py-4 text-sm text-body leading-relaxed"
        style={{
          backgroundColor: "#FFF8E7",
          borderLeft: `4px solid ${AMBER}`,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <strong className="text-teal-dark">Why this panel is here:</strong>{" "}
        Alarm fatigue is the dominant failure mode for home pulse-ox programs —
        parents who get woken by false escalations stop trusting (and stop
        wearing) the monitor (Bonafide et al., Pediatrics 2017; Cvach, AJN
        2012). False-positive minimization is a clinical-safety metric.
        Downstream costs are split because the escalation pathways differ:
        urgent FPs cost clinician time, emergency FPs cost an ED visit. Dollar
        figures are illustrative; the load-bearing number is the per-night
        rate. See{" "}
        <Link
          to="/scope"
          className="text-teal-primary underline underline-offset-2"
        >
          Clinical Scope §02
        </Link>{" "}
        for the population scope this rate is meaningful against.
      </div>
    </SectionCard>
  );
}
