import { kv } from "@vercel/kv";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "GET")    return res.status(405).json({ error: "Method Not Allowed" });

    const raw = (await kv.hgetall("bf_accounts")) ?? {};

    const accounts = Object.values(raw)
        .map(v => {
            try { return typeof v === "string" ? JSON.parse(v) : v; }
            catch { return null; }
        })
        .filter(Boolean)
        .sort((a, b) => (Number(b.level) || 0) - (Number(a.level) || 0));

    return res.status(200).json(accounts);
}
