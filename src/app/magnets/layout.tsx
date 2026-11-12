import type { ReactNode } from "react";

// Same light faith styling as the rest of Faith Journey.
export default function MagnetsLayout({ children }: { children: ReactNode }) {
  return <div className="theme-light min-h-screen bg-background text-foreground">{children}</div>;
}
