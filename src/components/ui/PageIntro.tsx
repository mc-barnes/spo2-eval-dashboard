/**
 * PageIntro — styled intro callout with left accent border.
 */
import type { ReactNode } from "react";

interface PageIntroProps {
  children: ReactNode;
}

export default function PageIntro({ children }: PageIntroProps) {
  return (
    <div
      className="bg-sage-bg border-l-3 border-teal-primary mb-6 font-body"
      style={{
        padding: "14px 20px",
        borderTopRightRadius: "12px",
        borderBottomRightRadius: "12px",
        fontSize: "0.9rem",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}
