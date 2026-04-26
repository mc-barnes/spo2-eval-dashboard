/**
 * TraceExplorer — interactive trace viewer with waveform chart and handoff details.
 * Combines the trace selector, Plotly waveform viewer, and pipeline handoff info.
 */
import { useEffect, useState, lazy, Suspense } from "react";
import { usePipelineData } from "../hooks/usePipelineData.tsx";
import { loadWaveform, loadHandoffSamples } from "../data/loader.ts";
import type { WaveformData, HandoffSamples } from "../data/types.ts";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import UrgencyBadge from "../components/ui/UrgencyBadge.tsx";
import DetailRow from "../components/ui/DetailRow.tsx";
import { MUTED } from "../config/theme.ts";

const TraceViewer = lazy(() => import("../components/TraceViewer.tsx"));

const LABEL_OPTIONS = ["all", "normal", "borderline", "urgent", "emergency", "artifact"];

export default function TraceExplorer() {
  const { traces, loading, error } = usePipelineData();

  // Filter state
  const [labelFilter, setLabelFilter] = useState("all");
  const [selectedNightId, setSelectedNightId] = useState<string | null>(null);

  // Lazy-loaded data
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [handoffs, setHandoffs] = useState<HandoffSamples | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);
  const [waveformError, setWaveformError] = useState<string | null>(null);

  // Load handoffs once
  useEffect(() => {
    loadHandoffSamples().then(setHandoffs).catch(console.error);
  }, []);

  // Load waveform when a trace is selected
  useEffect(() => {
    if (!selectedNightId) {
      setWaveform(null);
      return;
    }
    setWaveformLoading(true);
    setWaveformError(null);
    loadWaveform(selectedNightId)
      .then((data) => {
        setWaveform(data);
        setWaveformLoading(false);
      })
      .catch((err) => {
        setWaveformError(err instanceof Error ? err.message : "Failed to load waveform");
        setWaveformLoading(false);
      });
  }, [selectedNightId]);

  if (loading) {
    return <div className="text-muted text-sm">Loading pipeline data...</div>;
  }
  if (error) {
    return <div className="text-urgent-red text-sm">Error: {error}</div>;
  }

  // Filtered traces
  const filteredTraces =
    labelFilter === "all"
      ? traces
      : traces.filter(
          (t) => t.ground_truth_label.toLowerCase() === labelFilter
        );

  // Selected trace metadata
  const selectedTrace = traces.find((t) => t.night_id === selectedNightId);
  const handoff = selectedNightId ? handoffs?.[selectedNightId] : null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Trace Explorer</h1>

      <PageIntro>
        Browse individual overnight SpO2 traces. Select a label filter, choose a
        trace, and view the waveform alongside the pipeline handoff summary.
      </PageIntro>

      {/* ─── Filter controls ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Label filter */}
        <div>
          <label className="block text-muted font-medium mb-1" style={{ fontSize: "0.8rem" }}>
            Label Filter
          </label>
          <select
            value={labelFilter}
            onChange={(e) => {
              setLabelFilter(e.target.value);
              setSelectedNightId(null);
            }}
            className="px-3 py-2 rounded-table border border-border bg-warm-white text-body"
            style={{ fontSize: "0.85rem" }}
          >
            {LABEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "All Labels" : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Trace selector */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-muted font-medium mb-1" style={{ fontSize: "0.8rem" }}>
            Select Trace ({filteredTraces.length} available)
          </label>
          <select
            value={selectedNightId ?? ""}
            onChange={(e) => setSelectedNightId(e.target.value || null)}
            className="w-full px-3 py-2 rounded-table border border-border bg-warm-white text-body"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="">-- Choose a trace --</option>
            {filteredTraces.map((t) => (
              <option key={t.night_id} value={t.night_id}>
                {t.baby.baby_id} / GA {t.baby.gestational_age_weeks}w / {t.ground_truth_label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Selected trace view ─────────────────────────────────── */}
      {selectedNightId && selectedTrace && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left (2 cols): Waveform */}
          <div className="lg:col-span-2">
            <SectionCard title="SpO2 Waveform">
              {waveformLoading && (
                <div className="text-muted py-8 text-center" style={{ fontSize: "0.85rem" }}>
                  Loading waveform...
                </div>
              )}
              {waveformError && (
                <div className="text-urgent-red py-8 text-center" style={{ fontSize: "0.85rem" }}>
                  {waveformError}
                </div>
              )}
              {waveform && !waveformLoading && (
                <Suspense
                  fallback={
                    <div className="text-muted py-8 text-center" style={{ fontSize: "0.85rem" }}>
                      Loading chart...
                    </div>
                  }
                >
                  <TraceViewer waveform={waveform} />
                </Suspense>
              )}
            </SectionCard>
          </div>

          {/* Right (1 col): Handoff + Patient Details */}
          <div className="space-y-4">
            {/* Pipeline Handoff */}
            <SectionCard title="Pipeline Handoff">
              {handoff ? (
                <div className="space-y-3">
                  <UrgencyBadge level={handoff.urgency_level} />
                  <p className="text-body leading-relaxed mt-2" style={{ fontSize: "0.85rem" }}>
                    {handoff.summary_text}
                  </p>
                  <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                    Source: {handoff.source}
                  </p>
                </div>
              ) : (
                <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                  No handoff sample available for this trace.
                </p>
              )}
            </SectionCard>

            {/* Patient Details */}
            <SectionCard title="Patient Details">
              <DetailRow label="Baby ID" value={selectedTrace.baby.baby_id} />
              <DetailRow
                label="Gestational Age"
                value={`${selectedTrace.baby.gestational_age_weeks} weeks`}
              />
              <DetailRow
                label="Birth Weight"
                value={`${selectedTrace.baby.birth_weight_grams}g`}
              />
              <DetailRow
                label="Days Since Birth"
                value={String(selectedTrace.baby.days_since_birth)}
              />
              <DetailRow
                label="Conditions"
                value={
                  selectedTrace.baby.known_conditions.length > 0
                    ? selectedTrace.baby.known_conditions.join(", ")
                    : "None"
                }
              />
              <div className="my-2 border-t border-border" />
              <DetailRow
                label="Ground Truth"
                value={selectedTrace.ground_truth_label}
              />
              <DetailRow
                label="Pipeline Label"
                value={selectedTrace.final_label}
              />
              <DetailRow
                label="Match"
                value={
                  selectedTrace.ground_truth_label === selectedTrace.final_label
                    ? "Correct"
                    : "Mismatch"
                }
              />
              <div className="my-2 border-t border-border" />
              <DetailRow
                label="Mean SpO2"
                value={`${selectedTrace.stats.mean_spo2.toFixed(1)}%`}
              />
              <DetailRow
                label="Min SpO2"
                value={`${selectedTrace.stats.min_spo2.toFixed(1)}%`}
              />
              <DetailRow
                label="Desat Events"
                value={String(selectedTrace.stats.n_events)}
              />
            </SectionCard>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!selectedNightId && (
        <div
          className="text-center py-16 rounded-card border border-border bg-warm-white"
          style={{ color: MUTED, fontSize: "0.85rem" }}
        >
          Select a trace above to view the waveform and details.
        </div>
      )}
    </div>
  );
}
