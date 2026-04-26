/**
 * Interoperability — HL7v2 Rhapsody integration demo.
 * Shows message routing flow, HL7 message viewer with syntax highlighting,
 * round-trip validation, segment mapping, and production notes.
 */
import { useEffect, useState } from "react";
import { loadHL7Messages } from "../data/loader.ts";
import type { HL7Messages, HL7LabelData } from "../data/types.ts";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import MetricCard from "../components/ui/MetricCard.tsx";
import DetailRow from "../components/ui/DetailRow.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import HL7MessageViewer from "../components/HL7MessageViewer.tsx";
import {
  TEAL_DARK,
  TEAL_PRIMARY,
  TEAL_LIGHT,
  SAGE,
  URGENT_RED,
} from "../config/theme.ts";

const LABEL_OPTIONS = ["all", "normal", "borderline", "urgent", "emergency", "artifact"];
const TAB_KEYS = ["adt_a01", "ack_a01", "oru_r01"] as const;
const TAB_LABELS: Record<string, string> = {
  adt_a01: "ADT^A01",
  ack_a01: "ACK^A01",
  oru_r01: "ORU^R01",
};

export default function Interoperability() {
  const [data, setData] = useState<HL7Messages | null>(null);
  const [labelFilter, setLabelFilter] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TAB_KEYS)[number]>("adt_a01");
  const [showSegmentMapping, setShowSegmentMapping] = useState(false);
  const [showProductionNotes, setShowProductionNotes] = useState(false);

  useEffect(() => {
    loadHL7Messages().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="text-muted text-sm">Loading HL7 messages...</div>;
  }

  // Extract label data entries (skip _segment_mapping and _production_notes)
  const entries = Object.entries(data).filter(
    ([key]) => !key.startsWith("_")
  ) as [string, HL7LabelData][];

  const filteredEntries =
    labelFilter === "all"
      ? entries
      : entries.filter(
          ([, v]) => v.final_label.toLowerCase() === labelFilter
        );

  // Auto-select first if none selected or selection filtered out
  const effectiveKey =
    selectedKey && filteredEntries.some(([k]) => k === selectedKey)
      ? selectedKey
      : filteredEntries[0]?.[0] ?? null;

  const selected = effectiveKey
    ? (data[effectiveKey] as HL7LabelData | undefined)
    : null;

  // Segment mapping table data
  const segmentColumns = ["Field", "Name", "Source", "Description"];
  const segmentRows: Array<Record<string, string | number>> = data._segment_mapping
    ? data._segment_mapping.map((s) => ({
        Field: s.field,
        Name: s.name,
        Source: s.source,
        Description: s.description,
      }))
    : [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">
        HL7v2 Interoperability
      </h1>

      <PageIntro>
        Demonstrates HL7v2 message generation for EHR integration via a
        Rhapsody-style interoperability engine. Messages use LOINC 59408-5
        (oxygen saturation, pulse oximetry) and follow standard ADT/ACK/ORU
        workflows for NICU patient admission and result reporting.
      </PageIntro>

      {/* ─── Filter ──────────────────────────────────────────────── */}
      <div>
        <label className="block text-muted font-medium mb-1" style={{ fontSize: "0.8rem" }}>
          Label Filter
        </label>
        <select
          value={labelFilter}
          onChange={(e) => {
            setLabelFilter(e.target.value);
            setSelectedKey(null);
          }}
          className="px-3 py-2 rounded-table border border-border bg-warm-white text-body"
          style={{ fontSize: "0.85rem" }}
        >
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all"
                ? "All Labels"
                : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Metric cards ────────────────────────────────────────── */}
      {selected && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="ADT Segments"
            value={String(selected.adt_segment_count)}
            accentColor={TEAL_PRIMARY}
          />
          <MetricCard
            label="OBX Observations"
            value={String(selected.oru_obx_count)}
            accentColor={TEAL_LIGHT}
          />
          <MetricCard
            label="Round-Trip"
            value={selected.round_trip_match ? "Match" : "Mismatch"}
            accentColor={selected.round_trip_match ? TEAL_PRIMARY : URGENT_RED}
          />
        </div>
      )}

      {/* ─── Route flow diagram ──────────────────────────────────── */}
      <SectionCard
        title="Message Route"
        subtitle="HL7v2 message flow through Rhapsody integration engine"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {/* NICU Monitor */}
          <div
            className="border-2 rounded-card px-4 py-3 text-center bg-warm-white min-w-[130px]"
            style={{ borderColor: TEAL_DARK }}
          >
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: TEAL_DARK }}>
              NICU Monitor
            </div>
          </div>

          {/* ADT/ACK arrows */}
          <div className="flex flex-col items-center gap-0.5" style={{ fontSize: "0.75rem" }}>
            <span style={{ color: TEAL_PRIMARY }}>ADT^A01 &rarr;</span>
            <span style={{ color: SAGE }}>&larr; ACK^A01</span>
          </div>

          {/* Rhapsody */}
          <div
            className="border-2 rounded-card px-4 py-3 text-center bg-warm-white min-w-[150px]"
            style={{ borderColor: TEAL_PRIMARY }}
          >
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: TEAL_PRIMARY }}>
              Rhapsody Engine
            </div>
          </div>

          {/* Down arrow */}
          <div className="text-muted text-lg">&darr;</div>

          {/* Pipeline */}
          <div
            className="border-2 rounded-card px-4 py-3 text-center bg-warm-white min-w-[150px]"
            style={{ borderColor: TEAL_PRIMARY }}
          >
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: TEAL_PRIMARY }}>
              SpO2 Eval Pipeline
            </div>
          </div>

          {/* Down arrow */}
          <div className="text-muted text-lg">&darr;</div>

          {/* Rhapsody 2 */}
          <div
            className="border-2 rounded-card px-4 py-3 text-center bg-warm-white min-w-[150px]"
            style={{ borderColor: TEAL_PRIMARY }}
          >
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: TEAL_PRIMARY }}>
              Rhapsody Engine
            </div>
          </div>

          {/* ORU arrow */}
          <div className="flex flex-col items-center" style={{ fontSize: "0.75rem" }}>
            <span style={{ color: TEAL_PRIMARY }}>ORU^R01 &rarr;</span>
          </div>

          {/* EHR */}
          <div
            className="border-2 rounded-card px-4 py-3 text-center bg-warm-white min-w-[140px]"
            style={{ borderColor: TEAL_DARK }}
          >
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: TEAL_DARK }}>
              EHR / Nurse Station
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ─── Trace selector (secondary) ──────────────────────────── */}
      {filteredEntries.length > 1 && (
        <div>
          <label className="block text-muted font-medium mb-1" style={{ fontSize: "0.8rem" }}>
            Select Trace ({filteredEntries.length} available)
          </label>
          <select
            value={effectiveKey ?? ""}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full max-w-md px-3 py-2 rounded-table border border-border bg-warm-white text-body"
            style={{ fontSize: "0.85rem" }}
          >
            {filteredEntries.map(([key, v]) => (
              <option key={key} value={key}>
                {v.baby.baby_id} / {v.final_label} / {v.urgency_level}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ─── Two-column: HL7 messages + details ──────────────────── */}
      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left (2 cols): Tabbed HL7 messages */}
          <div className="lg:col-span-2">
            <SectionCard title="HL7v2 Messages">
              {/* Tab buttons */}
              <div className="flex gap-1 mb-4">
                {TAB_KEYS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-badge font-semibold transition-colors ${
                      activeTab === tab
                        ? "bg-teal-primary text-white"
                        : "bg-sage-bg text-teal-dark hover:bg-sage"
                    }`}
                    style={{ fontSize: "0.78rem" }}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>

              {/* Message viewer */}
              <HL7MessageViewer
                message={selected[activeTab]}
                title={TAB_LABELS[activeTab]}
              />
            </SectionCard>
          </div>

          {/* Right (1 col): Patient details + round-trip */}
          <div className="space-y-4">
            <SectionCard title="Patient Details">
              <DetailRow label="Baby ID" value={selected.baby.baby_id} />
              <DetailRow
                label="Gestational Age"
                value={`${selected.baby.gestational_age_weeks} weeks`}
              />
              <DetailRow
                label="Birth Weight"
                value={`${selected.baby.birth_weight_grams}g`}
              />
              <DetailRow label="Final Label" value={selected.final_label} />
              <DetailRow label="Urgency" value={selected.urgency_level} />
              <DetailRow
                label="Mean SpO2"
                value={`${selected.stats.mean_spo2.toFixed(1)}%`}
              />
              <DetailRow
                label="Min SpO2"
                value={`${selected.stats.min_spo2.toFixed(1)}%`}
              />
              <DetailRow label="Events" value={String(selected.stats.n_events)} />
            </SectionCard>

            <SectionCard title="Round-Trip Validation">
              {selected.round_trip_fields.map((rtf) => (
                <div
                  key={rtf.field}
                  className="flex items-baseline justify-between border-b border-border"
                  style={{ padding: "6px 0" }}
                >
                  <span className="text-muted font-medium" style={{ fontSize: "0.8rem" }}>
                    {rtf.field}
                  </span>
                  <span className="font-medium" style={{ fontSize: "0.85rem" }}>
                    {rtf.match ? (
                      <span className="text-teal-primary">&#10003;</span>
                    ) : (
                      <span className="text-urgent-red">&#10007;</span>
                    )}
                    <span className="ml-2 text-body" style={{ fontSize: "0.78rem" }}>
                      {rtf.original === rtf.parsed
                        ? rtf.original
                        : `${rtf.original} / ${rtf.parsed}`}
                    </span>
                  </span>
                </div>
              ))}
            </SectionCard>
          </div>
        </div>
      )}

      {/* ─── Expandable: Segment Mapping Reference ───────────────── */}
      {data._segment_mapping && (
        <div>
          <button
            onClick={() => setShowSegmentMapping((prev) => !prev)}
            className="px-4 py-2 rounded-badge font-semibold bg-sage-bg text-teal-dark hover:bg-sage transition-colors"
            style={{ fontSize: "0.8rem" }}
          >
            {showSegmentMapping
              ? "Hide Segment Mapping"
              : "Show Segment Mapping Reference"}
          </button>
          {showSegmentMapping && (
            <div className="mt-3">
              <DataTable columns={segmentColumns} rows={segmentRows} />
            </div>
          )}
        </div>
      )}

      {/* ─── Expandable: Production Considerations ───────────────── */}
      {data._production_notes && (
        <div>
          <button
            onClick={() => setShowProductionNotes((prev) => !prev)}
            className="px-4 py-2 rounded-badge font-semibold bg-sage-bg text-teal-dark hover:bg-sage transition-colors"
            style={{ fontSize: "0.8rem" }}
          >
            {showProductionNotes
              ? "Hide Production Notes"
              : "Show Production Considerations"}
          </button>
          {showProductionNotes && (
            <div className="mt-3 space-y-3">
              {data._production_notes.map((note, i) => (
                <div
                  key={i}
                  className="bg-warm-white border border-border rounded-table px-4 py-3"
                  style={{ borderLeftWidth: 3, borderLeftColor: TEAL_PRIMARY }}
                >
                  <h4 className="font-semibold text-teal-dark mb-1" style={{ fontSize: "0.85rem" }}>
                    {note.title}
                  </h4>
                  <p className="text-body leading-relaxed" style={{ fontSize: "0.8rem" }}>
                    {note.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
