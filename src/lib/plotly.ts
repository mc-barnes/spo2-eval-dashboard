/**
 * Lazy loader for plotly.js-basic-dist-min.
 * Shared across chart components so the dynamic import resolves through
 * one module-scope cache instead of one per chart.
 */
let plotlyLib: any = null;

export async function getPlotly() {
  if (plotlyLib) return plotlyLib;
  const mod = await import("plotly.js-basic-dist-min");
  plotlyLib = mod.default ?? mod;
  return plotlyLib;
}
