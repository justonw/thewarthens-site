// Run: node --experimental-strip-types scripts/check-contact-spam.mts
import assert from "node:assert/strict";
import { looksLikeSalesPitch as spam } from "../src/lib/contact-spam.ts";

// The real pitch that arrived.
assert.ok(spam("If customers are searching for what you offer, your business should show up first. We can make that happen within a day.\nWant to see how easy it is?", "Our system drives targeted traffic to your website within 24 hours of setup. You pick the keywords, we do the rest.\nIs this something you'd like to explore?"));
assert.ok(spam("We offer SEO services that get you on the first page of Google."));
assert.ok(spam("Check https://a.com https://b.com https://c.com"));
// Real messages must get through.
assert.ok(!spam("Hi! I watched your video on the SDR career path and had a question about whether I need a degree. Thank you!"));
assert.ok(!spam("My name is Dana and I'd love to share my testimony. I came to faith in 2019 after a hard year, and your video on tithing made me think about it again."));
assert.ok(!spam("Can you reply within a day? I have a coaching session question about my resume."));
assert.ok(!spam("Is your free resume builder able to read a PDF? Here is the posting: https://example.com/job"));
assert.ok(!spam(""));
console.log("contact spam checks passed");
