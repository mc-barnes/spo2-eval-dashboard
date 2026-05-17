/**
 * Trends — multi-night EWMA trend tier surface.
 * Per-baby trajectory view, condition chips, and honest "why no eval yet" note.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { loadTrendFeatures } from "../data/loader.ts";
import type { TrendBaby, TrendFeatures } from "../data/types.ts";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import MetricCard from "../components/ui/MetricCard.tsx";
import ConditionChip from "../components/ui/ConditionChip.tsx";
import { getPlotly } from "../lib/plotly.ts";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE,
  SAGE_BG,
  URGENT_RED,
  BORDER,
  MUTED,
  CONDITION_LABELS,
  PLOTLY_LAYOUT,
} from "../config/theme.ts";

type ConditionFilter = "all" | "AOP" | "BPD" | "CHD_interstage";
type SortKey = "trend_score_desc" | "trend_score_asc" | "baby_id";

function FlagBadge({ direction }: { direction: string }) {
  const color = direction === "deteriorating" ? URGENT_RED : MUTED;
  return (
    <span
      className="inline-flex items-center rounded-full font-medium"
      style={{
        backgroundColor: `${color}1A`,
        color,
        border: `1px solid ${color}`,
        padding: "2px 8px",
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {direction}
    </span>
  );
}

function TrendChart({ baby }: { baby: TrendBaby }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;
    if (baby.ewma_series.length === 0) return;

    const nights = baby.ewma_series.map((_, i) => i + 1);

    getPlotly().then((Plotly) => {
      if (cancelled || !containerRef.current) return;
      Plotly.newPlot(
        containerRef.current,
        [
          {
            x: nights,
            y: baby.sat_seconds_series,
            type: "bar",
            name: "Nightly SatSeconds",
            marker: { color: `${SAGE}88` },
            hovertemplate: "Night %{x}<br>SatSeconds %{y:.1f}<extra></extra>",
          },
          {
            x: nights,
            y: baby.ewma_series,
            type: "scatter",
            mode: "lines+markers",
            name: "EWMA",
            line: { color: TEAL_PRIMARY, width: 2 },
            marker: { size: 6, color: TEAL_PRIMARY },
            hovertemplate: "Night %{x}<br>EWMA %{y:.1f}<extra></extra>",
          },
          {
            x: [1, nights[nights.length - 1]],
            y: [baby.baseline_sat_seconds, baby.baseline_sat_seconds],
            type: "scatter",
            mode: "lines",
            name: "Quiet-night baseline",
            line: { color: TEAL_DARK, width: 1, dash: "dash" },
            hoverinfo: "skip",
          },
        ],
        {
          ...PLOTLY_LAYOUT,
          title: {
            text: `Multi-night burden — Baby ${baby.baby_id}`,
            font: { ...PLOTLY_LAYOUT.font, size: 14 },
          },
          xaxis: {
            title: { text: "Night", font: PLOTLY_LAYOUT.font },
            gridcolor: BORDER,
            zeroline: false,
            dtick: 1,
          },
          yaxis: {
            title: { text: "SatSeconds", font: PLOTLY_LAYOUT.font },
            gridcolor: BORDER,
            zeroline: false,
          },
          legend: {
            orientation: "h",
            y: -0.2,
            x: 0.5,
            xanchor: "center",
            font: { ...PLOTLY_LAYOUT.font, size: 11 },
          },
          barmode: "overlay",
          autosize: true,
          height: 360,
        },
        { responsive: true, displayModeBar: false }
      );
    });

    return () => {
      cancelled = true;
      if (el) {
        getPlotly().then((Plotly) => Plotly.purge(el));
      }
    };
  }, [baby]);

  return <div ref={containerRef} className="w-full" style={{ width: "100%" }} />;
}

export default function Trends() {
  const [data, setData] = useState<TrendFeatures | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("all");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("trend_score_desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadTrendFeatures()
      .then((d) => {
        setData(d);
        const first = Object.values(d.babies)
          .sort((a, b) => b.trend_score - a.trend_score)[0];
        if (first) setSelectedId(first.baby_id);
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Failed to load trends")
      );
  }, []);

  const babies = useMemo(() => {
    if (!data) return [] as TrendBaby[];
    return Object.values(data.babies);
  }, [data]);

  const conditionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    babies.forEach((b) => {
      counts[b.condition] = (counts[b.condition] ?? 0) + 1;
    });
    return counts;
  }, [babies]);

  const flaggedCount = useMemo(
    () => babies.filter((b) => b.flagged).length,
    [babies]
  );

  // Honest window label across the cohort — single value if uniform,
  // range if any baby has a different night count.
  const windowLabel = useMemo(() => {
    if (babies.length === 0) return "";
    const counts = new Set(babies.map((b) => b.n_nights));
    if (counts.size === 1) return `${babies[0].n_nights}-night window`;
    return `${Math.min(...counts)}–${Math.max(...counts)}-night window`;
  }, [babies]);

  const filteredBabies = useMemo(() => {
    let out = babies;
    if (conditionFilter !== "all") {
      out = out.filter((b) => b.condition === conditionFilter);
    }
    if (flaggedOnly) {
      out = out.filter((b) => b.flagged);
    }
    out = [...out].sort((a, b) => {
      if (sortKey === "trend_score_desc") return b.trend_score - a.trend_score;
      if (sortKey === "trend_score_asc") return a.trend_score - b.trend_score;
      return a.baby_id.localeCompare(b.baby_id);
    });
    return out;
  }, [babies, conditionFilter, flaggedOnly, sortKey]);

  // Find selection inside the *filtered* list so the cohort list and
  // detail pane stay in sync when filters narrow past the current selection.
  const selectedBaby =
    filteredBabies.find((b) => b.baby_id === selectedId) ??
    filteredBabies[0] ??
    null;

  if (loadError) {
    return <div className="text-urgent-red text-sm">Error: {loadError}</div>;
  }
  if (!data) {
    return <div className="text-muted text-sm">Loading trend features...</div>;
  }

  const conditionBreakdown = Object.entries(conditionCounts)
    .map(([k, v]) => `${CONDITION_LABELS[k] ?? k} ${v}`)
    .join(" · ");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Trends</h1>

      <PageIntro>
        Single-night triage misses babies whose hypoxemic burden creeps up across
        weeks. The trend tier computes an EWMA of nightly SatSeconds per baby and
        flags trajectories rising above each baby's quiet-night baseline — the
        kind of signal that turns into an unplanned readmission if no one is
        watching the multi-night arc.
      </PageIntro>

      {/* ─── Metric row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Babies Monitored"
          value={String(babies.length)}
          accentColor={TEAL_PRIMARY}
          delta={`${data.schema_version === 1 ? "EWMA v1" : `schema v${data.schema_version}`} · ${windowLabel}`}
        />
        <MetricCard
          label="Flagged by Trend Tier"
          value={String(flaggedCount)}
          accentColor={URGENT_RED}
          delta={`${babies.length ? ((flaggedCount / babies.length) * 100).toFixed(0) : 0}% of monitored cohort`}
          deltaColor={URGENT_RED}
        />
        <MetricCard
          label="Conditions"
          value={String(Object.keys(conditionCounts).length)}
          accentColor={SAGE}
          delta={conditionBreakdown}
        />
      </div>

      {/* ─── Filter controls ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            className="block text-muted font-medium mb-1"
            style={{ fontSize: "0.8rem" }}
          >
            Condition
          </label>
          <select
            value={conditionFilter}
            onChange={(e) =>
              setConditionFilter(e.target.value as ConditionFilter)
            }
            className="px-3 py-2 rounded-table border border-border bg-warm-white text-body"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="all">All conditions</option>
            <option value="AOP">AOP</option>
            <option value="BPD">BPD</option>
            <option value="CHD_interstage">CHD interstage</option>
          </select>
        </div>

        <div>
          <label
            className="block text-muted font-medium mb-1"
            style={{ fontSize: "0.8rem" }}
          >
            Sort
          </label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2 rounded-table border border-border bg-warm-white text-body"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="trend_score_desc">Trend score · high → low</option>
            <option value="trend_score_asc">Trend score · low → high</option>
            <option value="baby_id">Baby ID</option>
          </select>
        </div>

        <label
          className="flex items-center gap-2 cursor-pointer select-none"
          style={{ fontSize: "0.85rem" }}
        >
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => setFlaggedOnly(e.target.checked)}
            className="accent-teal-primary"
          />
          <span className="text-body">Flagged only</span>
        </label>

        <div className="ml-auto text-muted" style={{ fontSize: "0.8rem" }}>
          {filteredBabies.length} of {babies.length} babies
        </div>
      </div>

      {/* ─── Master / detail split ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Baby list */}
        <div className="lg:col-span-1">
          <SectionCard title="Cohort">
            <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {filteredBabies.length === 0 && (
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  No babies match this filter.
                </p>
              )}
              {filteredBabies.map((b) => {
                const isSelected = b.baby_id === selectedBaby?.baby_id;
                return (
                  <button
                    key={b.baby_id}
                    onClick={() => setSelectedId(b.baby_id)}
                    className="w-full text-left rounded-lg transition-colors"
                    style={{
                      padding: "10px 12px",
                      backgroundColor: isSelected ? SAGE_BG : "transparent",
                      border: `1px solid ${isSelected ? TEAL_PRIMARY : "transparent"}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-medium text-teal-dark"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {b.baby_id}
                      </span>
                      <span
                        className="text-teal-dark font-semibold"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {b.trend_score.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <ConditionChip condition={b.condition} />
                      {b.flagged && <FlagBadge direction={b.trend_direction} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Selected baby detail */}
        <div className="lg:col-span-2">
          {selectedBaby ? (
            <SectionCard
              title={`Baby ${selectedBaby.baby_id}`}
              subtitle={`${CONDITION_LABELS[selectedBaby.condition] ?? selectedBaby.condition} · ${selectedBaby.n_nights}-night window`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <ConditionChip condition={selectedBaby.condition} />
                {selectedBaby.flagged && (
                  <FlagBadge direction={selectedBaby.trend_direction} />
                )}
                <span
                  className="text-muted"
                  style={{ fontSize: "0.8rem" }}
                >
                  Trend score {selectedBaby.trend_score.toFixed(1)} · baseline{" "}
                  {selectedBaby.baseline_sat_seconds.toFixed(1)}
                </span>
              </div>
              <TrendChart baby={selectedBaby} />
              <p
                className="text-body mt-3"
                style={{ fontSize: "0.85rem", lineHeight: 1.5 }}
              >
                {selectedBaby.flag_reason}
              </p>
              {selectedBaby.flagged &&
                selectedBaby.trend_direction === "deteriorating" && (
                  <p
                    className="text-muted mt-2"
                    style={{ fontSize: "0.75rem", fontStyle: "italic" }}
                  >
                    Ground truth for demo: deteriorating trajectory planted in
                    this baby's later nights so the EWMA crossing is
                    reproducible.
                  </p>
                )}
            </SectionCard>
          ) : (
            <SectionCard>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                Select a baby on the left to view their multi-night trajectory.
              </p>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ─── Honest disclosure ───────────────────────────────────── */}
      <SectionCard title="Why no LLM-judge eval on trends yet">
        <div
          className="text-body space-y-2"
          style={{ fontSize: "0.85rem", lineHeight: 1.55 }}
        >
          <p>
            The single-night tiers (rules, ML, expert handoff) all run through a
            three-axis LLM-judge eval. The trend tier intentionally does not have
            a fourth axis yet, and we want to be transparent about why rather
            than ship a number that looks rigorous but isn't.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium text-teal-dark">
                Ground truth lives on a different time scale.
              </span>{" "}
              Single-night labels are tractable to annotate; multi-week
              trajectories require longitudinal outcome data (e.g. unplanned
              readmissions, escalation events) that the mock cohort doesn't
              carry.
            </li>
            <li>
              <span className="font-medium text-teal-dark">
                Judge prompts for multi-night reasoning aren't designed.
              </span>{" "}
              The existing rubrics evaluate per-night urgency, action specificity,
              and clinical safety. A trend-tier rubric needs to score
              trajectory-shape reasoning, baseline calibration, and false-alarm
              fatigue — distinct from the per-night axes.
            </li>
            <li>
              <span className="font-medium text-teal-dark">
                Correctness on single-night tiers comes first.
              </span>{" "}
              The trend tier is currently a deterministic EWMA-vs-baseline rule
              with planted ground-truth trajectories for the demo. Adding a
              judge before the upstream tiers are stable would attribute noise to
              the wrong layer.
            </li>
          </ul>
          <p className="text-muted" style={{ fontSize: "0.8rem" }}>
            Honest framing: this surface demonstrates the trend-tier output and
            its planted ground truth, not a held-out evaluation.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
