/**
 * ClinicalAI — long-form landing for PM and clinical-informatics audiences.
 * Six sections: hero, LLM-judge depth, trend tier, failure modes,
 * generalization preview, lifecycle schematic.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../components/ui/MetricCard.tsx";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE,
  SAGE_BG,
  AMBER,
  URGENT_RED,
  EMERGENCY,
  BORDER,
  MUTED,
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

function FailureModeRow({
  caughtBy,
  title,
  children,
}: {
  caughtBy: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border py-6 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2">
      <div className="md:col-span-3">
        <div className="text-xs uppercase tracking-wider text-teal-primary font-semibold">
          Caught by
        </div>
        <div className="text-sm text-body mt-0.5">{caughtBy}</div>
      </div>
      <div className="md:col-span-9">
        <h3 className="font-heading text-lg font-semibold text-teal-dark mb-2 leading-snug">
          {title}
        </h3>
        <div className="text-sm text-body leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * LifecycleSchematic — editorial inline SVG. Three condition trajectories
 * over a 24-week timeline, with the platform's rolling 16-night window
 * highlighted at week 0-2 to make the "what we see vs. what plays out"
 * point visually. Not data-driven — coordinates are hand-tuned for
 * legibility and the trajectories are illustrative, not measurements.
 */
function LifecycleSchematic() {
  const ticks = [0, 4, 8, 12, 16, 20, 24];
  const xAt = (week: number) => 60 + (week / 24) * 630;
  return (
    <svg
      viewBox="0 0 720 280"
      className="h-auto w-[640px] sm:w-full"
      role="img"
      aria-label="Schematic of three condition trajectories (AOP, CHD interstage, BPD) across a 24-week post-NICU timeline. A highlighted band at weeks 0-2 marks the platform's rolling 16-night observation window."
    >
      <title>
        Three condition trajectories across a 24-week post-NICU timeline
      </title>
      {/* Rolling-window band */}
      <rect
        x={xAt(0)}
        y={40}
        width={xAt(2) - xAt(0)}
        height={190}
        fill={SAGE_BG}
        stroke={SAGE}
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.75}
      />
      <text
        x={(xAt(0) + xAt(2)) / 2}
        y={32}
        textAnchor="middle"
        fontSize={10}
        fill={TEAL_DARK}
        fontWeight={500}
      >
        16-night window
      </text>
      <text
        x={(xAt(0) + xAt(2)) / 2}
        y={260}
        textAnchor="middle"
        fontSize={9}
        fill={MUTED}
      >
        (platform view)
      </text>

      {/* Time axis */}
      <line x1={xAt(0)} y1={230} x2={xAt(24)} y2={230} stroke={BORDER} strokeWidth={1} />
      {ticks.map((w) => (
        <g key={w}>
          <line x1={xAt(w)} y1={230} x2={xAt(w)} y2={234} stroke={MUTED} strokeWidth={1} />
          {w > 0 && (
            <text x={xAt(w)} y={246} textAnchor="middle" fontSize={10} fill={MUTED}>
              Wk {w}
            </text>
          )}
        </g>
      ))}
      <text x={xAt(0)} y={246} textAnchor="middle" fontSize={10} fill={MUTED}>
        NICU discharge
      </text>

      {/* AOP — TEAL_PRIMARY, resolves by ~week 8 */}
      <path
        d={`M ${xAt(0)} 170 Q ${xAt(2)} 175 ${xAt(4)} 145 Q ${xAt(6)} 110 ${xAt(8)} 80`}
        stroke={TEAL_PRIMARY}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={xAt(0)} cy={170} r={3.5} fill={TEAL_PRIMARY} />
      <circle cx={xAt(8)} cy={80} r={3.5} fill={TEAL_PRIMARY} />
      <text x={xAt(8) + 8} y={78} fontSize={11} fill={TEAL_DARK} fontWeight={500}>
        AOP
      </text>
      <text x={xAt(8) + 8} y={91} fontSize={10} fill={MUTED}>
        resolves ~43 wks PMA
      </text>

      {/* CHD interstage — AMBER, Stage 2 palliation ~week 16 */}
      <path
        d={`M ${xAt(0)} 175 Q ${xAt(4)} 180 ${xAt(8)} 155 Q ${xAt(12)} 130 ${xAt(16)} 110`}
        stroke={AMBER}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={xAt(0)} cy={175} r={3.5} fill={AMBER} />
      <circle cx={xAt(16)} cy={110} r={3.5} fill={AMBER} />
      <text x={xAt(16) + 8} y={108} fontSize={11} fill={TEAL_DARK} fontWeight={500}>
        CHD interstage
      </text>
      <text x={xAt(16) + 8} y={121} fontSize={10} fill={MUTED}>
        Stage 2 palliation
      </text>

      {/* BPD — SAGE, weans ~week 24+ */}
      <path
        d={`M ${xAt(0)} 180 Q ${xAt(6)} 185 ${xAt(12)} 165 Q ${xAt(18)} 145 ${xAt(24)} 125`}
        stroke={SAGE}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={xAt(0)} cy={180} r={3.5} fill={SAGE} />
      <circle cx={xAt(24)} cy={125} r={3.5} fill={SAGE} />
      <text x={xAt(24)} y={113} textAnchor="end" fontSize={11} fill={TEAL_DARK} fontWeight={500}>
        BPD wean
      </text>
      <text x={xAt(24)} y={101} textAnchor="end" fontSize={10} fill={MUTED}>
        ~14 mo corrected
      </text>
    </svg>
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
            Take a diagnostic dataset of overnight neonatal SpO<sub>2</sub>{" "}
            recordings, build a personalized per-baby baseline, and stand up
            an AI eval that classifies each night and hands off only the ones
            a clinician needs to see &mdash; warm, not cold.
          </p>
          <p className="font-body text-body leading-relaxed">
            Three-tier triage does the work &mdash; rules for clear cases, an
            ML classifier for the ambiguous middle, an expert queue for the
            rest &mdash; and three LLM judges grade every layer against a
            held-out cohort. The headline number isn&rsquo;t accuracy. It&rsquo;s{" "}
            <strong className="text-teal-dark">
              zero urgent false negatives across 400 traces
            </strong>
            , under a safety check that prevents artifact detection from ever
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
            sublabel="400 traces · safety check: SpO₂ < 90% sustained ≥10s overrides artifact label"
            accent={URGENT_RED}
          />
          <HeroStat
            label="Tier 1 accuracy"
            value="94.2%"
            sublabel="60.2% auto-resolved · post-fix on 400-trace cohort (pre-fix: 46%, see §04)"
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
            sublabel="SpO₂ < 80% sustained ≥10s (population threshold)"
            accent={EMERGENCY}
          />
        </div>
      </section>

      {/* ── 01.5 Scope: not a consumer monitor ──────────────────── */}
      <section>
        <SectionEyebrow index="01.5" label="Scope" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          Not a consumer monitor. Prescribed-only, by design.
        </h2>
        <p className="font-body text-body leading-relaxed mb-4 max-w-3xl" style={{ fontSize: "1rem" }}>
          The American Academy of Pediatrics does <em>not</em> recommend home
          pulse-ox for healthy infants, and consumer baby monitors have
          documented accuracy and false-alarm problems (Bonafide et al., JAMA
          2017). This platform sits in a different category: prescribed
          monitoring for three populations where home pulse-ox already has
          documented clinical utility &mdash; apnea of prematurity (AOP)
          post-discharge, bronchopulmonary dysplasia (BPD) on home oxygen, and
          single-ventricle (HLHS) interstage.
        </p>
        <p className="font-body text-body leading-relaxed mb-6 max-w-3xl" style={{ fontSize: "1rem" }}>
          Alarm fatigue is the dominant failure mode for home pulse-ox
          programs &mdash; parents who get woken by false escalations stop
          trusting (and stop wearing) the monitor. Three design choices push
          against it: <strong className="text-teal-dark">SatSeconds</strong>{" "}
          (depth &times; duration, not blunt thresholds),{" "}
          <strong className="text-teal-dark">per-baby baseline</strong>{" "}
          (a 27-weeker steady at 92% isn&rsquo;t flagged as a 27-weeker; only
          deviation is), and the{" "}
          <strong className="text-teal-dark">artifact override</strong> (motion
          spikes get suppressed unless they cross the safety check). Coverage
          funnel surfaces the false-positive rate &mdash; alarm fatigue is a
          clinical-safety metric here, not a UX metric.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <CtaLink to="/scope">Clinical scope &rarr;</CtaLink>
          <CtaLink to="/pipeline/coverage">Alarm-fatigue check &rarr;</CtaLink>
        </div>
      </section>

      {/* ── 02 LLM-judge depth ──────────────────────────────────── */}
      <section>
        <SectionEyebrow index="02" label="Evaluation discipline" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          Three LLM judges, one held-out cohort.
        </h2>
        <p className="font-body text-body leading-relaxed mb-8 max-w-3xl" style={{ fontSize: "1rem" }}>
          Most mock evaluations are theater &mdash; same data in, same answer out. Ours
          are built to fail differently: each judge runs against a fixed cohort of 400
          traces and renders Pass/Fail with reasoning.
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
          A fourth tier computes an exponentially-weighted moving average (EWMA) over
          per-night SatSeconds across the 16-night sequence per baby, flags trajectories that deteriorate against a per-baby
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
            label="Babies trending worse"
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
          <strong className="text-teal-dark">Clinical motivation:</strong> Multiple
          pediatric pulmonology cohort studies have documented abnormal nocturnal
          oximetry in a substantial fraction of BPD infants clinically judged ready to
          wean from supplemental oxygen — the single-night assessment routinely
          underestimates overnight hypoxemic burden. The trend tier exists because
          single-night assessments, clinical or algorithmic, miss the trajectory that
          drives outcomes. See <Link to="/scope" className="text-teal-primary underline underline-offset-2">Clinical Scope §05</Link> for the literature anchors.
        </Callout>
      </section>

      {/* ── 04 Failure modes ────────────────────────────────────── */}
      <section>
        <SectionEyebrow index="04" label="What evals caught" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          Five things that looked fine until a different evaluator stress-tested them.
        </h2>
        <p className="font-body text-body leading-relaxed mb-8 max-w-3xl" style={{ fontSize: "1rem" }}>
          The pipeline shipped one set of numbers; each of these surfaced a different
          number. The pattern is the punchline: different failure classes need different
          evaluators &mdash; safety tests, coverage metrics, validation against held-out
          cases, and live LLM judging all caught something the others didn&rsquo;t.
        </p>
        <div className="border-b border-border">
          <FailureModeRow
            caughtBy="Coverage + accuracy metric"
            title="The preterm baseline problem"
          >
            <p>
              First-pass rule engine labeled 91.7% of traces (target ~65%) with 46%
              accuracy. Fixed thresholds (&lt;90% urgent, 90&ndash;94% borderline) fired
              on preterm babies whose physiological baseline already sits in the 91&ndash;
              95% band. A 27-weeker steady at 92% all night is normal for that baby; the
              rules called it borderline.
            </p>
            <p>
              Fix: median-gate the borderline rule (only fire when the trace median sits
              in the borderline band) so preterm-normal traces defer to Tier 2 (which has
              GA context). The lesson generalizes &mdash; a threshold that
              is &ldquo;clinically standard&rdquo; for adults can be statistically wrong
              for the subpopulation you are triaging.
            </p>
          </FailureModeRow>
          <FailureModeRow
            caughtBy="Per-label coverage metric"
            title="Artifact detection's tail problem"
          >
            <p>
              First pass caught 21% of artifact traces (15/71). Motion spikes tripped the
              urgent rule before the artifact check could fire, and the recovery tail
              after a motion spike kept the signal below 90% long enough to look like a
              real desat.
            </p>
            <p>
              Fix: widened the detection buffer to &minus;15/+25 samples and added a
              second detector (high-G accel + drop below trace median). Caught 89% after.
              A single-method detector misses the recovery period; you need redundant
              detectors for noisy biosignals.
            </p>
          </FailureModeRow>
          <FailureModeRow
            caughtBy="Held-out validation accuracy"
            title="The Tier 2 domain-shift cliff"
          >
            <p>
              Classifier trained on Tier 1 auto-labeled &ldquo;easy&rdquo; cases hit
              89.2% validation accuracy on held-out clear-cut traces. On the actually
              ambiguous cases it was built to handle, accuracy collapsed to 28.7% &mdash;
              below random chance for the three-class problem.
            </p>
            <p>
              Train-test distribution mismatch is the silent killer of ML in production.
              We&rsquo;re not claiming Tier 2 works on the hard cases &mdash; it doesn&rsquo;t.
              The claim is that the system around Tier 2 makes its failure safe:
              low-confidence outputs route to the expert queue, the dashboard surfaces the
              domain-shift warning instead of hiding it, and no Tier 2 prediction can mask
              an urgent reading because the safety check sits above all three tiers. The
              architecture absorbs the model&rsquo;s known failure mode.
            </p>
          </FailureModeRow>
          <FailureModeRow
            caughtBy="Safety test (when the test caught itself)"
            title="A safety override doing its job, mid-test"
          >
            <p>
              Wrote a safety test asserting &ldquo;pure artifact traces stay labeled
              artifact.&rdquo; It failed &mdash; because the test injected 25-second
              artifact drops, which is long enough that the safety check (&gt;10s
              sustained low SpO<sub>2</sub>) correctly fired and overrode the artifact
              label to urgent.
            </p>
            <p>
              Fix: shortened the test&rsquo;s artifact spikes to 1&ndash;5 seconds, which
              is what real motion artifacts actually look like. When you test a safety
              override, the inputs have to be inputs the override <em>shouldn&rsquo;t</em>{" "}
              trip on. Otherwise you are not testing the rule you think you are testing.
            </p>
          </FailureModeRow>
          <FailureModeRow
            caughtBy="Live LLM-as-judge evaluation"
            title="Mock said 90%, live said 30%"
          >
            <p>
              After v2 clinical fixes shipped (emergency tier, SatSeconds burden,
              GA-adjusted thresholds), mock evals stayed green. Live LLM evals dropped
              handoff quality from 90% to 30%. The mock templates had the new fields;
              the live <code className="bg-sage-bg px-1.5 py-0.5 rounded text-xs font-mono text-teal-dark">_HANDOFF_PROMPT</code>{" "}
              did not.
            </p>
            <p>
              Two parser bugs compounded it: the EMERGENCY tier was silently downgraded
              to ROUTINE because the parser checked URGENT first, and Claude&rsquo;s
              markdown wrapping (<code className="bg-sage-bg px-1.5 py-0.5 rounded text-xs font-mono text-teal-dark">**EMERGENCY**</code>)
              broke the string-match. Only live judging caught it. Mock evals are theater
              when the path under test isn&rsquo;t the path that runs in production.
            </p>
          </FailureModeRow>
        </div>
      </section>

      {/* ── 05 Generalization preview ──────────────────────────── */}
      <section>
        <SectionEyebrow index="05" label="Generalization" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          Adult RPM is a generalization, not the primary frame.
        </h2>
        <p className="font-body text-body leading-relaxed max-w-3xl" style={{ fontSize: "1rem" }}>
          The same triage discipline &mdash; rules where they fit, ML where they don&rsquo;t,
          expert review for the rest, and LLM judges across the whole stack &mdash; applies
          upstream from pediatric pulse oximetry to adult remote patient monitoring. What
          changes is the framing, the payers, and the baseline assumptions. The business
          case for that is its own page.{" "}
          <CtaLink to="/rpm">Business framing &rarr;</CtaLink>
        </p>
      </section>

      {/* ── 06 Lifecycle schematic ─────────────────────────────── */}
      <section>
        <SectionEyebrow index="06" label="Operating model" />
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-teal-dark leading-tight mb-5">
          What the platform sees vs. what plays out.
        </h2>
        <p className="font-body text-body leading-relaxed mb-8 max-w-3xl" style={{ fontSize: "1rem" }}>
          The platform operates on the rolling 16-night window shown below; the full
          clinical lifecycle plays out over the months illustrated. The same window
          processes every baby every week, but the lifecycle horizon &mdash; AOP
          resolution, CHD interstage to Stage 2 palliation, BPD wean &mdash; varies by
          condition and stretches well past anything a single observation window can see.
        </p>
        <div className="bg-warm-white border border-border rounded-card p-5 sm:p-8 overflow-x-auto">
          <LifecycleSchematic />
        </div>
        <p className="mt-4 text-xs text-muted leading-relaxed max-w-3xl">
          Schematic, not measured data. Trajectory endpoints anchored to Eichenwald 2016
          AAP (AOP resolution ~43 wks PMA), Rudd 2020 AHA (CHD interstage to Stage 2),
          and Everitt 2020 (BPD home oxygen wean median ~14 mo corrected age).
        </p>
      </section>
    </main>
  );
}
