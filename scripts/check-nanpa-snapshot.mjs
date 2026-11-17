import { readFile } from "node:fs/promises";
import { checkNanpa } from "../src/lib/nanpa.ts";

const snapshot = JSON.parse(await readFile(new URL("../src/data/nanpa.json", import.meta.url), "utf8"));
const result = checkNanpa("3055550123", snapshot);
if (result.reason === "invalid_snapshot") {
  throw new Error("Committed NANPA snapshot cannot be deployed: " + result.reason);
}
console.log("Validated committed snapshot " + snapshot.version);
