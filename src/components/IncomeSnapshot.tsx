"use client";

import { useState } from "react";
import { careerPaths, type PathId } from "@/lib/quiz";

const orderedPaths: PathId[] = [
  "healthcare",
  "bizops",
  "supplychain",
  "sales",
  "swe",
  "trades",
  "uxui",
  "itsec",
  "data",
];

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function IncomeSnapshot() {
  const [income, setIncome] = useState("");
  const parsed = Number(income.replace(/[^0-9.]/g, ""));
  const hasInput = income.trim().length > 0 && !Number.isNaN(parsed) && parsed > 0;

  return (
    <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        Income Snapshot
      </p>
      <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
        See real 2026 entry-level pay, side by side with yours
      </h3>
      <p className="mt-3 text-sm text-foreground-muted">
        This isn&apos;t a promise of what you&apos;ll earn, it&apos;s the
        actual entry-level range people are seeing right now in each
        field, sourced and dated. Enter your current income to see how
        it compares.
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium">Your current annual income (optional)</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 40000"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
        />
      </label>

      <div className="mt-6 space-y-2">
        {orderedPaths.map((id) => {
          const path = careerPaths[id];
          const diff = hasInput ? path.payLow - parsed : null;
          return (
            <div
              key={id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border-subtle bg-background px-5 py-3.5"
            >
              <div>
                <p className="font-medium">{path.title}</p>
                <p className="text-xs text-foreground-muted">
                  {formatMoney(path.payLow)} – {formatMoney(path.payHigh)} entry-level
                  {!path.affiliate && " · no affiliate, neutral source"}
                </p>
              </div>
              {diff !== null && (
                <p
                  className={`text-sm font-semibold ${
                    diff >= 0 ? "text-emerald-600" : "text-foreground-muted"
                  }`}
                >
                  {diff >= 0 ? "+" : ""}
                  {formatMoney(diff)}/yr at entry
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-foreground-muted">
        Ranges reflect entry-level pay reported across 2026 sources
        (BLS, industry salary reports, our training partners) and vary
        by location, employer, and how fast you move through training.
        Nothing here is guaranteed, take it as a starting point for your
        own research, not a prediction.
      </p>
    </div>
  );
}
