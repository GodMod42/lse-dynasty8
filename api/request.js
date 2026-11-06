const { redis, KEY, send } = require("./_lib");
const clip = (v, n) => String(v == null ? "" : v).trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Méthode non autorisée" });
  const b = req.body || {};
  const r = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    property: clip(b.property, 80), price: Number(b.price) || 0,
    name: clip(b.name, 80), tel: clip(b.tel, 30), note: clip(b.note, 500),
    status: "new", date: new Date().toISOString()
  };
  if (!r.property || !r.name || !r.tel) return send(res, 400, { error: "Champs manquants" });
  try { await redis(["HSET", KEY, r.id, JSON.stringify(r)]); }
  catch (e) { return send(res, 500, { error: "Enregistrement impossible" }); }
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ embeds: [{
        title: "Nouvelle demande d’acquisition", color: 7062185, timestamp: r.date,
        fields: [
          { name: "Propriété", value: `${r.property} ($${r.price.toLocaleString("fr-FR")})` },
          { name: "Identité", value: r.name, inline: true }, { name: "Téléphone", value: r.tel, inline: true },
          { name: "Notes", value: r.note || "Aucune" }
        ] }] }) });
    } catch (e) {}
  }
  send(res, 200, { ok: true });
};
