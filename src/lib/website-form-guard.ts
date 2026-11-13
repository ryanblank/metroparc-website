import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { getListings } from "./dam-ops";
import { LeadInputError } from "./website-form-input";

// Evaluate all counters and reserve the action in one operation across instances.
const RESERVE = `
local ttl = redis.call("TTL", KEYS[1])
if ttl >= 0 then return {1, math.max(1, ttl)} end
for i = 2, #KEYS do
  local count = redis.call("INCR", KEYS[i])
  if count == 1 then redis.call("EXPIRE", KEYS[i], 60) end
  local max = i == 2 and 8 or 40
  if count > max then return {2, math.max(1, redis.call("TTL", KEYS[i]))} end
end
redis.call("SET", KEYS[1], "1", "EX", ARGV[1])
return {0, 0}
`;

type Form = {
  email: string;
  formType: string;
  unitId?: string;
  start?: string;
};

export function websiteRequest() {
  const id = randomUUID();
  let action: string | undefined;
  return {
    id,
    setAction(value: string) { action = value; },
    log(outcome: string, status?: number) {
      console.info(JSON.stringify({
        event: "metroparc_form",
        timestamp: new Date().toISOString(),
        correlation_id: id,
        action,
        outcome,
        status,
      }));
    },
    respond(body: unknown, status: number, retryAfter?: number) {
      const headers = new Headers({ "X-Request-ID": id });
      if (retryAfter) headers.set("Retry-After", String(retryAfter));
      return Response.json(body, { status, headers });
    },
  };
}

type WebsiteRequest = ReturnType<typeof websiteRequest>;

export async function validateUnit(unitId?: string) {
  if (!unitId) return;
  const buildingId = process.env.METROPARC_BUILDING_ID!;
  const buildings = await getListings(process.env.METROPARC_ORGANIZATION_ID!, buildingId);
  if (!buildings.some((building) => building.id.toLowerCase() === buildingId.toLowerCase() &&
    building.units.some((unit) => unit.id.toLowerCase() === unitId))) {
    throw new LeadInputError("Select a valid Metro Parc unit.");
  }
}

export async function guardForm(request: Request, context: WebsiteRequest, form: Form) {
  const enforce = process.env.METROPARC_FORM_LIMIT_MODE === "enforce";
  const url = process.env.METROPARC_FORM_REDIS_URL;
  const token = process.env.METROPARC_FORM_REDIS_TOKEN;
  const secret = process.env.METROPARC_FORM_HMAC_KEY;

  try {
    if (!url || !token || !secret) throw new Error("Missing limiter configuration");
    const hash = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
    const email = form.email.toLowerCase();
    const scope = `metroparc:{${process.env.VERCEL_ENV ?? "local"}:${process.env.METROPARC_BUILDING_ID}}`;
    const action = JSON.stringify([email, form.formType, form.unitId ?? form.start ?? ""]);
    const keys = [`${scope}:action:${hash(action)}`, `${scope}:email:${hash(email)}`];
    const ip = request.headers.get("x-vercel-forwarded-for") ?? "";
    if (process.env.VERCEL === "1" && process.env.METROPARC_TRUST_VERCEL_IP === "1" && isIP(ip)) {
      keys.push(`${scope}:ip:${hash(ip)}`);
    }
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RESERVE, keys.length, ...keys, form.start ? 120 : 30]),
      signal: AbortSignal.timeout(750),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Limiter request failed");
    const { result } = await response.json();
    if (!Array.isArray(result) || ![0, 1, 2].includes(result[0]) ||
        !Number.isInteger(result[1]) || result[1] < 0) {
      throw new Error("Invalid limiter response");
    }
    const [decision, retryAfter] = result;
    if (decision === 0) return;
    context.log(decision === 1 ? "duplicate_match" : "rate_limit_match");
    if (!enforce) return;
    return context.respond({
      error: decision === 1
        ? "This action was recently submitted. Please wait before trying again."
        : "Too many submissions. Please wait a moment and try again.",
    }, decision === 1 ? 409 : 429, retryAfter);
  } catch {
    context.log("limiter_unavailable");
    if (enforce) return context.respond({ error: "Forms are temporarily unavailable. Please try again." }, 503, 5);
  }
}
