import { readFile, writeFile, rename } from "node:fs/promises";
import { createNanpaSnapshot, parseNanpa, checkNanpa, NANPA_SOURCE } from "../src/lib/nanpa.ts";

const destination = new URL("../src/data/nanpa.json", import.meta.url);
const response = await fetch(NANPA_SOURCE, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error("NANPA download failed");
const csv = await response.text();
const snapshot = createNanpaSnapshot(csv);
const now = new Date().toISOString().slice(0, 10);
if (snapshot.sourceDate > now) {
  throw new Error("NANPA source is future dated");
}
let previous;
try { previous = JSON.parse(await readFile(destination, "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
if (previous) {
  if (checkNanpa("3055550123", previous).reason === "invalid_snapshot") throw new Error("Invalid previous snapshot");
  const before = parseNanpa(previous.csv);
  const after = parseNanpa(csv);
  if (after.sourceDate < before.sourceDate) throw new Error("NANPA source date regressed");
  const removed = [...before.codes].filter(([code, value]) => value.inService && !after.codes.get(code)?.inService);
  if (removed.length) throw new Error("Review service removals before replacing snapshot: " + removed.map(([code]) => code).join(", "));
}
if (previous?.sha256 === snapshot.sha256) {
  console.log("NANPA source unchanged; artifact retained byte-for-byte.");
  process.exit(0);
}
const temporary = new URL("../src/data/nanpa.json.tmp", import.meta.url);
await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n");
await rename(temporary, destination);
console.log("NANPA snapshot " + snapshot.version);
