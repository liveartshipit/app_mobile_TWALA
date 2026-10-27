// Simple in-memory rate limiter for the AI-powered tools.
// On Vercel each warm instance keeps its own counters, so this is best-effort
// protection for the free Groq quota, not a hard guarantee.

const PER_IP_PER_HOUR = Number(process.env.AI_LIMIT_PER_IP_HOUR || 5);
const GLOBAL_PER_DAY = Number(process.env.AI_LIMIT_GLOBAL_DAY || 300);

const ipHits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

export function checkLimit(ip: string): { ok: true } | { ok: false; reason: string } {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  if (dayCount >= GLOBAL_PER_DAY) {
    return { ok: false, reason: "The free daily AI quota for this server is used up. Try again tomorrow." };
  }
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < 3_600_000);
  if (hits.length >= PER_IP_PER_HOUR) {
    return { ok: false, reason: `Limit reached: ${PER_IP_PER_HOUR} AI requests per hour. Try again a little later.` };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  dayCount++;
  if (ipHits.size > 5000) ipHits.clear(); // keep memory bounded
  return { ok: true };
}

export function clientIp(headers?: Record<string, string | string[] | undefined>): string {
  if (!headers) return "unknown";
  const raw = headers["x-forwarded-for"] ?? headers["x-real-ip"];
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (v || "unknown").split(",")[0].trim();
}
