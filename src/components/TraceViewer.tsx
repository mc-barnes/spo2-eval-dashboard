/**
 * TraceViewer — Plotly scatter chart for SpO2 waveform data.
 * Uses vanilla Plotly API via ref to avoid CJS interop issues with react-plotly.js.
 *
 * Target bands are GA-adjusted:
 *   ≤32w GA → 90–95% (BOOST-II / NeOProM consensus for extremely-to-very preterm)
 *   ≥33w GA → 95–100% (AAP guidance for moderate-late preterm and term)
 * Emergency line (80%) is population-level, not GA-adjusted.
 */
import { useRef, useEffect } from "react";
import type { WaveformData } from "../data/types.ts";
import {
  TEAL_PRIMARY,
  SAGE,
  EMERGENCY,
  PLOTLY_LAYOUT,
} from "../config/theme.ts";
import { getPlotly } from "../lib/plotly.ts";

interface TraceViewerProps {
  waveform: WaveformData;
  gestationalAgeWeeks?: number;
}

/** Returns the GA-adjusted target band, or null if GA is missing/invalid. */
function targetBandForGA(
  ga: number | undefined
): { min: number; max: number; label: string } | null {
  if (ga == null || !Number.isFinite(ga)) return null;
  if (ga <= 32) {
    return { min: 90, max: 95, label: `Target 90–95% (${ga}w GA, ≤32w band)` };
  }
  return { min: 95, max: 100, label: `Target 95–100% (${ga}w GA, ≥33w band)` };
}

export default function TraceViewer({
  waveform,
  gestationalAgeWeeks,
}: TraceViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    const xStart = waveform.hours[0];
    const xEnd = waveform.hours[waveform.hours.length - 1];
    const band = targetBandForGA(gestationalAgeWeeks);

    // Plotly shapes: target band rectangle (if GA available) + emergency line.
    const shapes: Array<Record<string, unknown>> = [];
    if (band) {
      shapes.push({
        type: "rect",
        xref: "x",
        yref: "y",
        x0: xStart,
        x1: xEnd,
        y0: band.min,
        y1: band.max,
        fillcolor: SAGE,
        opacity: 0.18,
        line: { width: 0 },
        layer: "below",
      });
    }
    shapes.push({
      type: "line",
      xref: "x",
      yref: "y",
      x0: xStart,
      x1: xEnd,
      y0: 80,
      y1: 80,
      line: { color: EMERGENCY, width: 1, dash: "dash" },
      layer: "below",
    });

    // Annotations for band label + emergency line label.
    const annotations: Array<Record<string, unknown>> = [];
    if (band) {
      annotations.push({
        xref: "paper",
        yref: "y",
        x: 0.99,
        xanchor: "right",
        y: (band.min + band.max) / 2,
        yanchor: "middle",
        text: band.label,
        showarrow: false,
        font: { ...PLOTLY_LAYOUT.font, size: 10, color: "#2C5F5B" },
        bgcolor: "rgba(255,255,255,0.75)",
        borderpad: 2,
      });
    }
    annotations.push({
      xref: "paper",
      yref: "y",
      x: 0.99,
      xanchor: "right",
      y: 80,
      yanchor: "bottom",
      text: "Emergency threshold 80% (population-level)",
      showarrow: false,
      font: { ...PLOTLY_LAYOUT.font, size: 10, color: EMERGENCY },
      bgcolor: "rgba(255,255,255,0.75)",
      borderpad: 2,
    });
    if (!band && gestationalAgeWeeks == null) {
      annotations.push({
        xref: "paper",
        yref: "paper",
        x: 0.02,
        xanchor: "left",
        y: 1.02,
        yanchor: "bottom",
        text: "GA unavailable — target band hidden",
        showarrow: false,
        font: { ...PLOTLY_LAYOUT.font, size: 10, color: "#7A8B87" },
      });
    }

    getPlotly().then((Plotly) => {
      if (cancelled || !containerRef.current) return;
      Plotly.newPlot(
        containerRef.current,
        [
          {
            x: waveform.hours,
            y: waveform.spo2,
            type: "scatter",
            mode: "lines",
            name: "SpO2",
            line: { color: TEAL_PRIMARY, width: 1.5 },
            hovertemplate: "Hour %{x:.1f}<br>SpO2 %{y:.1f}%<extra></extra>",
          },
        ],
        {
          ...PLOTLY_LAYOUT,
          title: {
            text: "SpO2 Overnight Waveform",
            font: { ...PLOTLY_LAYOUT.font, size: 14 },
          },
          xaxis: {
            title: { text: "Hours", font: PLOTLY_LAYOUT.font },
            gridcolor: "#E2DDD8",
            zeroline: false,
          },
          yaxis: {
            title: { text: "SpO2 (%)", font: PLOTLY_LAYOUT.font },
            range: [70, 102],
            gridcolor: "#E2DDD8",
            zeroline: false,
          },
          shapes,
          annotations,
          showlegend: false,
          autosize: true,
          height: 380,
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
  }, [waveform, gestationalAgeWeeks]);

  return <div ref={containerRef} className="w-full" style={{ width: "100%" }} />;
}
