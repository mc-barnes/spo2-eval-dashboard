import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PipelineDataProvider } from "./hooks/usePipelineData.tsx";
import SiteLayout from "./layouts/SiteLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

const ClinicalAI = lazy(() => import("./pages/ClinicalAI.tsx"));
const RPM = lazy(() => import("./pages/RPM.tsx"));
const AgenticStrategy = lazy(() => import("./pages/AgenticStrategy.tsx"));
const PipelineOverview = lazy(() => import("./pages/PipelineOverview.tsx"));
const CoverageFunnel = lazy(() => import("./pages/CoverageFunnel.tsx"));
const RuleDiscovery = lazy(() => import("./pages/RuleDiscovery.tsx"));
const EvalScores = lazy(() => import("./pages/EvalScores.tsx"));
const TraceExplorer = lazy(() => import("./pages/TraceExplorer.tsx"));
const Trends = lazy(() => import("./pages/Trends.tsx"));
const Interoperability = lazy(() => import("./pages/Interoperability.tsx"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted font-body text-sm">Loading...</div>
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <BrowserRouter>
      <PipelineDataProvider>
        <ErrorBoundary>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<Navigate to="/clinical-ai" replace />} />
              <Route path="clinical-ai" element={<Lazy><ClinicalAI /></Lazy>} />
              <Route path="rpm" element={<Lazy><RPM /></Lazy>} />
              <Route path="strategy" element={<Lazy><AgenticStrategy /></Lazy>} />

              <Route path="pipeline" element={<DashboardLayout />}>
                <Route index element={<Lazy><PipelineOverview /></Lazy>} />
                <Route path="coverage" element={<Lazy><CoverageFunnel /></Lazy>} />
                <Route path="rules" element={<Lazy><RuleDiscovery /></Lazy>} />
                <Route path="evals" element={<Lazy><EvalScores /></Lazy>} />
                <Route path="traces" element={<Lazy><TraceExplorer /></Lazy>} />
                <Route path="trends" element={<Lazy><Trends /></Lazy>} />
                <Route path="interop" element={<Lazy><Interoperability /></Lazy>} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </PipelineDataProvider>
    </BrowserRouter>
  );
}
