/**
 * ClinicalAI — long-form landing for PM and clinical-informatics audiences.
 * RX-2a delivers sections 1-3 (hero, LLM-judge depth, trend tier).
 * Sections 4-6 (failure modes, generalization preview, lifecycle schematic)
 * land in RX-2b.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../components/ui/MetricCard.tsx";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  AMBER,
  URGENT_RED,
  EMERGENCY,
} from "../config/theme.ts";

/* ── Inline subcomponents ──────────────────────────────────────── */

function HeroStat({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string;
  sublabel: string;
  accent: string;
}) {
  return (
    <div
      className="pl-4"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="font-heading text-3xl font-semibold text-teal-dark leading-none mb-1.5">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted mb-0.5">
        {label}
      </div>
      <div className="text-sm text-body leading-snug">{sublabel}</div>
    </div>
  );
}

function EvalCard({
  judge,
  pass,
  total,
  describes,
}: {
  judge: string;
  pass: string;
  total: string;
  describes: string;
}) {
  return (
    <div className="bg-warm-white border border-border rounded-card p-5 h-full">
      <div className="text-xs uppercase tracking-wider text-muted mb-2">
        {judge}
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-heading text-3xl font-semibold text-teal-dark">
          {pass}
        </span>
        <span className="text-sm text-muted">{total} pass</span>
      </div>
      <p className="text-sm text-body leading-relaxed">{describes}</p>
    </div>
  );
}

function Callout({
  children,
  accent = TEAL_PRIMARY,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="bg-sage-bg px-5 py-4 text-sm text-body leading-relaxed"
      style={{
        borderLeft: `4px solid ${accent}`,
        borderRadius: "0 12px 12px 0",
      }}
    >
      {children}
    </div>
  );
}

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="text-xs uppercase tracking-wider text-muted mb-2">
      <span className="text-teal-primary font-medium">{index}</span>
      <span className="mx-2 text-border">/</span>
      {label}
    </p>
  );
}

function CtaLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="text-teal-primary hover:text-teal-dark underline underline-offset-4 decoration-1 font-medium"
    >
      {children}
    </Link>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */

export default function ClinicalAI() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-24">
      {/* ── 01 Hero ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-wider text-muted mb-4">
            Story · For PM and clinical-informatics audiences
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-teal-dark leading-[1.1] mb-6">
            Clinical AI, evaluated like clinical software.
          </h1>
          <p className="font-body text-body leading-relaxed mb-4" style={{ fontSize: "1.05rem" }}>
            Three-tier triage for overnight neonatal SpO<sub>2</sub> recordings: a rule
            engine handles clear cases, an ML classifier resolves the ambiguous middle,
            and an expert queue absorbs the rest. Every layer is wrapped in LLM-as-judge
            evaluators that pressure-test clinical accuracy, handoff language, and
            artifact handling against a held-out cohort.
          </p>
          <p className="font-body text-body leading-relaxed">
            The headline number isn&rsquo;t accuracy. It&rsquo;s{" "}
            <strong className="text-teal-dark">
              zero urgent false negatives across 400 traces
            </strong>
            , held under a safety check that prevents artifact detection from ever
            masking a real desaturation.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <CtaLink to="/pipeline/evals">Eval breakdown &rarr;</CtaLink>
            <CtaLink to="/pipeline/traces">Open a trace &rarr;</CtaLink>
            <CtaLink to="/pipeline/coverage">Coverage funnel &rarr;</CtaLink>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-3 space-y-5">
          <HeroStat
            label="Urgent false negatives"
            value="0"
            sublabel="Across 400 traces, hard safety check"
            accent={URGENT_RED}
          />
          <HeroStat
            label="Tier 1 accuracy"
            value="94.2%"
            sublabel="60.2% of traces auto-resolved by rules"
            accent={TEAL_PRIMARY}
          />
          <HeroStat
            label="Overall LLM-eval pass rate"
            value="79.3%"
            sublabel="1,200 judgments across 3 evaluators"
            accent={TEAL_DARK}
          />
          <HeroStat
            label="Emergencies detected"
            value="25"
            sublabel="SpO₂ < 80% sustained, GA-adjusted"
            accent={EMERGENCY}
          />
        </div>
      </section>

      {/* ── 02 LLM-judge depth ──────────────────────────────────── */}
      <section>
        <SectionEyebrow index="02" label="Evaluation discipline" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          Three LLM judges, one held-out cohort.
        </h2>
        <p className="font-body text-body leading-relaxed mb-8 max-w-3xl" style={{ fontSize: "1rem" }}>
          Mock evaluation is theater &mdash; same data in, same answer out. Each judge
          runs against a fixed cohort of 400 traces and renders Pass/Fail with reasoning.
          Pass rates in the 75&ndash;82% band are deliberately uncomfortable: they
          surface gaps that unit tests never catch, like a handoff template that says
          &ldquo;monitor closely&rdquo; without naming an action.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <EvalCard
            judge="Clinical accuracy"
            pass="75.8%"
            total="303 / 400"
            describes="Does the rule engine's per-night label match the clinical ground truth?"
          />
          <EvalCard
            judge="Handoff quality"
            pass="82.2%"
            total="329 / 400"
            describes="Does the nurse handoff carry the right urgency, action steps, and clinical correlation prompts?"
          />
          <EvalCard
            judge="Artifact handling"
            pass="80.0%"
            total="320 / 400"
            describes="When the signal is artifact-laden, does the system flag it without masking real desats?"
          />
        </div>
        <Callout>
          The 17.8% failure rate on clinical accuracy isn&rsquo;t a bug &mdash; it&rsquo;s the
          measured gap between GA-adjusted rule thresholds and the long tail of preterm
          baseline drift. The eval surfaces it; the next iteration narrows it.{" "}
          <CtaLink to="/pipeline/evals">Eval breakdown &rarr;</CtaLink>
        </Callout>
      </section>

      {/* ── 03 Trend tier ───────────────────────────────────────── */}
      <section>
        <SectionEyebrow index="03" label="The fourth tier" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          What single-night triage misses.
        </h2>
        <p className="font-body text-body leading-relaxed mb-4 max-w-3xl" style={{ fontSize: "1rem" }}>
          The three tiers above triage each night in isolation. They&rsquo;ll catch a
          single desaturation event, but they won&rsquo;t see the slope. A baby whose
          SatSeconds drift from <em>noisy-but-routine</em> to{" "}
          <em>still-routine, just worse every night</em> registers as stable on each
          night and unstable across the week.
        </p>
        <p className="font-body text-body leading-relaxed mb-8 max-w-3xl" style={{ fontSize: "1rem" }}>
          A fourth tier computes an EWMA over per-night SatSeconds across the 16-night
          sequence per baby, flags trajectories that deteriorate against a per-baby
          baseline, and emits a parallel signal that the handoff generator consumes as a{" "}
          <code className="bg-sage-bg px-1.5 py-0.5 rounded text-sm font-mono text-teal-dark">
            [TREND]
          </code>{" "}
          block. It doesn&rsquo;t override per-night triage &mdash; it adds the context a
          single-night view can&rsquo;t see.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Babies in cohort"
            value="25"
            accentColor={TEAL_PRIMARY}
            delta="16 nights each, 400 total traces"
          />
          <MetricCard
            label="Trending worse"
            value="9 / 25"
            accentColor={AMBER}
            delta="Across AOP, BPD, CHD interstage"
          />
          <MetricCard
            label="Trend metric"
            value="SatSeconds"
            accentColor={TEAL_DARK}
            delta="EWMA against per-baby baseline"
          />
        </div>
        <Callout accent={AMBER}>
          <strong className="text-teal-dark">Peer-reviewed evidence:</strong> 67% of BPD
          infants clinically ready to wean from oxygen had abnormal nocturnal oximetry on
          objective measurement{" "}
          <span className="text-muted">(J Pediatr 2022)</span>. The trend tier exists
          because single-night assessments &mdash; clinical or algorithmic &mdash; miss
          the trajectory that drives outcomes.
        </Callout>
      </section>
    </main>
  );
}
