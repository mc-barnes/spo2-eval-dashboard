/**
 * CoverageFunnel — coverage breakdown by tier, with crosstab table
 * showing how ground truth labels distribute across tiers.
 */
import { useEffect, useState } from "react";
import { usePipelineData } from "../hooks/usePipelineData.tsx";
import { loadCoverageBreakdown } from "../data/loader.ts";
import type { CoverageBreakdown } from "../data/types.ts";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import HorizontalBar from "../components/ui/HorizontalBar.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import { TIER_COLORS, LABEL_COLORS } from "../config/theme.ts";

export default function CoverageFunnel() {
  const { summary, loading, error } = usePipelineData();
  const [coverage, setCoverage] = useState<CoverageBreakdown | null>(null);

  useEffect(() => {
    loadCoverageBreakdown().then(setCoverage).catch(console.error);
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
        {summary.total_traces} traces triaged across 3 pipeline tiers. Tier 1
        rule-based engine handles {summary.tier1_pct.toFixed(1)}% automatically,
        Tier 2 ML covers {summary.tier2_pct.toFixed(1)}%, and{" "}
        {summary.expert_pct.toFixed(1)}% route to expert review.
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
    </div>
  );
}
