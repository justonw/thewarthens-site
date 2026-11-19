import type { Metadata } from "next";
import UnsubscribeButton from "@/components/UnsubscribeButton";

export const metadata: Metadata = { title: "Unsubscribe | The Warthens", robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ i?: string; t?: string }> }) {
  const { i = "", t = "" } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Stop the occasional notes?</h1>
      <p className="mt-3 text-foreground-muted">We&apos;ll take you off the list. No hard feelings, and you&apos;re always welcome back.</p>
      <UnsubscribeButton i={i} t={t} />
    </div>
  );
}
