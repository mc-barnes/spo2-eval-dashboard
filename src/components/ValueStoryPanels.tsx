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
  SAGE,
  SAGE_BG,
  AMBER,
  BORDER,
  MUTED,
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
    <div className="bg-warm-white border border-border rounded-card p-5 sm:p-7 overflow-x-auto">
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
      <div className="col-span-2 font-mono text-sm text-teal-dark font-semibold">
        {code}
      </div>
      <div className="col-span-5 sm:col-span-6 text-sm text-body leading-snug">
        {name}
      </div>
      <div className="col-span-3 sm:col-span-2 text-sm text-muted whitespace-nowrap">
        {period}
      </div>
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
          <div className="col-span-2 text-xs uppercase tracking-wider text-muted font-semibold">
            CPT
          </div>
          <div className="col-span-5 sm:col-span-6 text-xs uppercase tracking-wider text-muted font-semibold">
            What it pays for
          </div>
          <div className="col-span-3 sm:col-span-2 text-xs uppercase tracking-wider text-muted font-semibold">
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
          period="/month"
        />
        <CptRow
          code="99457"
          name="First 20 minutes of remote management"
          rate="$52"
          period="/month"
        />
        <CptRow
          code="99458"
          name="Each additional 20 minutes (× 2)"
          rate="$82"
          period="/month"
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

/* ── Panel 3 — Capped-rental + step-down (CPAP analog) ────────── */

/**
 * CappedRentalTimeline — 24-month axis. Four conceptual stages labeled
 * across the top (Trial / Capped rental / Step-down / Ownership). Below,
 * three condition rows (AOP, CHD interstage, BPD) with the capped-rental
 * duration bar drawn at the spec-anchored interval. Schematic, not data.
 */
function CappedRentalTimeline() {
  const xAt = (month: number) => 110 + (month / 24) * 580;
  const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  type Row = {
    label: string;
    detail: string;
    capStart: number;
    capEnd: number;
    accent: string;
    citation: string;
  };

  const rows: Row[] = [
    {
      label: "AOP",
      detail: "NICU discharge → 43 wks PMA + stable interval",
      capStart: 3,
      capEnd: 6,
      accent: TEAL_PRIMARY,
      citation: "Eichenwald 2016 AAP",
    },
    {
      label: "CHD interstage",
      detail: "Stage 1 → Stage 2 palliation",
      capStart: 3,
      capEnd: 6,
      accent: AMBER,
      citation: "Rudd 2020 AHA",
    },
    {
      label: "BPD",
      detail: "Median home oxygen wean ~14 mo corrected age",
      capStart: 3,
      capEnd: 15,
      accent: SAGE,
      citation: "Everitt 2020",
    },
  ];

  const rowHeight = 44;
  const rowsTop = 96;
  const baseHeight = rowsTop + rows.length * rowHeight + 36;

  return (
    <svg
      viewBox={`0 0 720 ${baseHeight}`}
      className="h-auto w-[640px] sm:w-full"
      role="img"
      aria-label="Schematic timeline of a four-stage capped-rental model (Trial / Capped rental / Step-down / Ownership) over 24 months, with condition-specific capped-rental durations overlaid for AOP, CHD interstage, and BPD."
    >
      <title>
        Capped-rental + step-down schematic with condition-specific durations
      </title>

      {/* Stage band — top labels */}
      <g>
        {/* Trial */}
        <rect x={xAt(0)} y={28} width={xAt(3) - xAt(0)} height={20} fill={SAGE_BG} />
        <text x={(xAt(0) + xAt(3)) / 2} y={42} textAnchor="middle" fontSize={10} fill={TEAL_DARK} fontWeight={500}>
          Trial (0–3 mo)
        </text>
        {/* Capped rental (conceptual span) */}
        <rect x={xAt(3)} y={28} width={xAt(18) - xAt(3)} height={20} fill={SAGE_BG} opacity={0.55} />
        <text x={(xAt(3) + xAt(18)) / 2} y={42} textAnchor="middle" fontSize={10} fill={TEAL_DARK} fontWeight={500}>
          Capped rental (condition-specific)
        </text>
        {/* Step-down */}
        <rect x={xAt(18)} y={28} width={xAt(22) - xAt(18)} height={20} fill={SAGE_BG} opacity={0.35} />
        <text x={(xAt(18) + xAt(22)) / 2} y={42} textAnchor="middle" fontSize={10} fill={TEAL_DARK} fontWeight={500}>
          Step-down
        </text>
        {/* Ownership */}
        <rect x={xAt(22)} y={28} width={xAt(24) - xAt(22)} height={20} fill={SAGE_BG} opacity={0.2} />
        <text x={(xAt(22) + xAt(24)) / 2} y={42} textAnchor="middle" fontSize={9} fill={TEAL_DARK} fontWeight={500}>
          Ownership
        </text>
      </g>

      {/* Time axis */}
      <line x1={xAt(0)} y1={68} x2={xAt(24)} y2={68} stroke={BORDER} strokeWidth={1} />
      {ticks.map((m) => (
        <g key={m}>
          <line x1={xAt(m)} y1={68} x2={xAt(m)} y2={72} stroke={MUTED} strokeWidth={1} />
          <text x={xAt(m)} y={84} textAnchor="middle" fontSize={9} fill={MUTED}>
            {m === 0 ? "Mo 0" : m}
          </text>
        </g>
      ))}

      {/* Condition rows */}
      {rows.map((row, i) => {
        const y = rowsTop + i * rowHeight;
        const barY = y + 18;
        return (
          <g key={row.label}>
            {/* Row label, left of axis */}
            <text x={100} y={barY + 4} textAnchor="end" fontSize={11} fill={TEAL_DARK} fontWeight={600}>
              {row.label}
            </text>
            <text x={100} y={barY + 18} textAnchor="end" fontSize={9} fill={MUTED}>
              {row.citation}
            </text>
            {/* Row baseline */}
            <line
              x1={xAt(0)}
              y1={barY}
              x2={xAt(24)}
              y2={barY}
              stroke={BORDER}
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            {/* Capped-rental duration bar */}
            <rect
              x={xAt(row.capStart)}
              y={barY - 7}
              width={xAt(row.capEnd) - xAt(row.capStart)}
              height={14}
              fill={row.accent}
              rx={3}
            />
            <text
              x={(xAt(row.capStart) + xAt(row.capEnd)) / 2}
              y={barY + 4}
              textAnchor="middle"
              fontSize={9}
              fill="white"
              fontWeight={600}
            >
              {row.capEnd - row.capStart} mo
            </text>
            {/* Detail label, right of bar */}
            <text
              x={xAt(row.capEnd) + 8}
              y={barY + 4}
              fontSize={9}
              fill={MUTED}
            >
              {row.detail}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel3() {
  return (
    <section>
      <PanelEyebrow index="03" label="Capped-rental + step-down (CPAP analog)" />
      <PanelHeading>The structural model that would need to exist.</PanelHeading>
      <PanelLede>
        Not the model we&rsquo;d adopt &mdash; the model the payer landscape
        would need to put in place for the pediatric monitoring category to
        bill cleanly. Adult CPAP has four stages baked into its coverage
        regime: trial, capped rental, step-down, ownership. Pediatric pulse-ox
        could plausibly map to the same shape, with stage two duration
        anchored to clinical trajectory rather than calendar default.
      </PanelLede>
      <PanelCard>
        <CappedRentalTimeline />
      </PanelCard>

      <div
        className="mt-6 px-5 py-4 text-sm text-body leading-relaxed"
        style={{
          backgroundColor: SAGE_BG,
          borderLeft: `4px solid ${TEAL_DARK}`,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <div className="text-xs uppercase tracking-wider text-teal-dark font-semibold mb-2">
          Policy lift — stated honestly
        </div>
        <p>
          Pediatric home pulse-ox today is commercial + Medicaid with no
          equivalent rulemaking. Implementing this model would require CMS
          rulemaking for dual-eligibles, or state-by-state Medicaid + commercial
          payer adoption. Either path is a <strong className="text-teal-dark">5–10 year roadmap</strong>,
          not a product decision.
        </p>
      </div>
    </section>
  );
}

/* ── Panel 4 — Caregiver continuation tier (dual-timeline) ─────── */

/**
 * DualTimeline — two parallel rows. Top: medical-necessity timeline, ends
 * at the medical endpoint. Bottom: caregiver-need timeline, continues into
 * a family-paid wellness tier (rendered dashed-outline to signal non-medical
 * coverage). A vertical "graduation" marker sits at the divergence point.
 */
function DualTimeline() {
  const xAt = (month: number) => 110 + (month / 24) * 580;
  const ticks = [0, 6, 12, 18, 24];

  const activeEnd = 6;
  const stepEnd = 12;
  const medicalEnd = stepEnd;
  const wellnessEnd = 24;

  const rowMedicalY = 70;
  const rowCaregiverY = 140;
  const barHeight = 28;

  return (
    <svg
      viewBox="0 0 720 220"
      className="h-auto w-[640px] sm:w-full"
      role="img"
      aria-label="Schematic of two parallel timelines. Top: medical-necessity timeline (payer-funded active monitoring then step-down) ending at the medical endpoint. Bottom: caregiver-need timeline continuing past the medical endpoint into a family-paid wellness tier."
    >
      <title>
        Medical-necessity and caregiver-need timelines diverging at the medical endpoint
      </title>

      {/* Time axis */}
      <line x1={xAt(0)} y1={195} x2={xAt(24)} y2={195} stroke={BORDER} strokeWidth={1} />
      {ticks.map((m) => (
        <g key={m}>
          <line x1={xAt(m)} y1={195} x2={xAt(m)} y2={199} stroke={MUTED} strokeWidth={1} />
          <text x={xAt(m)} y={211} textAnchor="middle" fontSize={9} fill={MUTED}>
            {m === 0 ? "Discharge" : `Mo ${m}`}
          </text>
        </g>
      ))}

      {/* Row labels */}
      <text x={100} y={rowMedicalY + barHeight / 2 + 4} textAnchor="end" fontSize={11} fill={TEAL_DARK} fontWeight={600}>
        Medical necessity
      </text>
      <text x={100} y={rowMedicalY + barHeight / 2 + 18} textAnchor="end" fontSize={9} fill={MUTED}>
        Payer view
      </text>

      <text x={100} y={rowCaregiverY + barHeight / 2 + 4} textAnchor="end" fontSize={11} fill={TEAL_DARK} fontWeight={600}>
        Caregiver need
      </text>
      <text x={100} y={rowCaregiverY + barHeight / 2 + 18} textAnchor="end" fontSize={9} fill={MUTED}>
        Family view
      </text>

      {/* Medical necessity row — Active monitoring + Step-down, ends at medical endpoint */}
      <rect
        x={xAt(0)}
        y={rowMedicalY}
        width={xAt(activeEnd) - xAt(0)}
        height={barHeight}
        fill={TEAL_PRIMARY}
        rx={3}
      />
      <text x={(xAt(0) + xAt(activeEnd)) / 2} y={rowMedicalY + barHeight / 2 + 4} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>
        Active monitoring
      </text>

      <rect
        x={xAt(activeEnd)}
        y={rowMedicalY}
        width={xAt(stepEnd) - xAt(activeEnd)}
        height={barHeight}
        fill={SAGE}
        rx={3}
      />
      <text x={(xAt(activeEnd) + xAt(stepEnd)) / 2} y={rowMedicalY + barHeight / 2 + 4} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>
        Step-down
      </text>

      {/* Medical endpoint label */}
      <text x={xAt(medicalEnd) + 6} y={rowMedicalY + barHeight / 2 + 4} fontSize={9} fill={MUTED}>
        AOP resolution / BPD wean / CHD Stage 2
      </text>

      {/* Caregiver row — Active + Step-down (mirrors medical) + Wellness (family-paid) */}
      <rect
        x={xAt(0)}
        y={rowCaregiverY}
        width={xAt(activeEnd) - xAt(0)}
        height={barHeight}
        fill={TEAL_PRIMARY}
        rx={3}
      />
      <text x={(xAt(0) + xAt(activeEnd)) / 2} y={rowCaregiverY + barHeight / 2 + 4} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>
        Active monitoring
      </text>

      <rect
        x={xAt(activeEnd)}
        y={rowCaregiverY}
        width={xAt(stepEnd) - xAt(activeEnd)}
        height={barHeight}
        fill={SAGE}
        rx={3}
      />
      <text x={(xAt(activeEnd) + xAt(stepEnd)) / 2} y={rowCaregiverY + barHeight / 2 + 4} textAnchor="middle" fontSize={10} fill="white" fontWeight={600}>
        Step-down
      </text>

      {/* Wellness tier — dashed outline, no fill, signals non-medical / family-paid */}
      <rect
        x={xAt(stepEnd)}
        y={rowCaregiverY}
        width={xAt(wellnessEnd) - xAt(stepEnd)}
        height={barHeight}
        fill="none"
        stroke={MUTED}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        rx={3}
      />
      <text x={(xAt(stepEnd) + xAt(wellnessEnd)) / 2} y={rowCaregiverY + barHeight / 2 + 4} textAnchor="middle" fontSize={10} fill={TEAL_DARK} fontWeight={600}>
        Wellness · family-paid
      </text>

      {/* Graduation marker — vertical line at medical endpoint */}
      <line
        x1={xAt(medicalEnd)}
        y1={rowMedicalY - 14}
        x2={xAt(medicalEnd)}
        y2={rowCaregiverY + barHeight + 14}
        stroke={AMBER}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text x={xAt(medicalEnd)} y={rowMedicalY - 20} textAnchor="middle" fontSize={9} fill={AMBER} fontWeight={600}>
        Graduation
      </text>
      <text x={xAt(medicalEnd)} y={rowMedicalY - 32} textAnchor="middle" fontSize={8} fill={MUTED}>
        coverage → continuation
      </text>
    </svg>
  );
}

function Panel4() {
  return (
    <section>
      <PanelEyebrow index="04" label="Caregiver continuation tier" />
      <PanelHeading>Two timelines, one graduation point.</PanelHeading>
      <PanelLede>
        Medical-necessity coverage ends when clinical criteria are met &mdash;
        AOP resolution, BPD wean, CHD Stage 2 palliation. Family readiness ends
        on a different clock. The model accounts for both by separating
        payer-funded coverage from a family-paid continuation tier at the
        graduation point, so the medical timeline closes cleanly and the
        caregiver timeline keeps the established monitoring habit intact for
        anyone who chooses to continue.
      </PanelLede>

      <PanelCard>
        <DualTimeline />

        {/* Tier legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: TEAL_PRIMARY }}
              aria-hidden
            />
            <div>
              <div className="text-body font-medium">Active monitoring</div>
              <div className="text-xs text-muted">Payer-funded</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: SAGE }}
              aria-hidden
            />
            <div>
              <div className="text-body font-medium">Step-down</div>
              <div className="text-xs text-muted">Payer-funded, lower rate</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-sm border"
              style={{
                borderColor: MUTED,
                borderStyle: "dashed",
                borderWidth: 1.5,
              }}
              aria-hidden
            />
            <div>
              <div className="text-body font-medium">Wellness · family-paid</div>
              <div className="text-xs text-muted">$9.99 / mo opt-in</div>
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Continuity-of-relationship framing block */}
      <div
        className="mt-6 px-5 py-4 text-sm text-body leading-relaxed"
        style={{
          backgroundColor: SAGE_BG,
          borderLeft: `4px solid ${TEAL_PRIMARY}`,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <div className="text-xs uppercase tracking-wider text-teal-dark font-semibold mb-2">
          How the continuation tier is positioned
        </div>
        <p className="mb-2">
          The daily monitoring habit is already established by the time medical
          coverage ends. The wellness tier is an{" "}
          <strong className="text-teal-dark">
            opt-in continuation of the monitoring relationship parents have
            already built
          </strong>{" "}
          &mdash; not a new product, not a clinical intervention. Families who
          choose to continue keep the same device interaction at a flat
          family-paid rate; families who don&rsquo;t simply graduate off.
        </p>
        <p>
          The $9.99 / mo figure is set at the lower bound of the documented
          $9.99&ndash;15 / mo band for consumer-grade post-discharge wellness
          subscriptions &mdash; matching the dominant market benchmark rather
          than marking up against it.
        </p>
      </div>

      {/* Provider-referral line — mandatory copy rule #3 */}
      <p className="mt-4 text-sm text-body leading-relaxed">
        If anxiety persists after medical coverage ends,{" "}
        <strong className="text-teal-dark">talk to your provider</strong>. The
        continuation tier is not a clinical intervention and is not a
        substitute for clinical follow-up.
      </p>
    </section>
  );
}

/* ── Export ────────────────────────────────────────────────────── */

export default function ValueStoryPanels() {
  return (
    <div className="space-y-20">
      <Panel1 />
      <Panel2 />
      <Panel3 />
      <Panel4 />
    </div>
  );
}
