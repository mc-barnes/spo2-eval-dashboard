/**
 * AgenticStrategy — strategy page targeting VP of Product audience.
 * Assumes no prior knowledge of the pipeline. Frames agentic AI
 * opportunity in business outcomes, not implementation details.
 */
import { Link } from "react-router-dom";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE,
  AMBER,
  URGENT_RED,
} from "../config/theme.ts";

/* ── Inline sub-components ──────────────────────────────────────── */

function AgentCard({
  name,
  accent,
  when,
  scale,
  outcome,
}: {
  name: string;
  accent: string;
  when: string;
  scale: string;
  outcome: string;
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
          { label: "When it fires", text: when },
          { label: "Scale", text: scale },
          { label: "Business outcome", text: outcome },
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

function Callout({ children, accent = TEAL_PRIMARY }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      className="bg-sage-bg mt-4 px-5 py-4 text-sm text-body leading-relaxed"
      style={{
        borderLeft: `4px solid ${accent}`,
        borderRadius: "0 12px 12px 0",
      }}
    >
      {children}
    </div>
  );
}

/* ── Flow diagram step data ─────────────────────────────────────── */

const FLOW_STEPS = [
  { label: "Overnight SpO2 data", color: TEAL_DARK },
  { label: "Auto-classify clear cases", pct: "58%", color: TEAL_PRIMARY },
  { label: "ML handles ambiguous cases", pct: "39%", color: SAGE },
  { label: "Clinician reviews the rest", pct: "3%", color: AMBER },
  { label: "Nurse handoff generated", color: TEAL_DARK },
] as const;

/* ── Cost table data ────────────────────────────────────────────── */

const COST_ROWS = [
  { layer: "Core triage engine", volume: "225M traces/yr", processing: "Rules + ML", costModel: "Compute only", annual: "~$2,400" },
  { layer: "Clinician review assistant", volume: "~67.5K traces/yr", processing: "AI (lightweight)", costModel: "~$0.003/trace", annual: "~$200" },
  { layer: "Alert follow-up agent", volume: "~10K events/yr", processing: "AI (lightweight)", costModel: "~$0.01/event", annual: "~$100" },
  { layer: "Quality monitoring agent", volume: "~25K samples/yr", processing: "AI (standard)", costModel: "~$0.02/sample", annual: "~$500" },
  { layer: "Prior auth agent", volume: "~50K encounters/yr", processing: "AI (standard)", costModel: "~$0.05/encounter", annual: "~$2,500" },
];

const COST_HEADERS = ["Layer", "Volume", "Processing", "Unit Cost", "Annual Est."];

/* ── Main page component ────────────────────────────────────────── */

export default function AgenticStrategy() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ─── Page Header ───────────────────────────────────────────── */}
      <h2 className="font-heading text-2xl font-semibold text-teal-dark mb-1">
        Agentic AI Strategy
      </h2>
      <p className="text-muted text-sm mb-6">
        Turn cold telehealth calls into warm handoffs &mdash; and close the
        loop from triage to outcome
      </p>

      {/* ─── The Problem ───────────────────────────────────────────── */}
      <PageIntro>
        <strong>The context:</strong> Consumer pulse oximeters can monitor a
        baby&rsquo;s blood oxygen levels overnight &mdash; but the data is
        useless without clinical triage. This pipeline processes overnight
        recordings for 2.5 million babies, classifies each night as normal,
        borderline, or urgent, and generates a handoff that triggers a
        telehealth nurse call to the family. Today the pipeline runs as a
        batch process and the nurse starts the call cold. The opportunity is
        turning it into a closed-loop system where AI agents enrich the
        telehealth handoff, verify follow-through, and improve over time
        &mdash; shifting families from ER visits to informed telehealth
        triage.
      </PageIntro>

      {/* ─── The Bottom Line (cost teaser) ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="AI inference cost"
          value="~$5,700/yr"
          accentColor={TEAL_PRIMARY}
          delta="Excludes infra, integration, and compliance"
        />
        <MetricCard
          label="One prevented readmission"
          value="$50-100K"
          accentColor={URGENT_RED}
          delta="Average NICU readmission cost"
        />
      </div>

      {/* ─── What Was Built ─────────────────────────────────────────── */}
      <SectionCard title="What Was Built: The Triage Engine">
        <p className="text-body text-sm leading-relaxed mb-4">
          97% of overnight recordings are triaged automatically &mdash; no
          human involvement needed. Only the hardest 3% of cases route to a
          clinician for review. The engine scales to the full 2.5M-baby
          dataset at near-zero marginal cost.
        </p>

        {/* Flow diagram */}
        <div className="flex items-center flex-wrap gap-y-2 overflow-x-auto py-2">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center shrink-0">
              <div
                className="bg-warm-white border border-border rounded-table px-4 py-2.5 text-center text-sm font-medium text-teal-dark"
                style={{ borderLeft: `3px solid ${step.color}` }}
              >
                <div>{step.label}</div>
                {"pct" in step && (
                  <div
                    className="font-semibold mt-0.5"
                    style={{ fontSize: "0.75rem", color: step.color }}
                  >
                    {step.pct}
                  </div>
                )}
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
            label="Processing cost"
            value="~$0/trace"
            accentColor={TEAL_PRIMARY}
            delta="Rules + ML, no AI inference"
          />
          <MetricCard
            label="Scale"
            value="225M traces/yr"
            accentColor={TEAL_PRIMARY}
            delta="2.5M babies &times; 90 nights"
          />
          <MetricCard
            label="Triage accuracy"
            value="88.3%"
            accentColor={TEAL_PRIMARY}
            delta="96% on clear-cut cases"
          />
        </div>

        <Callout>
          This engine handles volume at near-zero cost. The question
          isn&rsquo;t whether to replace it &mdash; it&rsquo;s where to add
          intelligence on top of it.
        </Callout>
      </SectionCard>

      {/* ─── The Gap ───────────────────────────────────────────────── */}
      <SectionCard title="The Gap: What Happens After Triage?">
        <p className="text-body text-sm leading-relaxed mb-2">
          Today the pipeline generates a handoff that triggers a telehealth
          nurse call. But the nurse starts cold &mdash; reading a summary
          while a tired parent tries to describe what happened overnight.
          And after the call, nobody tracks whether the family followed
          through. The system is <strong>open-loop</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {[
            { q: "Does the telehealth nurse have full clinical context before the call?", a: "No \u2014 starts cold from a summary" },
            { q: "Could this have been resolved via telehealth instead of an ER visit?", a: "Often yes, but nurse lacked context to triage confidently" },
            { q: "Did the family follow through on the referral?", a: "Unknown" },
            { q: "Are we catching quality problems before they become patient safety events?", a: "Spot-checked manually, if at all" },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="bg-warm-white border border-border rounded-table px-4 py-3"
            >
              <div className="text-body text-sm font-medium">{q}</div>
              <div className="text-urgent-red text-sm mt-1" style={{ color: URGENT_RED }}>{a}</div>
            </div>
          ))}
        </div>
        <Callout accent={URGENT_RED}>
          Every unanswered question is a gap where a baby could fall through
          the cracks, a family ends up in the ER when telehealth could have
          resolved it, or a readmission could have been prevented. Agentic AI
          closes these gaps.
        </Callout>
      </SectionCard>

      {/* ─── Agent Opportunity Map ─────────────────────────────────── */}
      <div>
        <h3
          className="font-heading text-teal-dark"
          style={{ fontSize: "1.15rem", fontWeight: 500 }}
        >
          Four Agents That Close the Loop
        </h3>
        <p className="text-muted text-sm mt-1 mb-3">
          Each agent targets a specific gap. They run on the margins &mdash;
          the 3% that needs human judgment, the events that need follow-up
          &mdash; not on the 97% the engine already handles.
        </p>
        <hr className="border-border mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgentCard
            name="Clinician Review Assistant"
            accent={AMBER}
            when="A case is too ambiguous for the engine and routes to clinician review"
            scale="~67,500 cases/year (3% of total)"
            outcome="Pre-sorts and pre-annotates the review queue so clinicians spend 40-60% less time per case. Reduces backlog without adding headcount."
          />
          <AgentCard
            name="Alert Follow-Up Agent"
            accent={URGENT_RED}
            when="A nurse hasn't acknowledged an urgent or emergency alert, or a baby has 3+ concerning nights in a row"
            scale="Dozens of events per day"
            outcome="Ensures every critical alert gets a response. Escalates automatically: nurse \u2192 charge nurse \u2192 attending. When a telehealth call connects, the agent pre-loads the nurse with triage context, SpO2 trends, and clinical history \u2014 so a tired parent doesn\u2019t have to interpret a graph at 2am. Turns a cold call into a warm handoff that can avoid unnecessary ER trips."
          />
          <AgentCard
            name="Quality Monitoring Agent"
            accent={TEAL_PRIMARY}
            when="Runs daily on a sample of cases to audit triage quality"
            scale="50-100 cases/day (~$0.50-1.00/day)"
            outcome="Catches accuracy drift before it becomes a patient safety issue. Triggers retraining alerts when performance degrades. Replaces manual spot-checks."
          />
          <AgentCard
            name="Prior Authorization Agent"
            accent={SAGE}
            when="Triage triggers a clinical action (ED referral, specialist consult)"
            scale="Hundreds of encounters per day"
            outcome="Starts the prior auth process with the payer before the family arrives. Routes through the HL7/Rhapsody interoperability layer already built into the pipeline."
          />
        </div>
      </div>

      {/* ─── Cost Model ────────────────────────────────────────────── */}
      <SectionCard title="AI Inference Costs: Agents at the Margins">
        <p className="text-body text-sm leading-relaxed mb-4">
          The core triage engine runs on standard compute at near-zero
          marginal cost. AI inference is only used for the small fraction
          of cases that need judgment &mdash; keeping inference costs
          under $6,000/year.
        </p>
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

        <p className="text-muted mt-5" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
          For the full reimbursement framing &mdash; CPT parity ceiling,
          capped-rental model, and caregiver continuation tier &mdash; see{" "}
          <Link
            to="/rpm"
            className="text-teal-primary hover:text-teal-dark underline underline-offset-4 decoration-1 font-medium"
          >
            Pediatric home monitoring &rarr;
          </Link>
          .
        </p>
      </SectionCard>

      {/* ─── Implementation Roadmap ────────────────────────────────── */}
      <div>
        <h3
          className="font-heading text-teal-dark"
          style={{ fontSize: "1.15rem", fontWeight: 500 }}
        >
          Implementation Roadmap
        </h3>
        <p className="text-muted text-sm mt-1 mb-3">
          Phased rollout &mdash; each phase delivers standalone value while
          building toward the full closed-loop operating model.
        </p>
        <hr className="border-border mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoadmapCard
            title="Phase 1: Quick Wins (0-3 mo)"
            accent={TEAL_PRIMARY}
            items={[
              "Automated quality monitoring on daily case samples",
              "Drift detection alerts to the clinical ops team",
              "Agent output integrated into the existing dashboard",
            ]}
          />
          <RoadmapCard
            title="Phase 2: Close the Loop (3-9 mo)"
            accent={AMBER}
            items={[
              "AI-assisted clinician review queue (pre-sorted, pre-annotated)",
              "Alert follow-up agent with automatic escalation",
              "Multi-night trend detection (flag babies trending worse)",
            ]}
          />
          <RoadmapCard
            title="Phase 3: Operating Model (9-18 mo)"
            accent={URGENT_RED}
            items={[
              "Prior auth agent with payer integration via HL7/Rhapsody",
              "End-to-end outcome tracking (alert \u2192 action \u2192 result)",
              "Multi-agent orchestration across clinical and admin workflows",
            ]}
          />
        </div>

        {/* Deloitte source footnote */}
        <p className="text-muted mt-6" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
          Source: Deloitte Center for Health Solutions, Feb 2026. 85% of
          health care leaders plan to increase agentic AI investment in
          2&ndash;3 years. Early adopters using multi-agent systems expect
          20%+ cost savings vs. 13% for point-solution adopters.
        </p>
      </div>
    </main>
  );
}
