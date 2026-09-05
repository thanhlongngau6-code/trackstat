export default async function handler(req, res) {
    const { id } = req.query;
    if (!id || !/^\d+$/.test(id)) return res.status(400).end();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");

    try {
        const apiRes = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=100x100&format=Png`
        );
        const json = await apiRes.json();
        const url  = json?.data?.[0]?.imageUrl;
        if (!url) return res.status(404).end();

        const imgRes = await fetch(url);
        const buf    = await imgRes.arrayBuffer();
        res.setHeader("Content-Type", "image/png");
        return res.send(Buffer.from(buf));
    } catch {
        return res.status(502).end();
    }
}
