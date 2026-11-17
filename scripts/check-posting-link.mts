// Run: node --experimental-strip-types scripts/check-posting-link.mts
import assert from "node:assert/strict";
import { findPostingLink as f } from "../src/lib/posting-link.ts";

assert.equal(f("https://www.linkedin.com/jobs/view/123456/"), "https://www.linkedin.com/jobs/view/123456/");
assert.equal(f("  https://www.linkedin.com/jobs/view/123456/?trk=abc\n"), "https://www.linkedin.com/jobs/view/123456/?trk=abc");
// Phone share text: a title and a link.
assert.equal(f("Sales Development Representative at Acme\nhttps://www.linkedin.com/comm/jobs/view/123456"), "https://www.linkedin.com/comm/jobs/view/123456");
assert.equal(f("Check out this job at Acme: https://lnkd.in/abc123."), "https://lnkd.in/abc123");
assert.equal(f("linkedin.com/jobs/view/123456"), "https://linkedin.com/jobs/view/123456");
assert.equal(f("www.indeed.com/viewjob?jk=abc"), "https://www.indeed.com/viewjob?jk=abc");
// Not links, or a real posting that merely mentions one.
assert.equal(f(""), null);
assert.equal(f("hello"), null);
assert.equal(f("We are hiring. " + "Responsibilities include many things. ".repeat(10) + "Apply at https://acme.com/jobs/1"), null);
assert.equal(f("https://a.com/x and https://b.com/y"), null);
assert.equal(f("Email me at jordan@email.com"), null);
console.log("posting link checks passed");
