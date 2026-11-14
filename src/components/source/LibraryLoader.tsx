"use client";

import dynamic from "next/dynamic";

// The library only works in the browser, so its code and the verse data load after the page, in a
// separate file, instead of inside the page itself.
const VerseLibrary = dynamic(() => import("./VerseLibrary"), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-sol-muted">Loading the verse library…</p>,
});

export default function LibraryLoader() {
  return <VerseLibrary />;
}
