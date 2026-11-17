import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { checkNanpa, createNanpaSnapshot, parseNanpa } from "../src/lib/nanpa.ts";

const snapshot = JSON.parse(readFileSync(new URL("../src/data/nanpa.json", import.meta.url)));
const now = Date.parse("2026-11-17T23:00:00Z");
// Pin historical regression data dates independently of daily source metadata.
const fixtureCsv = snapshot.csv.replace(/^File Date,[^\r\n]+/, "File Date,11/17/2026");
const fresh = createNanpaSnapshot(fixtureCsv, new Date(now).toISOString());

test("official coverage and reviewed invalid NPAs", () => {
  assert.equal(parseNanpa(snapshot.csv).codes.size, 800);
  for (const npa of ["698", "395", "723", "834", "851"]) {
    assert.equal(checkNanpa(npa + "5550123", fresh, now).reject, true, npa);
  }
  for (const number of ["3055550123", "+1 (416) 555-0123", "2425550123", "8005550123"]) {
    assert.equal(checkNanpa(number, fresh, now).reason, "in_service");
  }
});

test("old valid data still enforces; future metadata fails open", () => {
  const later = Date.parse("2027-11-17T00:00:00Z");
  assert.equal(checkNanpa("6985550123", fresh, later).reject, true);
  assert.equal(checkNanpa("6985550123", { ...fresh, retrievedAt: new Date(now + 1).toISOString() }, now).reason, "invalid_snapshot");
  const future = createNanpaSnapshot(fresh.csv.replace("File Date,11/17/2026", "File Date,11/18/2026"), new Date(now).toISOString());
  assert.equal(checkNanpa("6985550123", future, now).reason, "invalid_snapshot");
});

test("partial, corrupt and malformed snapshots fail open", () => {
  assert.equal(checkNanpa("6985550123", null, now).reason, "invalid_snapshot");
  assert.equal(checkNanpa("6985550123", { ...fresh, csv: fresh.csv + "x" }, now).reason, "invalid_snapshot");
  const partial = fresh.csv.split("\n").slice(0, -2).join("\n");
  assert.throws(() => createNanpaSnapshot(partial));
  assert.throws(() => createNanpaSnapshot(fresh.csv.replace("27-May-2028", "31-Feb-2028")));
});

test("planned date provisionally accepts 24h before midnight UTC", () => {
  const csv = fresh.csv.replace("File Date,11/17/2026", "File Date,05/25/2028");
  const planned = createNanpaSnapshot(csv, "2028-05-25T00:00:00.000Z");
  const boundary = Date.parse("2028-05-26T00:00:00Z");
  assert.equal(checkNanpa("8515550123", planned, boundary - 1).reject, true);
  assert.equal(checkNanpa("8515550123", planned, boundary).reason, "provisional_activation");
  assert.equal(checkNanpa("8515550123", planned, boundary + 1).reject, false);
});
