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

    if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

    const { result } = await redis(["HGETALL", "bf_accounts"]);

    if (!result || result.length === 0) return res.status(200).json([]);

    // HGETALL trả về ["key1","val1","key2","val2",...]
    const accounts = [];
    for (let i = 1; i < result.length; i += 2) {
        try {
            const acc = typeof result[i] === "string" ? JSON.parse(result[i]) : result[i];
            if (acc) accounts.push(acc);
        } catch {}
    }

    accounts.sort((a, b) => (Number(b.level) || 0) - (Number(a.level) || 0));
    return res.status(200).json(accounts);
}
