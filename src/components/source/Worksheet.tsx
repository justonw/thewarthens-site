"use client";

import { usePersistentState } from "@/lib/use-persistent-state";
import { worksheetPrompts } from "@/lib/source-of-life";

type Answers = Record<string, string>;
const EMPTY: Answers = {};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// "Your current state": five questions that turn accountability into a worksheet. Answers stay in
// this browser only. Print opens a clean page the reader can save as a PDF.
export default function Worksheet() {
  const [answers, setAnswers, hydrated] = usePersistentState<Answers>("source-of-life-worksheet", EMPTY);
  const filled = worksheetPrompts.filter((p) => (answers[p.id] ?? "").trim()).length;

  function printIt() {
    const w = window.open("", "_blank");
    if (!w) return;
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const body = worksheetPrompts
      .map((p) => `<h2>${esc(p.label)}</h2><p>${esc(answers[p.id] ?? "").replace(/\n/g, "<br>") || "<em>(left blank)</em>"}</p>`)
      .join("");
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Source of Life: My current state</title><style>body{font-family:Georgia,serif;max-width:680px;margin:40px auto;padding:0 24px;color:#1b1d2e;line-height:1.55}h1{font-size:26px;margin:0}h2{font-size:15px;text-transform:uppercase;letter-spacing:.08em;color:#7a5a00;margin:28px 0 6px}p{font-size:16px;margin:0;white-space:pre-wrap}.meta{color:#666;font-size:13px;margin-top:4px}.foot{margin-top:40px;font-size:12px;color:#777;border-top:1px solid #ddd;padding-top:10px}</style></head><body><h1>Source of Life: My current state</h1><p class="meta">${esc(date)}</p>${body}<p class="foot">From thewarthens.com/source-of-life. “In all thy ways acknowledge him, and he shall direct thy paths.” Proverbs 3:6 (KJV)</p><script>window.onload=function(){window.print()}<\/script></body></html>`
    );
    w.document.close();
  }

  function clear() {
    if (window.confirm("Clear everything you wrote here? This cannot be undone.")) setAnswers(EMPTY);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 sm:p-9">
      <div className="space-y-6">
        {worksheetPrompts.map((p, i) => (
          <div key={p.id}>
            <label htmlFor={`ws-${p.id}`} className="block text-base font-semibold text-white">
              <span className="mr-2 text-amber-300">{i + 1}.</span>
              {p.label}
            </label>
            <p className="mt-1 text-sm text-slate-400">{p.hint}</p>
            <textarea
              id={`ws-${p.id}`}
              rows={3}
              value={answers[p.id] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10"
              placeholder="Write here"
            />
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={printIt}
          disabled={!hydrated || filled === 0}
          className="rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-[#0a0c1d] transition-colors hover:bg-amber-200 disabled:opacity-40"
        >
          Print or save as PDF
        </button>
        <button type="button" onClick={clear} disabled={filled === 0} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-rose-300/60 disabled:opacity-40">
          Clear
        </button>
        <p className="text-xs text-slate-500">Saved on this device only. We never see what you write.</p>
      </div>
    </div>
  );
}
