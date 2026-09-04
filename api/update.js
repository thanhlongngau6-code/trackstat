const SECRET = process.env.API_SECRET ?? "ThlongPremium2024";

async function redis(cmd) {
    const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cmd)
    });
    return r.json();
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")   return res.status(405).json({ error: "Method Not Allowed" });

    const { key, account_key, data } = req.body ?? {};
    if (key !== SECRET)        return res.status(403).json({ error: "Unauthorized" });
    if (!account_key || !data) return res.status(400).json({ error: "Missing fields" });

    const entry = { ...data, account_key, last_updated: new Date().toISOString() };
    await redis(["HSET", "bf_accounts", account_key, JSON.stringify(entry)]);

    return res.status(200).json({ ok: true, username: data.username, level: data.level });
}
