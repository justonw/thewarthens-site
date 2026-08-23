"use client";

import { useState } from "react";
import type { TechLink } from "@/lib/tech-links";

function LinkGrid({ links }: { links: TechLink[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-background px-5 py-4 text-sm font-medium transition-colors hover:border-blue-500/40 hover:bg-background-elevated-2"
          >
            {link.label}
            <span
              aria-hidden
              className="text-foreground-muted transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function CourseSection({
  title,
  note,
  links,
  defaultOpen = false,
}: {
  title: string;
  note?: string;
  links: TechLink[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-3xl border border-border-subtle bg-background-elevated">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-6 text-left sm:p-8"
      >
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {note && <p className="mt-1 text-sm text-foreground-muted">{note}</p>}
        </div>
        <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-foreground-muted">
          {links.length} link{links.length === 1 ? "" : "s"}
          <span
            aria-hidden
            className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}
          >
            ⌄
          </span>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <LinkGrid links={links} />
        </div>
      )}
    </div>
  );
}
