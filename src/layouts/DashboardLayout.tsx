import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

/** Navigation items for the sidebar. */
const NAV_ITEMS = [
  { to: "/pipeline", label: "Pipeline Overview", end: true },
  { to: "/pipeline/coverage", label: "Coverage & Accuracy" },
  { to: "/pipeline/rules", label: "Rule Discovery" },
  { to: "/pipeline/evals", label: "Eval Scores" },
  { to: "/pipeline/traces", label: "Trace Explorer" },
  { to: "/pipeline/trends", label: "Trends" },
  { to: "/pipeline/interop", label: "Interoperability" },
] as const;

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-[260px]
          bg-warm-white border-r border-border
          flex flex-col
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs uppercase tracking-wider text-muted">
            Section
          </p>
          <h2 className="font-heading text-lg font-semibold text-teal-dark leading-tight mt-1">
            Dashboard
          </h2>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : undefined}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sage-bg text-teal-dark"
                    : "text-body hover:bg-sage-bg/50 hover:text-teal-dark"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/mccaybarnes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-primary hover:text-teal-dark underline underline-offset-2"
            >
              McCay Barnes
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header bar */}
        <header className="md:hidden sticky top-14 z-20 bg-warm-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-sage-bg text-body"
            aria-label="Open sidebar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <span className="font-heading text-base font-semibold text-teal-dark">
            Dashboard
          </span>
        </header>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
