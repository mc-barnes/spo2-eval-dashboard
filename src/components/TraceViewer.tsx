/**
 * TraceViewer — Plotly scatter chart for SpO2 waveform data.
 * Uses vanilla Plotly API via ref to avoid CJS interop issues with react-plotly.js.
 */
import { useRef, useEffect } from "react";
import type { WaveformData } from "../data/types.ts";
import {
  TEAL_PRIMARY,
  URGENT_RED,
  EMERGENCY,
  PLOTLY_LAYOUT,
} from "../config/theme.ts";

interface TraceViewerProps {
  waveform: WaveformData;
}

/** Lazily loaded Plotly module. */
let plotlyLib: any = null;
const getPlotly = async () => {
  if (plotlyLib) return plotlyLib;
  const mod = await import("plotly.js-basic-dist-min");
  plotlyLib = mod.default ?? mod;
  return plotlyLib;
};

export default function TraceViewer({ waveform }: TraceViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

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
          {
            x: [waveform.hours[0], waveform.hours[waveform.hours.length - 1]],
            y: [90, 90],
            type: "scatter",
            mode: "lines",
            name: "Urgent (90%)",
            line: { color: URGENT_RED, width: 1, dash: "dash" },
            hoverinfo: "skip",
          },
          {
            x: [waveform.hours[0], waveform.hours[waveform.hours.length - 1]],
            y: [80, 80],
            type: "scatter",
            mode: "lines",
            name: "Emergency (80%)",
            line: { color: EMERGENCY, width: 1, dash: "dash" },
            hoverinfo: "skip",
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
          legend: {
            orientation: "h",
            y: -0.2,
            x: 0.5,
            xanchor: "center",
            font: { ...PLOTLY_LAYOUT.font, size: 11 },
          },
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
  }, [waveform]);

  return <div ref={containerRef} className="w-full" style={{ width: "100%" }} />;
}
