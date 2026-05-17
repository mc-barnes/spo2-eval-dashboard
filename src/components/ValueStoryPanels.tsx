/**
 * ValueStoryPanels — four-panel value story for /rpm.
 *
 * Panel 1: Today's economics, split by actor (no P&L mixing).
 * Panel 2: CPT parity TAM ceiling, with caveats on-panel.
 * Panel 3: Capped-rental + step-down model (added in RX-3b).
 * Panel 4: Caregiver continuation tier (added in RX-3b).
 *
 * Editorial layout — static SVG/CSS only, no calculators, no chart libs.
 * Theme tokens only. Citations stated in-line per SPEC-v3 §6.
 */
import type { ReactNode } from "react";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  SAGE_BG,
  AMBER,
} from "../config/theme.ts";

/* ── Shared primitives ─────────────────────────────────────────── */

function PanelEyebrow({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <p className="text-xs uppercase tracking-wider text-muted mb-3">
      <span className="text-teal-primary font-medium">Panel {index}</span>
      <span className="mx-2 text-border">/</span>
      {label}
    </p>
  );
}

function PanelHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-teal-dark leading-tight mb-4">
      {children}
    </h2>
  );
}

function PanelLede({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-body text-body leading-relaxed mb-8 max-w-3xl"
      style={{ fontSize: "1rem" }}
    >
      {children}
    </p>
  );
}

function PanelCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-warm-white border border-border rounded-card p-5 sm:p-7">
      {children}
    </div>
  );
}

function CaveatBlock({
  anchor,
  caveats,
}: {
  anchor: string;
  caveats: string[];
}) {
  return (
    <div
      className="mt-6 bg-sage-bg px-5 py-4 text-sm text-body leading-relaxed"
      style={{
        borderLeft: `4px solid ${AMBER}`,
        borderRadius: "0 12px 12px 0",
      }}
    >
      <div className="text-xs uppercase tracking-wider text-teal-dark font-semibold mb-2">
        Caveats stated on-panel
      </div>
      <ul className="space-y-1.5">
        {caveats.map((c) => (
          <li key={c} className="flex gap-2">
            <span className="font-medium" style={{ color: AMBER }}>
              ·
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-muted">
        Anchor: <span className="text-body">{anchor}</span>
      </div>
    </div>
  );
}

/* ── Panel 1 — Today's economics ───────────────────────────────── */

type ActorRow = { label: string; value: string; note?: string };

function ActorBlock({
  actor,
  scope,
  rows,
  accent,
}: {
  actor: string;
  scope: string;
  rows: ActorRow[];
  accent: string;
}) {
  return (
    <div
      className="py-5 first:pt-0 last:pb-0 border-t border-border first:border-t-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-3 items-start">
        <div className="md:col-span-4">
          <div
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: accent }}
          >
            {actor}
          </div>
          <div className="text-sm text-body mt-1 leading-snug">{scope}</div>
        </div>
        <div className="md:col-span-8 space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="text-sm">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-body">{row.label}</span>
                <span className="font-heading text-teal-dark font-semibold">
                  {row.value}
                </span>
              </div>
              {row.note && (
                <div className="text-xs text-muted mt-0.5 leading-snug">
                  {row.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Panel1() {
  return (
    <section>
      <PanelEyebrow index="01" label="Today's economics" />
      <PanelHeading>Three P&amp;Ls, kept separate.</PanelHeading>
      <PanelLede>
        Pediatric home monitoring already moves money &mdash; just not in one
        pool. Each actor sees a different line item, on a different timeline,
        anchored to a different incentive. Mixing them produces a clean-looking
        total and a wrong strategy. The panel keeps them split.
      </PanelLede>
      <PanelCard>
        <ActorBlock
          actor="Device manufacturer"
          scope="DME revenue line; recurring supply + retention LTV."
          accent={TEAL_PRIMARY}
          rows={[
            {
              label: "DME reimbursement",
              value: "$200–500 / pt / mo",
              note: "Illustrative band — pediatric DME pricing varies by payer mix; no single clean public source.",
            },
            {
              label: "Retention LTV",
              value: "Tied to monitoring duration",
              note: "Longer prescribed wear → longer revenue capture per patient.",
            },
          ]}
        />
        <ActorBlock
          actor="Payer"
          scope="Avoided utilization + appropriate-use line items."
          accent={AMBER}
          rows={[
            {
              label: "Avoided ER / admission utilization",
              value: "~$50–150 / pt / mo",
              note: "Cohort-attributable, AHRQ HCUPnet pediatric admission cost benchmarks.",
            },
            {
              label: "Prescriber E/M visit appropriateness",
              value: "Right-sized follow-up",
              note: "Monitoring data flags which follow-ups are needed and which can be deferred.",
            },
          ]}
        />
        <ActorBlock
          actor="Risk-bearing provider"
          scope="Shared-savings and quality-bonus capture for ACOs and pediatric VBC entities."
          accent={TEAL_DARK}
          rows={[
            {
              label: "Shared savings",
              value: "ACO downside / upside contracts",
              note: "Avoided utilization flows back to the at-risk entity, not the FFS payer alone.",
            },
            {
              label: "Quality bonuses",
              value: "Pediatric VBC measures",
              note: "Composite quality scores reward monitored populations with documented adherence.",
            },
          ]}
        />
      </PanelCard>
      <p className="mt-4 text-xs text-muted leading-relaxed max-w-3xl">
        Figures are illustrative ranges, not transaction-level numbers. The
        intent is to show that each actor reads a different P&amp;L &mdash; not
        to forecast revenue.
      </p>
    </section>
  );
}

/* ── Panel 2 — CPT parity TAM ceiling ──────────────────────────── */

function CptRow({
  code,
  name,
  rate,
  period,
}: {
  code: string;
  name: string;
  rate: string;
  period: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-4 py-2.5 border-b border-border last:border-b-0 items-baseline">
      <div className="col-span-3 sm:col-span-2 font-mono text-sm text-teal-dark font-semibold">
        {code}
      </div>
      <div className="col-span-5 sm:col-span-6 text-sm text-body leading-snug">
        {name}
      </div>
      <div className="col-span-2 text-sm text-muted">{period}</div>
      <div className="col-span-2 text-right font-heading text-sm text-teal-dark font-semibold">
        {rate}
      </div>
    </div>
  );
}

function Panel2() {
  return (
    <section>
      <PanelEyebrow index="02" label="The CPT parity possibility" />
      <PanelHeading>Billable capacity if codes applied at full utilization.</PanelHeading>
      <PanelLede>
        A ceiling, not a forecast. Adult RPM has four CPT codes that pay across
        setup, device supply, and remote management. If &mdash; and only if
        &mdash; that schedule extended to infants on prescribed home pulse ox,
        the math sets the upper bound on a single pediatric monitoring
        category.
      </PanelLede>
      <PanelCard>
        <div className="grid grid-cols-12 gap-x-4 pb-2 border-b-2 border-border">
          <div className="col-span-3 sm:col-span-2 text-xs uppercase tracking-wider text-muted font-semibold">
            CPT
          </div>
          <div className="col-span-5 sm:col-span-6 text-xs uppercase tracking-wider text-muted font-semibold">
            What it pays for
          </div>
          <div className="col-span-2 text-xs uppercase tracking-wider text-muted font-semibold">
            Period
          </div>
          <div className="col-span-2 text-right text-xs uppercase tracking-wider text-muted font-semibold">
            Rate
          </div>
        </div>
        <CptRow
          code="99453"
          name="Initial set-up and patient education on equipment use"
          rate="$22"
          period="one-time"
        />
        <CptRow
          code="99454"
          name="Device supply with daily recording or alerts"
          rate="$52"
          period="/ month"
        />
        <CptRow
          code="99457"
          name="First 20 minutes of remote management"
          rate="$52"
          period="/ month"
        />
        <CptRow
          code="99458"
          name="Each additional 20 minutes (× 2)"
          rate="$82"
          period="/ month"
        />

        {/* Recurring + TAM rollup */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-card"
            style={{
              backgroundColor: SAGE_BG,
              borderLeft: `3px solid ${TEAL_PRIMARY}`,
            }}
          >
            <div className="text-xs uppercase tracking-wider text-muted mb-1">
              Recurring ceiling
            </div>
            <div className="font-heading text-2xl text-teal-dark font-semibold leading-none">
              $135&ndash;180
            </div>
            <div className="text-xs text-muted mt-1">per patient, per month</div>
          </div>
          <div
            className="p-4 rounded-card"
            style={{
              backgroundColor: SAGE_BG,
              borderLeft: `3px solid ${TEAL_DARK}`,
            }}
          >
            <div className="text-xs uppercase tracking-wider text-muted mb-1">
              Category ceiling
            </div>
            <div className="font-heading text-2xl text-teal-dark font-semibold leading-none">
              $80M&ndash;200M
            </div>
            <div className="text-xs text-muted mt-1">
              annual, × 50K&ndash;100K US infants on prescribed home pulse ox
            </div>
          </div>
        </div>
      </PanelCard>

      <CaveatBlock
        anchor="CMS PFS 2026 Final Rule"
        caveats={[
          "Assumes adult RPM coverage extended to infants — pediatric pulse-ox today does not bill under 99453 / 99454 / 99457 / 99458.",
          "Assumes full 99457 + 2× 99458 utilization — real-world averages are lower; recurring revenue per patient typically lands well below the ceiling.",
          "US-only; CMS payment context. Commercial and Medicaid pricing diverge.",
        ]}
      />
    </section>
  );
}

/* ── Export ────────────────────────────────────────────────────── */

export default function ValueStoryPanels() {
  return (
    <div className="space-y-20">
      <Panel1 />
      <Panel2 />
      {/* Panel 3 & 4 land in RX-3b */}
    </div>
  );
}
