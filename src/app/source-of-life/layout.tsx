import type { ReactNode } from "react";

// A dark, quiet reading page: deep navy with gold, like the Faith Journey video overlays.
export default function SourceOfLifeLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0a0c1d] text-slate-200">{children}</div>;
}
