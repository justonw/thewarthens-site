import { NextRequest, NextResponse } from "next/server";
import { bumpCounter, emailKey, getKv, refund, withTimeout } from "@/lib/resume-limits";
import { recoverBuild, validBuildId } from "@/lib/resume-builds";
import { isLiveHost } from "@/lib/coaching-recipients";

// The page calls this when a build did not come back (a timeout or a dropped connection). If the build finished on
// our side, or died without finishing, it is given back, so nobody loses a build they never received. A build that
// is still running is left alone ("pending") and the page asks again in a few seconds. A build is given back at most
// once, and each address can have a few give-backs a day, so this cannot be used to get free builds.

export const dynamic = "force-dynamic";

const MAX_GIVEBACKS_PER_DAY = 3;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }
  let body: { email?: string; buildId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !validBuildId(body.buildId)) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  try {
    const live = isLiveHost(req.headers.get("x-forwarded-host") ?? host);
    const kv = await withTimeout(getKv(live), 5000, "open usage store");
    const day = new Date().toISOString().slice(0, 10);
    const status = await withTimeout(
      recoverBuild(kv, body.buildId, email, {
        allow: async () => (await bumpCounter(kv, `recover/${emailKey(email).slice(6)}/${day}`, 1, MAX_GIVEBACKS_PER_DAY)) !== null,
        giveBack: (paid) => refund(kv, email, { unlimited: false, paid }),
      }),
      20000,
      "recover the build"
    );
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("resume-recover failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
