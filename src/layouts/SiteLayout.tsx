import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/clinical-ai", label: "Story" },
  { to: "/scope", label: "Clinical Scope" },
  { to: "/rpm", label: "Business" },
  { to: "/pipeline", label: "Dashboard" },
  { to: "/strategy", label: "Strategy" },
] as const;

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="sticky top-0 z-30 bg-warm-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <NavLink to="/clinical-ai" className="flex items-center gap-2 shrink-0" aria-label="SpO2 Eval — home">
            <img
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              className="sm:hidden"
            />
            <span className="hidden sm:inline font-heading text-base font-semibold text-teal-dark">
              SpO2 Eval
            </span>
            <span className="hidden sm:inline text-xs text-muted">
              McCay Barnes
            </span>
          </NavLink>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
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
        </div>
      </header>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
