const { redis, KEY, makeToken, readToken, agents, same, send } = require("./_lib");
const COOKIE = "HttpOnly; Secure; SameSite=Strict; Path=/";

module.exports = async (req, res) => {
  const b = req.body || {}, act = b.action || (req.query && req.query.action);

  if (req.method === "POST" && act === "login") {
    const email = String(b.email || "").trim().toLowerCase(), pass = String(b.password || "");
    if (!agents().some(a => a.email === email && same(a.pass, pass))) {
      await new Promise(r => setTimeout(r, 700));
      return send(res, 401, { error: "Identifiants incorrects" });
    }
    res.setHeader("Set-Cookie", `d8s=${makeToken(email)}; ${COOKIE}; Max-Age=43200`);
    return send(res, 200, { ok: true });
  }
  if (act === "logout") {
    res.setHeader("Set-Cookie", `d8s=; ${COOKIE}; Max-Age=0`);
    return send(res, 200, { ok: true });
  }

  const me = readToken(req);
  if (!me) return send(res, 401, { error: "Non connecté" });
  try {
    if (req.method === "GET") {
      const flat = (await redis(["HGETALL", KEY])) || [], list = [];
      for (let i = 1; i < flat.length; i += 2) { try { list.push(JSON.parse(flat[i])); } catch (e) {} }
      list.sort((x, y) => y.date.localeCompare(x.date));
      return send(res, 200, { email: me.email, requests: list });
    }
    if (req.method === "POST" && act === "status") {
      const raw = await redis(["HGET", KEY, String(b.id)]);
      if (!raw) return send(res, 404, { error: "Introuvable" });
      const r = JSON.parse(raw);
      r.status = b.status === "done" ? "done" : "new"; r.by = me.email;
      await redis(["HSET", KEY, r.id, JSON.stringify(r)]);
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && act === "delete") {
      await redis(["HDEL", KEY, String(b.id)]);
      return send(res, 200, { ok: true });
    }
  } catch (e) { return send(res, 500, { error: "Erreur serveur" }); }
  send(res, 400, { error: "Action inconnue" });
};
