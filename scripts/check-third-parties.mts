// Fails when the code starts using an outside service that is not on the approved list in docs/legal/third-parties.json.
// This is how a new third party cannot quietly slip in as the site grows: run it before every push.
//
//   node --experimental-strip-types scripts/check-third-parties.mts
//
// It looks at three things:
//   1. Web addresses the code SENDS REQUESTS TO or LOADS from (fetch, src=, action=). Plain links to other sites are not counted,
//      because a link does not send anything until a visitor clicks it.
//   2. Secret-looking environment variable names (KEY, SECRET, TOKEN), which show that a service is being used.
//   3. The packages in package.json "dependencies", so a new service library is noticed.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const approved = JSON.parse(readFileSync(join(root, "docs/legal/third-parties.json"), "utf8")) as {
  hosts: Record<string, unknown>;
  secrets: Record<string, unknown>;
  packages: Record<string, unknown>;
};

function walk(dir: string, out: string[] = []): string[] {
  // A folder that does not exist (for example netlify/ before the scheduled functions are added) has nothing to check.
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mts|js|mjs|css)$/.test(name)) out.push(p);
  }
  return out;
}

const files = [...walk(join(root, "src")), ...walk(join(root, "netlify"))];
const problems: string[] = [];
const hostsSeen = new Map<string, string>();
const secretsSeen = new Map<string, string>();

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const rel = file.slice(root.length);
  for (const m of text.matchAll(/(?:fetch\(\s*|src\s*=\s*|src:\s*|action\s*=\s*|@import\s+url\()[`"'{ ]*(https?:\/\/[a-zA-Z0-9.-]+)/g)) {
    const host = m[1].replace(/^https?:\/\//, "");
    // Our own site is not a third party.
    if (host === "thewarthens.com" || host === "www.thewarthens.com" || host === "localhost") continue;
    if (!hostsSeen.has(host)) hostsSeen.set(host, rel);
  }
  for (const m of text.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
    if (/KEY|SECRET|TOKEN/.test(m[1]) && !secretsSeen.has(m[1])) secretsSeen.set(m[1], rel);
  }
}

for (const [host, where] of hostsSeen) {
  if (!(host in approved.hosts)) problems.push(`NEW outside address: ${host} (first seen in ${where}). Is it receiving visitor data?`);
}
for (const [name, where] of secretsSeen) {
  if (!(name in approved.secrets)) problems.push(`NEW secret/key name: ${name} (first seen in ${where}). Which service is it for?`);
}
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { dependencies?: Record<string, string> };
for (const name of Object.keys(pkg.dependencies ?? {})) {
  if (!(name in approved.packages)) problems.push(`NEW package: ${name}. Does it send visitor data anywhere?`);
}
// An entry on the approved list that the code no longer uses is also worth a look (the list should match reality).
const stale: string[] = [];
for (const host of Object.keys(approved.hosts)) if (!hostsSeen.has(host)) stale.push(`host ${host}`);
for (const name of Object.keys(approved.secrets)) if (!secretsSeen.has(name)) stale.push(`secret ${name}`);

console.log(`Looked at ${files.length} files. Outside addresses: ${[...hostsSeen.keys()].join(", ") || "none"}.`);
if (stale.length) console.log(`Note: on the approved list but not found in the code: ${stale.join("; ")}. Remove them from third-parties.json if they are really gone.`);
if (problems.length) {
  console.error("\nNOT APPROVED YET:\n- " + problems.join("\n- "));
  console.error("\nBefore pushing: add it to docs/legal/third-parties.json and docs/legal/data-map.md, and check the privacy policy still describes its kind of provider.");
  process.exit(1);
}
console.log("Third-party check passed: everything the code talks to is on the approved list.");
