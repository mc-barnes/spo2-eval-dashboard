/**
 * React Context that eagerly loads pipeline-summary and traces-meta on mount.
 * Provides { summary, traces, loading, error } to all children.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PipelineSummary, TraceMeta } from "../data/types.ts";
import { loadPipelineSummary, loadTracesMeta } from "../data/loader.ts";

interface PipelineDataState {
  summary: PipelineSummary | null;
  traces: TraceMeta[];
  loading: boolean;
  error: string | null;
}

const PipelineDataContext = createContext<PipelineDataState>({
  summary: null,
  traces: [],
  loading: true,
  error: null,
});

export function PipelineDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PipelineDataState>({
    summary: null,
    traces: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [summary, traces] = await Promise.all([
          loadPipelineSummary(),
          loadTracesMeta(),
        ]);
        if (!cancelled) {
          setState({ summary, traces, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PipelineDataContext.Provider value={state}>
      {children}
    </PipelineDataContext.Provider>
  );
}

export function usePipelineData(): PipelineDataState {
  return useContext(PipelineDataContext);
}
