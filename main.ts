// The Dog Ate My Homework: Funniest Excuse — make.fun entry.
//
// Deterministic, no network, no dependencies. The whole entry is one
// constant: the dog's excuse. main.ts only validates it and writes it to
// entry.txt inside the output directory the grader mounts.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The final line: the dog, caught red-pawed, pleads "dog law" and shows
// zero remorse. 130 characters — safely under the 200-character gate.
const LINE =
  "Look, it had my name on it. In dog law, anything with your name on it is yours to eat — so I ate it, and I'd do it again tomorrow.";

// Gate limits from the bounty rules: entry.txt must be UTF-8 text of
// 1 to 200 characters and not only whitespace.
const MAX_CHARS = 200;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The line must be exactly one line: no newline inside, no leading or
// trailing spaces, and no control characters that could break the gate.
if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`line is ${LINE.length} characters, must be 1-${MAX_CHARS}`);
}
if (LINE.trim() !== LINE) {
  fail("line has leading or trailing whitespace");
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
if (/[\n\r]/.test(LINE)) {
  fail("line must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("line contains control characters");
}

// Output directory comes from the environment (the grader mounts it);
// default to "output" for a local run. Create it recursively, and never
// delete it or anything inside it — the grader owns that folder.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
const payload = LINE + "\n";
writeFileSync(outPath, payload, "utf8");

// Read it back and verify byte-for-byte what we wrote, so a partial or
// corrupted write fails loudly instead of shipping a broken entry.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== payload) {
  fail("entry.txt did not round-trip byte-identically");
}

console.log(`wrote ${outPath} (${LINE.length} characters)`);
