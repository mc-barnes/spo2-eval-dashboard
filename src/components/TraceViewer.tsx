/**
 * TraceViewer — Plotly scatter chart for SpO2 waveform data.
 * Renders SpO2 line over hours with clinical threshold lines.
 */
import Plot from "react-plotly.js";
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

export default function TraceViewer({ waveform }: TraceViewerProps) {
  return (
    <Plot
      data={[
        // SpO2 line
        {
          x: waveform.hours,
          y: waveform.spo2,
          type: "scatter" as const,
          mode: "lines" as const,
          name: "SpO2",
          line: { color: TEAL_PRIMARY, width: 1.5 },
          hovertemplate: "Hour %{x:.1f}<br>SpO2 %{y:.1f}%<extra></extra>",
        },
        // 90% threshold (urgent)
        {
          x: [waveform.hours[0], waveform.hours[waveform.hours.length - 1]],
          y: [90, 90],
          type: "scatter" as const,
          mode: "lines" as const,
          name: "Urgent (90%)",
          line: { color: URGENT_RED, width: 1, dash: "dash" as const },
          hoverinfo: "skip" as const,
        },
        // 80% threshold (emergency)
        {
          x: [waveform.hours[0], waveform.hours[waveform.hours.length - 1]],
          y: [80, 80],
          type: "scatter" as const,
          mode: "lines" as const,
          name: "Emergency (80%)",
          line: { color: EMERGENCY, width: 1, dash: "dash" as const },
          hoverinfo: "skip" as const,
        },
      ]}
      layout={{
        ...PLOTLY_LAYOUT,
        title: { text: "SpO2 Overnight Waveform", font: { ...PLOTLY_LAYOUT.font, size: 14 } },
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
          orientation: "h" as const,
          y: -0.2,
          x: 0.5,
          xanchor: "center" as const,
          font: { ...PLOTLY_LAYOUT.font, size: 11 },
        },
        autosize: true,
        height: 380,
      }}
      config={{ responsive: true, displayModeBar: false }}
      className="w-full"
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}
