/**
 * SectionCard — bordered card wrapper for dashboard sections.
 */
import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-border rounded-card shadow-sm mb-4" style={{ padding: "24px" }}>
      {title && (
        <>
          <div className="mb-3">
            <h3
              className="font-heading text-teal-dark"
              style={{ fontSize: "1.15rem", fontWeight: 500 }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-muted mt-0.5" style={{ fontSize: "0.8rem" }}>
                {subtitle}
              </p>
            )}
          </div>
          <hr className="border-border mb-4" />
        </>
      )}
      {children}
    </div>
  );
}
