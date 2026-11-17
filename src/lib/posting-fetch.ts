// Server-only: fetches a job posting page from a link a visitor pasted and pulls out the readable text.
// Because the visitor chooses the address, this is built to refuse anything that points at private or
// internal networks (so it cannot be used to poke around our own servers), to follow only a few
// redirects, and to stop reading after a size limit. The check on the address happens when the
// connection is made, so a site cannot answer with a public address first and a private one later.
import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";

export const MAX_POSTING_TEXT = 10000;
const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 6000;
// The whole read, redirects included, gets this long. A slow site used to be able to take over a minute.
const TOTAL_MS = 13000;

// ---------- address safety ----------

function ipv4ToInt(ip: string) {
  return ip.split(".").reduce((n, part) => n * 256 + Number(part), 0);
}

function inRange(ip: string, cidrBase: string, bits: number) {
  const size = 2 ** (32 - bits);
  const base = ipv4ToInt(cidrBase);
  const n = ipv4ToInt(ip);
  return n >= base && n < base + size;
}

export function isBlockedAddress(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return (
      inRange(ip, "0.0.0.0", 8) ||
      inRange(ip, "10.0.0.0", 8) ||
      inRange(ip, "100.64.0.0", 10) ||
      inRange(ip, "127.0.0.0", 8) ||
      inRange(ip, "169.254.0.0", 16) ||
      inRange(ip, "172.16.0.0", 12) ||
      inRange(ip, "192.0.0.0", 24) ||
      inRange(ip, "192.168.0.0", 16) ||
      inRange(ip, "198.18.0.0", 15) ||
      inRange(ip, "224.0.0.0", 3) // multicast and reserved
    );
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    // IPv4 mapped or embedded: ::ffff:a.b.c.d
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedAddress(mapped[1]);
    if (/^::ffff:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/.test(lower)) return true;
    if (lower.startsWith("64:ff9b:")) return true; // NAT64
    const first = parseInt(lower.split(":")[0] || "0", 16);
    if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
    if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link local
    if ((first & 0xff00) === 0xff00) return true; // multicast
    if (lower.startsWith("2001:db8")) return true; // documentation
    return false;
  }
  return true;
}

type LookupCallback = (err: NodeJS.ErrnoException | null, address?: string | dns.LookupAddress[], family?: number) => void;

// Used by the connection itself: resolves the name, and refuses if ANY answer is a blocked address.
export function safeLookup(hostname: string, options: dns.LookupOptions | LookupCallback, callback?: LookupCallback) {
  const cb = (typeof options === "function" ? options : callback) as LookupCallback;
  const opts = typeof options === "function" ? {} : options;
  dns.lookup(hostname, { all: true, family: opts.family, hints: opts.hints }, (err, addresses) => {
    if (err) return cb(err);
    if (!addresses.length || addresses.some((a) => isBlockedAddress(a.address))) {
      const blocked = new Error("blocked address") as NodeJS.ErrnoException;
      blocked.code = "EBLOCKED";
      return cb(blocked);
    }
    if (opts.all) return cb(null, addresses);
    return cb(null, addresses[0].address, addresses[0].family);
  });
}

export function parsePublicUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host || net.isIP(host)) return null; // no raw IP addresses
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (!host.includes(".")) return null;
  return url;
}

// ---------- fetching ----------

type Page = { finalUrl: string; status: number; contentType: string; body: string };

function requestOnce(url: URL): Promise<{ status: number; location?: string; contentType: string; body: string }> {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: safeLookup as unknown as net.LookupFunction,
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; WarthensResumeTool/1.0; +https://thewarthens.com)",
          accept: "text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.5",
          "accept-language": "en-US,en;q=0.9",
          "accept-encoding": "identity",
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = typeof res.headers.location === "string" ? res.headers.location : undefined;
        const contentType = String(res.headers["content-type"] ?? "");
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, location, contentType, body: "" });
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_BYTES) {
            chunks.push(chunk.subarray(0, Math.max(0, chunk.length - (size - MAX_BYTES))));
            res.destroy();
            return;
          }
          chunks.push(chunk);
        });
        const done = () => resolve({ status, location, contentType, body: Buffer.concat(chunks).toString("utf8") });
        res.on("end", done);
        res.on("close", done);
        res.on("error", reject);
      }
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

export async function fetchPage(start: URL): Promise<Page> {
  let url = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await requestOnce(url);
    if (res.status >= 300 && res.status < 400 && res.location) {
      const next = parsePublicUrl(new URL(res.location, url).toString());
      if (!next) throw new Error("blocked redirect");
      url = next;
      continue;
    }
    return { finalUrl: url.toString(), status: res.status, contentType: res.contentType, body: res.body };
  }
  throw new Error("too many redirects");
}

// ---------- reading the page ----------

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "-", mdash: "-", hellip: "...", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', bull: "-" };

export function decodeEntities(s: string) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

function safeChar(code: number) {
  return code > 0 && code < 0x110000 && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : "";
}

export function htmlToText(html: string) {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/ul|\/ol)\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findJobPostings(node: unknown, out: Record<string, unknown>[]) {
  if (Array.isArray(node)) return node.forEach((n) => findJobPostings(n, out));
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const type = obj["@type"];
  if (type === "JobPosting" || (Array.isArray(type) && type.includes("JobPosting"))) out.push(obj);
  if (obj["@graph"]) findJobPostings(obj["@graph"], out);
}

function field(v: unknown): string {
  if (typeof v === "string") return decodeEntities(v).trim();
  if (v && typeof v === "object" && "name" in v) return field((v as { name: unknown }).name);
  return "";
}

export type PostingResult = { title: string; text: string; via: "structured" | "page" };

export function extractPosting(html: string): PostingResult | null {
  // 1. Most job sites publish the posting as structured data (for Google Jobs). Prefer that.
  const found: Record<string, unknown>[] = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      findJobPostings(JSON.parse(m[1].trim()), found);
    } catch {
      // ignore malformed blocks
    }
  }
  const job = found.find((j) => typeof j.description === "string" && (j.description as string).length > 200);
  if (job) {
    const title = field(job.title);
    const company = field(job.hiringOrganization);
    const loc = field(Array.isArray(job.jobLocation) ? job.jobLocation[0] : job.jobLocation);
    const desc = htmlToText(String(job.description));
    const head = [title, company && `Company: ${company}`, loc && `Location: ${loc}`].filter(Boolean).join("\n");
    const text = `${head}\n\n${desc}`.trim().slice(0, MAX_POSTING_TEXT);
    if (text.length >= 200) return { title, text, via: "structured" };
  }

  // 2. Otherwise read the visible text of the page.
  const title = htmlToText((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "").slice(0, 160);
  const main = html.match(/<(main|article)[\s\S]*?<\/\1>/i)?.[0];
  const stripped = (main ?? html)
    .replace(/<(nav|header|footer|form|aside)[\s\S]*?<\/\1>/gi, " ");
  const text = htmlToText(stripped).slice(0, MAX_POSTING_TEXT);
  if (text.length < 300) return null;
  return { title, text: title ? `${title}\n\n${text}` : text, via: "page" };
}

export type FetchOutcome =
  | { ok: true; title: string; text: string; via: PostingResult["via"] }
  | { ok: false; error: "bad-url" | "unreachable" | "blocked-site" | "thin" };

export async function fetchPosting(raw: string): Promise<FetchOutcome> {
  const url = parsePublicUrl(raw);
  if (!url) return { ok: false, error: "bad-url" };
  let page: Page;
  try {
    page = await Promise.race([
      fetchPage(url),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("took too long")), TOTAL_MS)),
    ]);
  } catch {
    return { ok: false, error: "unreachable" };
  }
  if (page.status === 401 || page.status === 403 || page.status === 429 || page.status === 999) return { ok: false, error: "blocked-site" };
  if (page.status < 200 || page.status >= 300) return { ok: false, error: "unreachable" };
  if (!/html|xml|text/i.test(page.contentType) && !page.body.trimStart().startsWith("<")) return { ok: false, error: "thin" };
  const result = extractPosting(page.body);
  if (!result) return { ok: false, error: "thin" };
  return { ok: true, ...result };
}
