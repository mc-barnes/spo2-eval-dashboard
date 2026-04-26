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
        {(data.overall_pass_rate * 100).toFixed(1)}%. These LLM-as-judge checks
        validate clinical accuracy, handoff quality, and artifact handling.
      </PageIntro>

      {/* ─── Per-evaluator metric cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {evaluatorEntries.map(([key, evalSummary], i) => (
          <MetricCard
            key={key}
            label={PRETTY_NAMES[key] ?? key}
            value={`${(evalSummary.pass_rate * 100).toFixed(1)}%`}
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
            value: Math.round(evalSummary.pass_rate * 100),
            color: EVAL_COLORS[i % EVAL_COLORS.length],
          }))}
        />
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
