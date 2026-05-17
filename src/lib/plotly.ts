/**
 * Lazy loader for plotly.js-basic-dist-min.
 * Shared across chart components so the dynamic import resolves through
 * one module-scope cache instead of one per chart.
 */
// Narrow surface — only the methods our charts actually call. Keeps
// callsites typo-safe without taking on full plotly.js typings.
export interface PlotlyLib {
  newPlot: (
    el: HTMLElement,
    data: unknown[],
    layout?: unknown,
    config?: unknown
  ) => Promise<unknown>;
  purge: (el: HTMLElement) => void;
}

let plotlyLib: PlotlyLib | null = null;

export async function getPlotly(): Promise<PlotlyLib> {
  if (plotlyLib) return plotlyLib;
  const mod = await import("plotly.js-basic-dist-min");
  plotlyLib = (mod.default ?? mod) as PlotlyLib;
  return plotlyLib;
}
