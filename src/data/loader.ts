/**
 * Simple fetch + cache utility for pipeline JSON data.
 * Each file is fetched once and cached in a module-level Map.
 */
import type {
  PipelineSummary,
  TraceMeta,
  CoverageBreakdown,
  RulesDiscovered,
  EvalScores,
  HandoffSamples,
  HL7Messages,
  WaveformData,
  TrendFeatures,
} from "./types.ts";

const cache = new Map<string, unknown>();

async function fetchJson<T>(path: string): Promise<T> {
  if (cache.has(path)) {
    return cache.get(path) as T;
  }
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as T;
  cache.set(path, data);
  return data;
}

export function loadPipelineSummary(): Promise<PipelineSummary> {
  return fetchJson<PipelineSummary>("/data/pipeline-summary.json");
}

export function loadTracesMeta(): Promise<TraceMeta[]> {
  return fetchJson<TraceMeta[]>("/data/traces-meta.json");
}

export function loadCoverageBreakdown(): Promise<CoverageBreakdown> {
  return fetchJson<CoverageBreakdown>("/data/coverage-breakdown.json");
}

export function loadRulesDiscovered(): Promise<RulesDiscovered> {
  return fetchJson<RulesDiscovered>("/data/rules-discovered.json");
}

export function loadEvalScores(): Promise<EvalScores> {
  return fetchJson<EvalScores>("/data/eval-scores.json");
}

export function loadHandoffSamples(): Promise<HandoffSamples> {
  return fetchJson<HandoffSamples>("/data/handoffs-samples.json");
}

export function loadHL7Messages(): Promise<HL7Messages> {
  return fetchJson<HL7Messages>("/data/hl7-messages.json");
}

export function loadWaveform(traceId: string): Promise<WaveformData> {
  return fetchJson<WaveformData>(`/data/waveforms/${traceId}.json`);
}

export function loadTrendFeatures(): Promise<TrendFeatures> {
  return fetchJson<TrendFeatures>("/data/trend-features.json");
}
