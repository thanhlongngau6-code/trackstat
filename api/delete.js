import { kv } from "@vercel/kv";

const SECRET = process.env.API_SECRET ?? "ThlongPremium2024";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

    const { key, account_key } = req.body ?? {};

    if (key !== SECRET)   return res.status(403).json({ error: "Unauthorized" });
    if (!account_key)     return res.status(400).json({ error: "Missing account_key" });

    await kv.hdel("bf_accounts", account_key);

    return res.status(200).json({ ok: true });
}
