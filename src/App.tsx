import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PipelineDataProvider } from "./hooks/usePipelineData.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

// Lazy-loaded page components
const PipelineOverview = lazy(() => import("./pages/PipelineOverview.tsx"));
const CoverageFunnel = lazy(() => import("./pages/CoverageFunnel.tsx"));
const RuleDiscovery = lazy(() => import("./pages/RuleDiscovery.tsx"));
const EvalScores = lazy(() => import("./pages/EvalScores.tsx"));
const TraceExplorer = lazy(() => import("./pages/TraceExplorer.tsx"));
const Interoperability = lazy(() => import("./pages/Interoperability.tsx"));
const AgenticStrategy = lazy(() => import("./pages/AgenticStrategy.tsx"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted font-body text-sm">Loading...</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PipelineDataProvider>
        <ErrorBoundary>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PipelineOverview />
                  </Suspense>
                }
              />
              <Route
                path="coverage"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CoverageFunnel />
                  </Suspense>
                }
              />
              <Route
                path="rules"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RuleDiscovery />
                  </Suspense>
                }
              />
              <Route
                path="evals"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <EvalScores />
                  </Suspense>
                }
              />
              <Route
                path="traces"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <TraceExplorer />
                  </Suspense>
                }
              />
              <Route
                path="interop"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Interoperability />
                  </Suspense>
                }
              />
              <Route
                path="strategy"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AgenticStrategy />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </ErrorBoundary>
      </PipelineDataProvider>
    </BrowserRouter>
  );
}
