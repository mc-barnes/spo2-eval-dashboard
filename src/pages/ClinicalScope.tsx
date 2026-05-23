/**
 * ClinicalScope — single-page statement of what this platform claims and doesn't.
 * Deflects clinical critique by giving every page a place to point: target
 * population, synthetic-cohort caveat, no-FDA-claim, threshold framework, and
 * the literature anchors behind each threshold.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE,
  AMBER,
  URGENT_RED,
  EMERGENCY,
  BORDER,
} from "../config/theme.ts";

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="text-xs uppercase tracking-wider text-muted mb-2">
      <span className="text-teal-primary font-medium">{index}</span>
      <span className="mx-2" style={{ color: BORDER }}>/</span>
      {label}
    </p>
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

function ScopeRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-1 py-4 border-t border-border">
      <div className="md:col-span-3">
        <div className="text-xs uppercase tracking-wider text-teal-primary font-semibold">
          {label}
        </div>
      </div>
      <div className="md:col-span-9 text-sm text-body leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function CitationCard({
  anchor,
  citation,
  describes,
}: {
  anchor: string;
  citation: string;
  describes: string;
}) {
  return (
    <div className="bg-warm-white border border-border rounded-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted mb-1">
        Used for
      </div>
      <div className="text-sm font-semibold text-teal-dark mb-2">{anchor}</div>
      <div className="text-sm text-body leading-snug mb-2">{citation}</div>
      <div className="text-xs text-muted leading-snug">{describes}</div>
    </div>
  );
}

export default function ClinicalScope() {
  return (
    <article className="bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section>
          <SectionEyebrow index="00" label="Clinical scope" />
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-teal-dark leading-tight mb-5">
            What this platform claims — and what it doesn't.
          </h1>
          <p
            className="font-body text-body leading-relaxed max-w-3xl"
            style={{ fontSize: "1.05rem" }}
          >
            This is a portfolio/eval site for a clinical AI product, not a
            cleared medical device. The cohort is synthetic, the audience is PM
            and clinical-informatics, and the claims are bounded. This page
            states the bounds explicitly so every other page in the site can
            sit on top of them.
          </p>
        </section>

        {/* ── §01 Cohort ─────────────────────────────────────────── */}
        <section>
          <SectionEyebrow index="01" label="The cohort" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-4">
            Synthetic, by design.
          </h2>
          <div className="space-y-1">
            <ScopeRow label="What's modeled">
              <p>
                400 overnight SpO<sub>2</sub> traces across 25 simulated infants
                (16 nights each). Three monitoring cohorts: apnea of prematurity
                (AOP), bronchopulmonary dysplasia (BPD) on home oxygen, and
                hypoplastic left heart syndrome (HLHS) / single-ventricle
                interstage. Gestational ages 25–40 weeks, post-discharge timing.
              </p>
            </ScopeRow>
            <ScopeRow label="What's modeled, more specifically">
              <p>
                Per-baby baseline SpO<sub>2</sub>, desaturation event depth and
                duration, artifact rate, recovery kinetics, and a 16-night
                trajectory per baby — all generated from condition-specific
                priors with planted ground-truth labels.
              </p>
            </ScopeRow>
            <ScopeRow label="What's not modeled">
              <p>
                Heart rate / bradycardia coupling, pleth signal quality, ambient
                light interference, skin pigmentation effects on pulse-ox
                accuracy, sleep state, feeding-related artifacts, and the
                clinician–family communication loop that actually drives
                outcomes. This dashboard evaluates label correctness, not
                end-to-end clinical workflow.
              </p>
            </ScopeRow>
          </div>
        </section>

        {/* ── §02 Target population ──────────────────────────────── */}
        <section>
          <SectionEyebrow index="02" label="Target population" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-4">
            Prescribed monitoring for medically indicated infants.
          </h2>
          <p
            className="font-body text-body leading-relaxed mb-6 max-w-3xl"
            style={{ fontSize: "1rem" }}
          >
            The platform is scoped to populations where home pulse-ox already
            has documented clinical utility — not the general infant
            population. The American Academy of Pediatrics has been explicit
            that consumer pulse-ox monitoring of healthy infants{" "}
            <em>does not</em> reduce SIDS and may generate clinically
            meaningless alarms. This product is not in that category.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-warm-white border border-border rounded-card p-5">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: TEAL_PRIMARY }}
              >
                AOP post-discharge
              </div>
              <p className="text-sm text-body leading-relaxed">
                Preterm infants discharged on a home apnea monitoring plan,
                typically with prescribed pulse-ox until corrected term age and
                a documented apnea-free interval.
              </p>
            </div>
            <div className="bg-warm-white border border-border rounded-card p-5">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: SAGE }}
              >
                BPD on home O<sub>2</sub>
              </div>
              <p className="text-sm text-body leading-relaxed">
                Infants discharged on supplemental oxygen for bronchopulmonary
                dysplasia, where overnight oximetry is used to titrate weaning
                and detect sleep-related hypoxemia before clinic visits would
                catch it.
              </p>
            </div>
            <div className="bg-warm-white border border-border rounded-card p-5">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: AMBER }}
              >
                CHD interstage
              </div>
              <p className="text-sm text-body leading-relaxed">
                Single-ventricle infants (HLHS and variants) at home between
                stage 1 and stage 2 palliation. Home pulse-ox is established
                standard of care via the National Pediatric Cardiology Quality
                Improvement Collaborative (NPC-QIC).
              </p>
            </div>
          </div>
        </section>

        {/* ── §03 What this is NOT ───────────────────────────────── */}
        <section>
          <SectionEyebrow index="03" label="What this is not" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-5">
            Five things this platform isn't.
          </h2>
          <div className="space-y-1">
            <ScopeRow label="Not a medical device">
              <p>
                No FDA clearance is claimed. The pipeline, thresholds, and
                handoff templates here are illustrative engineering and
                clinical framing for a PM portfolio. A real product would
                require 510(k) submission with predicate identification,
                bench/clinical validation, and a quality management system —
                see /strategy for the regulatory plan, /pipeline/evals for the
                eval discipline that would feed that submission.
              </p>
            </ScopeRow>
            <ScopeRow label="Not a replacement for clinical judgment">
              <p>
                The handoff text is a structured trigger for a clinician's
                attention, not a diagnosis. Every action step assumes a clinician
                in the loop. Triage labels (urgent / emergency / trend-tier
                flag) are inputs to human review, not autonomous interventions.
              </p>
            </ScopeRow>
            <ScopeRow label="Not for general infant monitoring">
              <p>
                AAP{" "}
                <em>does not recommend</em> consumer pulse-ox for healthy
                infants and has flagged accuracy concerns with consumer
                devices (Bonafide et al., JAMA 2017). This platform models
                prescribed monitoring for the three medically indicated
                cohorts above, not consumer use.
              </p>
            </ScopeRow>
            <ScopeRow label="Not a real-time alarm system">
              <p>
                The pipeline evaluates overnight recordings retrospectively
                and emits structured handoffs the next morning. It is not a
                replacement for the bedside pulse-ox monitor and does not
                claim live alarm escalation.
              </p>
            </ScopeRow>
            <ScopeRow label="Not validated on real patients">
              <p>
                Every number, label, and waveform on this site comes from
                synthetic data with planted ground truth. The metrics measure
                pipeline behavior on that synthetic cohort, not clinical
                accuracy on real infants. Real validation would require IRB
                approval, prospective enrollment, and held-out clinical-grade
                recordings.
              </p>
            </ScopeRow>
          </div>
        </section>

        {/* ── §04 Threshold framework ────────────────────────────── */}
        <section>
          <SectionEyebrow index="04" label="Threshold framework" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-5">
            Three thresholds, each with a literature anchor.
          </h2>
          <div className="space-y-1">
            <ScopeRow label="Target band (GA-adjusted)">
              <p>
                <strong style={{ color: TEAL_DARK }}>≤32w GA: 90–95%.</strong>{" "}
                Anchored to the BOOST-II / NeOProM consensus that converged on
                90–95% as the targeted range for extremely-to-very preterm
                infants — the lower bound of 90% was specifically chosen to
                avoid the mortality increase observed below it.
              </p>
              <p>
                <strong style={{ color: TEAL_DARK }}>≥33w GA: 95–100%.</strong>{" "}
                Anchored to AAP guidance that healthy term and late-preterm
                infants typically maintain SpO<sub>2</sub> ≥95% with brief dips
                into the low 90s being common and benign.
              </p>
            </ScopeRow>
            <ScopeRow label="Urgent (GA-adjusted)">
              <p>
                SpO<sub>2</sub> below the target band's lower bound, sustained
                ≥10 seconds. The 10-second duration is the literature anchor
                for clinically significant desaturation. For ≤32w babies, this
                fires below 90%; for ≥33w, below 95%.
              </p>
            </ScopeRow>
            <ScopeRow label="Emergency (population-level)">
              <p>
                SpO<sub>2</sub> &lt;80% sustained ≥10 seconds, applied across
                all GA. 80% is roughly the inflection point where neonatal
                hemodynamics begin to fail acutely, regardless of baseline. We
                deliberately do not GA-adjust this — for a CHD interstage baby
                or a BPD baby with a chronically depressed baseline, an
                absolute 80% threshold is still the right floor.
              </p>
            </ScopeRow>
            <ScopeRow label="Trend tier (multi-night)">
              <p>
                EWMA of nightly SatSeconds per baby over a rolling 16-night
                window, compared against a per-baby trailing baseline. Flags
                trajectories rising more than ~2σ above the baby's own
                quiet-baseline noise. Conceptually anchored to the BPD wean
                literature, which has consistently found that single-night
                pulse-ox underestimates overnight hypoxemic burden in
                clinically-ready-to-wean infants.
              </p>
            </ScopeRow>
            <ScopeRow label="Safety check (over all tiers)">
              <p>
                Any sustained SpO<sub>2</sub> &lt;90% for ≥10 seconds overrides
                an artifact label. The safety check sits above the rule
                engine, the ML classifier, and the expert queue. This is what
                "0 urgent false negatives" refers to on{" "}
                <Link
                  to="/clinical-ai"
                  className="text-teal-primary underline underline-offset-2"
                >
                  the Story page
                </Link>
                .
              </p>
            </ScopeRow>
          </div>
        </section>

        {/* ── §05 Citations ──────────────────────────────────────── */}
        <section>
          <SectionEyebrow index="05" label="Evidence base" />
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-5">
            What the thresholds are anchored to.
          </h2>
          <p
            className="font-body text-body leading-relaxed mb-6 max-w-3xl"
            style={{ fontSize: "1rem" }}
          >
            These are the published anchors behind §04. The platform's
            thresholds are not invented — they're operationalizations of
            consensus targets, with engineering choices (duration cutoff,
            artifact override, GA bucketing) made explicitly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CitationCard
              anchor="90–95% target for ≤32w"
              citation="BOOST-II UK, Australia, and NZ collaborative trials; NeOProM individual patient data meta-analysis (Askie et al., JAMA 2018)."
              describes="The 90% lower bound was set after pooled analysis showed mortality increase below it; the 95% upper bound limits oxygen toxicity and ROP risk."
            />
            <CitationCard
              anchor="≥95% target for term"
              citation="AAP guidance on neonatal pulse-ox; standard NICU and newborn-nursery practice."
              describes="Healthy term infants reach SpO₂ ≥95% by ~24h of life. Brief dips into the low 90s in sleep are common and benign."
            />
            <CitationCard
              anchor="≥10s sustained as the duration cutoff"
              citation="Standard neonatal desaturation event definition used across the NICU oximetry literature."
              describes="Shorter excursions are dominated by motion artifact and probe displacement; ≥10s is the durability threshold above which clinical interpretation is meaningful."
            />
            <CitationCard
              anchor="<80% as the emergency cutoff"
              citation="Acute neonatal hypoxemia physiology; consensus threshold used in NICU alarm management practice."
              describes="Below ~80%, hemodynamic compensation begins to fail regardless of baseline. Not GA-adjusted because the physiologic threshold isn't GA-adjusted."
            />
            <CitationCard
              anchor="Home pulse-ox for CHD interstage"
              citation="National Pediatric Cardiology Quality Improvement Collaborative (NPC-QIC) home monitoring program data."
              describes="Established standard of care for single-ventricle infants between stage-1 and stage-2 palliation. Documented attrition reduction with home oximetry."
            />
            <CitationCard
              anchor="Overnight oximetry in BPD wean"
              citation="Pediatric pulmonology literature on BPD home-oxygen weaning; multiple cohort studies have documented abnormal nocturnal oximetry in clinically-ready-to-wean infants."
              describes="The single-night clinical picture frequently underestimates the overnight hypoxemic burden — the empirical case for the trend tier."
            />
            <CitationCard
              anchor="AAP position on consumer pulse-ox"
              citation="Bonafide et al., JAMA 2017; AAP guidance on home cardiorespiratory monitors for healthy infants."
              describes="AAP does not recommend consumer pulse-ox for healthy infants and has documented inaccuracy and false-alarm rates in consumer devices. Cited to scope this platform out of that category."
            />
            <CitationCard
              anchor="Alarm fatigue framing"
              citation="Cvach M, AJN 2012; Bonafide CP et al., Pediatrics 2017."
              describes="The reason this platform emphasizes SatSeconds (depth × duration) and per-baby baselines: blunt-threshold alarms are the root cause of alarm fatigue in the populations we target."
            />
          </div>
        </section>

        {/* ── Bottom callout ─────────────────────────────────────── */}
        <section>
          <Callout accent={URGENT_RED}>
            <strong className="text-teal-dark">If you push back on a claim:</strong>{" "}
            point to which section above the claim depends on. Most clinical
            critique resolves to "this product isn't scoped to that population"
            or "that threshold is operationalized differently than the
            published anchor." Both are deliberate. Both are documented here.
          </Callout>
          <p
            className="text-muted text-center mt-6"
            style={{ fontSize: "0.8rem" }}
          >
            Background palette indicates clinical-scope content; production
            color/icon tokens for{" "}
            <span style={{ color: URGENT_RED, fontWeight: 600 }}>urgent</span>{" "}
            and{" "}
            <span style={{ color: EMERGENCY, fontWeight: 600 }}>emergency</span>{" "}
            preserved.
          </p>
        </section>
      </div>
    </article>
  );
}
