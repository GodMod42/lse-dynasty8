const crypto = require("crypto");
const RURL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const KEY = "d8:requests";

async function redis(cmd) {
  if (!RURL || !RTOK) throw new Error("Base de données non configurée");
  const r = await fetch(RURL, { method: "POST", headers: { Authorization: "Bearer " + RTOK }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const secret = () => process.env.AUTH_SECRET || "";
const sign = v => crypto.createHmac("sha256", secret()).update(v).digest("base64url");
function makeToken(email) {
  const p = Buffer.from(JSON.stringify({ email, exp: Date.now() + 12 * 3600 * 1000 })).toString("base64url");
  return p + "." + sign(p);
}
function readToken(req) {
  const m = (req.headers.cookie || "").match(/(?:^|; )d8s=([^;]+)/);
  if (!m || !secret()) return null;
  const [p, sig] = m[1].split(".");
  if (!p || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(sign(p));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { const d = JSON.parse(Buffer.from(p, "base64url").toString()); return d.exp > Date.now() ? d : null; } catch { return null; }
}
function agents() {
  return (process.env.AGENTS || "").split(",").map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf(":"); return { email: x.slice(0, i).toLowerCase(), pass: x.slice(i + 1) };
  });
}
const h = s => crypto.createHash("sha256").update(s).digest();
const same = (a, b) => crypto.timingSafeEqual(h(a), h(b));
const send = (res, code, obj) => { res.setHeader("Cache-Control", "no-store"); res.status(code).json(obj); };
module.exports = { redis, KEY, makeToken, readToken, agents, same, send };
