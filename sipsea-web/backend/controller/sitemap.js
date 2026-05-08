const db = require("../model/db");

exports.index = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const staticRoutes = ["/", "/urunler", "/kurucular", "/iletisim"];
    const urls = [
      ...staticRoutes.map((route) => `<url><loc>${baseUrl}${route}</loc></url>`)
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    next(error);
  }
};
