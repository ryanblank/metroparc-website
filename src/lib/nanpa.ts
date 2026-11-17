import { createHash } from "node:crypto";

export const NANPA_SOURCE = "https://reports.nanpa.com/public/npa_report.csv";
const DAY = 86_400_000;

export type NanpaSnapshot = {
  source: string;
  sourceDate: string;
  retrievedAt: string;
  sha256: string;
  version: string;
  csv: string;
};

function csvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') {
      if (quoted && csv[i + 1] === '"') { field += '"'; i++; }
      else if (quoted || field === "") quoted = !quoted;
      else throw new Error("Invalid CSV quote");
    } else if (!quoted && (c === "," || c === "\n")) {
      row.push(field.replace(/\r$/, ""));
      field = "";
      if (c === "\n") { rows.push(row); row = []; }
    } else field += c;
  }
  if (quoted) throw new Error("Unterminated CSV field");
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

function isoDate(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  const iso = date.toISOString().slice(0, 10);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error("Invalid date");
  }
  return iso;
}

function serviceDate(value: string): string | undefined {
  if (!value) return;
  const match = /^(\d{2})-([A-Z][a-z]{2})-(\d{4})$/.exec(value);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!match || !months.includes(match[2])) throw new Error("Invalid service date");
  return isoDate(Number(match[3]), months.indexOf(match[2]) + 1, Number(match[1]));
}

export function parseNanpa(csv: string) {
  const rows = csvRows(csv);
  const [label, date] = rows.shift() ?? [];
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date ?? "");
  if (label !== "File Date" || !match) throw new Error("Missing source date");
  const sourceDate = isoDate(Number(match[3]), Number(match[1]), Number(match[2]));
  const header = rows.shift() ?? [];
  const required = ["NPA_ID", "IN_SERVICE", "IN_SERVICE_DT"];
  if (new Set(header).size !== header.length || required.some(k => !header.includes(k))) throw new Error("Invalid schema");
  const codes = new Map<string, { inService: boolean; activation?: string }>();
  for (const row of rows) {
    if (row.length !== header.length) throw new Error("Invalid row");
    const code = row[header.indexOf("NPA_ID")];
    const status = row[header.indexOf("IN_SERVICE")];
    if (!/^[2-9]\d{2}$/.test(code) || codes.has(code) || !["Y", "N"].includes(status)) throw new Error("Invalid NPA");
    codes.set(code, { inService: status === "Y", activation: serviceDate(row[header.indexOf("IN_SERVICE_DT")]) });
  }
  if (codes.size !== 800) throw new Error("Incomplete NPA coverage");
  return { sourceDate, codes };
}

export function createNanpaSnapshot(csv: string, retrievedAt = new Date().toISOString()): NanpaSnapshot {
  const { sourceDate } = parseNanpa(csv);
  const sha256 = createHash("sha256").update(csv).digest("hex");
  return { source: NANPA_SOURCE, sourceDate, retrievedAt, sha256, version: sourceDate + ":" + sha256, csv };
}

export function checkNanpa(phone: string, snapshot: unknown, now = Date.now()) {
  try {
    const data = snapshot as NanpaSnapshot;
    if (!data || data.source !== NANPA_SOURCE || typeof data.csv !== "string" ||
        createHash("sha256").update(data.csv).digest("hex") !== data.sha256 ||
        data.version !== data.sourceDate + ":" + data.sha256) throw new Error("Invalid snapshot");
    const parsed = parseNanpa(data.csv);
    if (parsed.sourceDate !== data.sourceDate) throw new Error("Source mismatch");
    const sourceTime = Date.parse(data.sourceDate + "T00:00:00Z");
    const today = Math.floor(now / DAY) * DAY;
    if (sourceTime > today) throw new Error("Future source date");
    if (typeof data.retrievedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.retrievedAt)) throw new Error("Invalid retrieval timestamp");
    const retrieved = Date.parse(data.retrievedAt);
    if (!Number.isFinite(retrieved) || retrieved > now) {
      return { reject: false, reason: "invalid_snapshot" };
    }
    const digits = phone.replace(/\D/g, "");
    const code = parsed.codes.get(digits.slice(-10, -7));
    if (!code) return { reject: false, reason: "invalid_snapshot" };
    if (code.inService) return { reject: false, reason: "in_service" };
    if (code.activation && now >= Date.parse(code.activation + "T00:00:00Z") - DAY) {
      return { reject: false, reason: "provisional_activation" };
    }
    return { reject: true, reason: "out_of_service" };
  } catch {
    return { reject: false, reason: "invalid_snapshot" };
  }
}
