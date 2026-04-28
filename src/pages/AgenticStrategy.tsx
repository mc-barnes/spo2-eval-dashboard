/**
 * AgenticStrategy — strategy page targeting VP of Product audience.
 * Explains how agentic AI applies to a neonatal SpO2 monitoring pipeline,
 * covering current architecture, agent opportunity map, cost model, and roadmap.
 */
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import {
  TEAL_PRIMARY,
  SAGE,
  AMBER,
  URGENT_RED,
} from "../config/theme.ts";

/* ── Inline sub-components ──────────────────────────────────────── */

function AgentCard({
  name,
  accent,
  trigger,
  volume,
  value,
}: {
  name: string;
  accent: string;
  trigger: string;
  volume: string;
  value: string;
}) {
  return (
    <div className="bg-warm-white border border-border rounded-card shadow-sm overflow-hidden h-full">
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="p-5">
        <div
          className="font-body font-semibold text-teal-dark mb-3"
          style={{ fontSize: "0.95rem" }}
        >
          {name}
        </div>
        {[
          { label: "Trigger", text: trigger },
          { label: "Volume", text: volume },
          { label: "Value", text: value },
        ].map(({ label, text }) => (
          <div key={label} className="mb-2.5">
            <div
              className="text-muted uppercase tracking-wider mb-0.5"
              style={{ fontSize: "0.72rem" }}
            >
              {label}
            </div>
            <div
              className="text-body leading-relaxed"
              style={{ fontSize: "0.84rem" }}
            >
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapCard({
  title,
  accent,
  items,
}: {
  title: string;
  accent: string;
  items: string[];
}) {
  return (
    <div className="bg-warm-white border border-border rounded-card shadow-sm overflow-hidden h-full">
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="p-5">
        <div
          className="font-body font-semibold text-teal-dark mb-3"
          style={{ fontSize: "0.95rem" }}
        >
          {title}
        </div>
        <ul className="space-y-1.5 pl-4 list-disc">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-body leading-relaxed"
              style={{ fontSize: "0.84rem" }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Flow diagram step data ─────────────────────────────────────── */

const FLOW_STEPS = [
  { label: "SpO2 Traces", tier: false },
  { label: "Tier 1 Rules (58%)", tier: true, color: TEAL_PRIMARY },
  { label: "Tier 2 Classifier (39.3%)", tier: true, color: SAGE },
  { label: "Expert Queue (2.7%)", tier: true, color: AMBER },
  { label: "Handoff", tier: false },
] as const;

/* ── Cost table data ────────────────────────────────────────────── */

const COST_ROWS = [
  { layer: "Triage (Rules + ML)", volume: "225M traces/yr", processing: "Deterministic", costModel: "Compute only", annual: "~$2,400/yr" },
  { layer: "Expert Queue Agent", volume: "~67.5K traces/yr", processing: "LLM (Haiku)", costModel: "~$0.003/trace", annual: "~$200/yr" },
  { layer: "Escalation Agent", volume: "~10K events/yr", processing: "LLM (Haiku)", costModel: "~$0.01/event", annual: "~$100/yr" },
  { layer: "Quality Audit Agent", volume: "~25K samples/yr", processing: "LLM (Sonnet)", costModel: "~$0.02/sample", annual: "~$500/yr" },
  { layer: "Prior Auth Agent", volume: "~50K encounters/yr", processing: "LLM (Sonnet)", costModel: "~$0.05/encounter", annual: "~$2,500/yr" },
];

const COST_HEADERS = ["Layer", "Volume", "Processing", "Cost Model", "Annual Est."];

/* ── Main page component ────────────────────────────────────────── */

export default function AgenticStrategy() {
  return (
    <div className="space-y-6">
      {/* ─── Page Header + Intro ─────────────────────────────────── */}
      <h2 className="font-heading text-2xl font-semibold text-teal-dark mb-1">
        Agentic AI Strategy
      </h2>
      <p className="text-muted text-sm mb-6">
        Strategic roadmap for VP of Product &mdash; where agents add value
      </p>
      <PageIntro>
        Strategic view: how agentic AI transforms this pipeline from a batch
        classification tool into a closed-loop clinical operating system &mdash;
        and where the ROI justifies the investment.
      </PageIntro>

      {/* ─── Current Architecture ────────────────────────────────── */}
      <SectionCard title="What We Built: Deterministic Pipeline">
        {/* Flow diagram */}
        <div className="flex items-center flex-wrap gap-y-2 overflow-x-auto py-2">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center shrink-0">
              <div
                className="bg-warm-white border border-border rounded-table px-4 py-2.5 text-center text-sm font-medium text-teal-dark"
                style={step.tier ? { borderLeft: `2px solid ${step.color}` } : undefined}
              >
                {step.label}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <span className="text-muted text-lg px-2">&rarr;</span>
              )}
            </div>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <MetricCard
            label="Processing Cost"
            value="~$0/trace"
            accentColor={TEAL_PRIMARY}
            delta="NumPy + sklearn"
          />
          <MetricCard
            label="Scalability"
            value="225M traces"
            accentColor={TEAL_PRIMARY}
            delta="Linear compute"
          />
          <MetricCard
            label="Accuracy"
            value="88.3%"
            accentColor={TEAL_PRIMARY}
            delta="96% Tier 1"
          />
        </div>

        {/* Callout */}
        <div
          className="bg-sage-bg mt-4 px-5 py-4 text-sm text-body leading-relaxed"
          style={{
            borderLeft: `4px solid ${TEAL_PRIMARY}`,
            borderRadius: "0 12px 12px 0",
          }}
        >
          This pipeline handles volume. Rules and classifiers process 225M
          traces at near-zero marginal cost. The question isn&rsquo;t whether to
          replace this layer &mdash; it&rsquo;s where to add intelligence on top
          of it.
        </div>
      </SectionCard>

      {/* ─── Agent Opportunity Map ───────────────────────────────── */}
      <div>
        <h3
          className="font-heading text-teal-dark"
          style={{ fontSize: "1.15rem", fontWeight: 500 }}
        >
          Where Agents Add Value: The 2.7%, Not the 97.3%
        </h3>
        <hr className="border-border my-3" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgentCard
            name="Expert Queue Agent"
            accent={AMBER}
            trigger="Trace reaches expert queue (confidence < threshold)"
            volume="~67,500 traces/year (2.7% of 2.5M)"
            value="Pre-annotates with reasoning, groups similar cases, prioritizes by severity. Reduces clinician review time by 40-60%."
          />
          <AgentCard
            name="Escalation Agent"
            accent={URGENT_RED}
            trigger="Event-driven: nurse non-acknowledgment, consecutive borderline nights"
            volume="Dozens of events/day"
            value="Closes the loop between handoff and action. Currently the pipeline ends at handoff generation — nobody verifies the nurse acted."
          />
          <AgentCard
            name="Quality Audit Agent"
            accent={TEAL_PRIMARY}
            trigger="Scheduled: samples 50-100 traces/day for eval"
            volume="~$0.50-1.00/day"
            value="Automates the LLM-as-judge eval loop. Detects drift (e.g., Tier 2 accuracy dropping) and triggers retraining alerts."
          />
          <AgentCard
            name="Prior Auth Agent"
            accent={SAGE}
            trigger="Clinical action required: ED referral, specialist consult"
            volume="Hundreds/day"
            value="Initiates prior authorization with payer before family arrives. Uses HL7 integration layer already built."
          />
        </div>
      </div>

      {/* ─── Cost Model ──────────────────────────────────────────── */}
      <SectionCard title="Cost Architecture: Agents at the Margins">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <thead>
              <tr className="bg-sage-bg">
                {COST_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="text-left text-teal-dark font-semibold uppercase tracking-wider px-4 py-3 border-b-2 border-border"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COST_ROWS.map((row) => (
                <tr key={row.layer}>
                  <td className="text-body text-sm px-4 py-3 border-b border-border font-medium">
                    {row.layer}
                  </td>
                  <td className="text-body text-sm px-4 py-3 border-b border-border">
                    {row.volume}
                  </td>
                  <td className="text-body text-sm px-4 py-3 border-b border-border">
                    {row.processing}
                  </td>
                  <td className="text-body text-sm px-4 py-3 border-b border-border">
                    {row.costModel}
                  </td>
                  <td className="text-body text-sm px-4 py-3 border-b border-border">
                    {row.annual}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-sage-bg font-bold">
                <td className="text-teal-dark text-sm px-4 py-3">Total</td>
                <td className="text-teal-dark text-sm px-4 py-3">&mdash;</td>
                <td className="text-teal-dark text-sm px-4 py-3">&mdash;</td>
                <td className="text-teal-dark text-sm px-4 py-3">&mdash;</td>
                <td className="text-teal-dark text-sm px-4 py-3">~$5,700/yr</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cost callout */}
        <div
          className="bg-sage-bg mt-4 px-5 py-4 text-sm text-body leading-relaxed"
          style={{
            borderLeft: `4px solid ${TEAL_PRIMARY}`,
            borderRadius: "0 12px 12px 0",
          }}
        >
          Total agentic layer cost: ~$5,700/year. Compare to one prevented NICU
          readmission ($50,000&ndash;$100,000) or one FTE saved on prior auth
          processing ($65,000+/year). The ROI case is the cost of{" "}
          <em>NOT</em> closing the loop.
        </div>
      </SectionCard>

      {/* ─── Implementation Roadmap ──────────────────────────────── */}
      <div>
        <h3
          className="font-heading text-teal-dark"
          style={{ fontSize: "1.15rem", fontWeight: 500 }}
        >
          Implementation Roadmap
        </h3>
        <hr className="border-border my-3" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoadmapCard
            title="Phase 1: Quick Wins (0-3 months)"
            accent={TEAL_PRIMARY}
            items={[
              "Quality audit agent on eval sampling",
              "Automated drift detection alerts",
              "Dashboard integration for agent outputs",
            ]}
          />
          <RoadmapCard
            title="Phase 2: Strategic (3-9 months)"
            accent={AMBER}
            items={[
              "Expert queue agent with LLM pre-annotation",
              "Escalation agent for non-acknowledged alerts",
              "Multi-night trend agent (consecutive borderline detection)",
            ]}
          />
          <RoadmapCard
            title="Phase 3: Operating Model (9-18 months)"
            accent={URGENT_RED}
            items={[
              "Prior auth agent with HL7 payer integration",
              "Closed-loop outcome tracking (handoff \u2192 action \u2192 outcome)",
              "Multi-agent orchestration across clinical and admin workflows",
            ]}
          />
        </div>

        {/* Deloitte source callout */}
        <div
          className="bg-sage-bg mt-4 px-5 py-4 text-sm text-body leading-relaxed"
          style={{
            borderLeft: `4px solid ${TEAL_PRIMARY}`,
            borderRadius: "0 12px 12px 0",
          }}
        >
          Source: Deloitte Center for Health Solutions, Feb 2026 &mdash; 85% of
          health care leaders plan to increase agentic AI investment in 2&ndash;3
          years. Early adopters using multi-agent systems expect 20%+ cost
          savings vs. 13% for point-solution watchers.
        </div>
      </div>
    </div>
  );
}
