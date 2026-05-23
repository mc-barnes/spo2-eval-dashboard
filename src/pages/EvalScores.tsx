/**
 * EvalScores — LLM-as-judge evaluation results.
 * Shows overall pass rate, per-evaluator summaries, and expandable detail table.
 */
import { useEffect, useState } from "react";
import { loadEvalScores } from "../data/loader.ts";
import type { EvalScores as EvalScoresType } from "../data/types.ts";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import HorizontalBar from "../components/ui/HorizontalBar.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import { EVAL_COLORS } from "../config/theme.ts";

/** Map evaluator keys to display names. */
const PRETTY_NAMES: Record<string, string> = {
  clinical_accuracy: "Clinical Accuracy",
  handoff_quality: "Handoff Quality",
  artifact_handling: "Artifact Handling",
};

/**
 * Historical live Claude-API eval runs.
 * Source: spo2-eval-pipeline STATUS.md ("Live Eval Results" section, commit 04c7c40).
 * Each run = 10 traces / 30 evals against the Claude API. The aggregate cards
 * above use mock judges over the full 400-trace cohort — these are the real-money runs.
 */
const LIVE_RUNS = [
  {
    run: "V1",
    date: "2026-04-13",
    note: "Pre-v2 fixes",
    clinical: "80%",
    handoff: "90%",
    artifact: "100%",
    cost: "$0.18",
  },
  {
    run: "V2",
    date: "2026-04-14",
    note: "Post clinical fixes, pre prompt fix",
    clinical: "70%",
    handoff: "30%",
    artifact: "100%",
    cost: "$0.19",
    regression: true,
  },
  {
    run: "V2.1",
    date: "2026-04-14",
    note: "After prompt + parser fixes",
    clinical: "60–70%",
    handoff: "80%",
    artifact: "100%",
    cost: "$0.20",
  },
  {
    run: "Final pre-launch",
    date: "2026-04-29",
    note: "Shipped state",
    clinical: "90%",
    handoff: "100%",
    artifact: "100%",
    cost: "$0.19",
  },
] as const;

export default function EvalScores() {
  const [data, setData] = useState<EvalScoresType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadEvalScores().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="text-muted text-sm">Loading eval scores...</div>;
  }

  const evaluatorEntries = Object.entries(data.summary);

  // Detail table data
  const detailColumns = ["Trace ID", "Evaluator", "Answer", "Source"];
  const detailRows: Array<Record<string, string | number>> = data.details
    .slice(0, 50)
    .map((d) => ({
      "Trace ID": d.trace_id,
      Evaluator: PRETTY_NAMES[d.evaluator] ?? d.evaluator,
      Answer: d.answer,
      Source: d.source,
    }));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Eval Scores</h1>

      <PageIntro>
        {data.overall_total} evaluations run across {evaluatorEntries.length}{" "}
        evaluators. Overall pass rate:{" "}
        {data.overall_pass_rate.toFixed(1)}%. Aggregate metrics below are
        mock-judge runs over the synthetic 400-trace cohort. Live Claude-API
        runs (10-trace samples, ~$0.19 each) are summarized in the{" "}
        <em>Live Eval History</em> section.
      </PageIntro>

      {/* ─── Per-evaluator metric cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {evaluatorEntries.map(([key, evalSummary], i) => (
          <MetricCard
            key={key}
            label={PRETTY_NAMES[key] ?? key}
            value={`${evalSummary.pass_rate.toFixed(1)}%`}
            accentColor={EVAL_COLORS[i % EVAL_COLORS.length]}
            delta={`${evalSummary.pass_count}/${evalSummary.total} passed`}
            deltaColor={EVAL_COLORS[i % EVAL_COLORS.length]}
          />
        ))}
      </div>

      {/* ─── Pass rates bar chart ────────────────────────────────── */}
      <SectionCard
        title="Pass Rates by Evaluator"
        subtitle="LLM-as-judge pass rates"
      >
        <HorizontalBar
          items={evaluatorEntries.map(([key, evalSummary], i) => ({
            label: PRETTY_NAMES[key] ?? key,
            value: Math.round(evalSummary.pass_rate),
            color: EVAL_COLORS[i % EVAL_COLORS.length],
          }))}
        />
      </SectionCard>

      {/* ─── Live eval history ───────────────────────────────────── */}
      <SectionCard
        title="Live Eval History"
        subtitle="Claude API judge runs — 10 traces × 3 evaluators per run"
      >
        <DataTable
          columns={[
            "Run",
            "Date",
            "Notes",
            "Clinical Accuracy",
            "Handoff Quality",
            "Artifact Handling",
            "Cost",
          ]}
          rows={LIVE_RUNS.map((r) => ({
            Run: r.run,
            Date: r.date,
            Notes: r.note,
            "Clinical Accuracy": r.clinical,
            "Handoff Quality":
              "regression" in r && r.regression ? `${r.handoff} *` : r.handoff,
            "Artifact Handling": r.artifact,
            Cost: r.cost,
          }))}
        />
        <p
          className="text-muted mt-3"
          style={{ fontSize: "0.78rem", lineHeight: 1.5 }}
        >
          * V2 handoff quality regressed 90% → 30% because the live{" "}
          <code>_HANDOFF_PROMPT</code> and urgency parser were not updated when
          the EMERGENCY tier, SatSeconds, and GA-adjusted thresholds were
          added. Mock templates (which feed the aggregate cards above) were
          unaffected — only the live Claude path was broken. Fixed in V2.1; the
          final pre-launch run on 2026-04-29 recovered to 100%.
        </p>
      </SectionCard>

      {/* ─── Expandable details ──────────────────────────────────── */}
      <SectionCard title="Evaluation Details">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="mb-4 px-4 py-2 rounded-badge font-semibold bg-sage-bg text-teal-dark hover:bg-sage transition-colors"
          style={{ fontSize: "0.8rem" }}
        >
          {showDetails
            ? "Hide Details"
            : `Show Details (${Math.min(50, data.details.length)} rows)`}
        </button>

        {showDetails && (
          <DataTable columns={detailColumns} rows={detailRows} />
        )}
      </SectionCard>
    </div>
  );
}
