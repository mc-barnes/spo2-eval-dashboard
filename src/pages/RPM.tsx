/**
 * RPM — business / framing landing for pediatric home monitoring as a category,
 * with adult RPM as a generalization, not the primary frame.
 *
 * Sections:
 *  1. Hero — corrected framing per SPEC-v3 §3.
 *  2. ValueStoryPanels — four-panel value story (Panels 1-2 ship in RX-3a,
 *     Panels 3-4 in RX-3b).
 *  3. Adult RPM generalization — one paragraph.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ValueStoryPanels from "../components/ValueStoryPanels.tsx";
import { TEAL_DARK, TEAL_PRIMARY, AMBER } from "../config/theme.ts";

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
    <div className="pl-4" style={{ borderLeft: `3px solid ${accent}` }}>
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

export default function RPM() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-24">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-wider text-muted mb-4">
            Business · Pediatric home monitoring framing
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-teal-dark leading-[1.1] mb-6">
            Pediatric home monitoring is the category.
            <br className="hidden sm:block" />
            Adult RPM is the generalization.
          </h1>
          <p
            className="font-body text-body leading-relaxed mb-4"
            style={{ fontSize: "1.05rem" }}
          >
            The platform underneath is operational infrastructure for{" "}
            <strong className="text-teal-dark">
              pediatric home monitoring as a category
            </strong>{" "}
            &mdash; AOP after NICU discharge, interstage CHD between palliations,
            BPD home oxygen weaning. Adult RPM uses the same triage discipline
            and the same handoff rigor, but it is a generalization of this
            problem, not the primary frame.
          </p>
          <p className="font-body text-body leading-relaxed">
            The four panels below separate today&rsquo;s economics from
            tomorrow&rsquo;s model. Each P&amp;L is kept distinct because mixing
            them produces clean numbers and wrong strategy. Each tomorrow-state
            model is labeled as &ldquo;what would need to exist,&rdquo; not
            &ldquo;what we would adopt.&rdquo;
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <CtaLink to="/clinical-ai">Clinical AI engineering &rarr;</CtaLink>
            <CtaLink to="/strategy">Agentic strategy &rarr;</CtaLink>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-3 space-y-5">
          <HeroStat
            label="Category framing"
            value="Pediatric-first"
            sublabel="AOP, CHD interstage, BPD — adult RPM is a generalization, not the primary frame"
            accent={TEAL_PRIMARY}
          />
          <HeroStat
            label="Recurring CPT ceiling"
            value="$135–180"
            sublabel="Per patient, per month — if adult RPM codes applied to infants (Panel 2)"
            accent={AMBER}
          />
          <HeroStat
            label="Category ceiling"
            value="$80M–200M"
            sublabel="Annual, × 50K–100K US infants on prescribed home pulse ox"
            accent={TEAL_DARK}
          />
        </div>
      </section>

      {/* ── Value story panels ───────────────────────────────────── */}
      <ValueStoryPanels />

      {/* ── Adult RPM generalization ─────────────────────────────── */}
      <section>
        <p className="text-xs uppercase tracking-wider text-muted mb-2">
          <span className="text-teal-primary font-medium">Generalization</span>
          <span className="mx-2 text-border">/</span>
          Adult RPM
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-4">
          Same discipline, different baseline assumptions.
        </h2>
        <p
          className="font-body text-body leading-relaxed max-w-3xl"
          style={{ fontSize: "1rem" }}
        >
          The triage stack &mdash; rules where they fit, ML where they don&rsquo;t,
          expert review for the rest, LLM judges across all of it &mdash; ports
          cleanly upstream to adult chronic-care RPM: CHF weight and SpO
          <sub>2</sub>, COPD home oximetry, post-acute monitoring. What changes
          is the payer mix (adult RPM has a working CPT schedule today), the
          baseline physiology (GA-adjusted thresholds drop out), and the
          intervention horizon (months-to-years instead of weeks). The
          engineering discipline is identical; only the framing moves. That is
          the generalization, and it is the second-order story &mdash; not the
          first.
        </p>
      </section>
    </main>
  );
}
