/**
 * Dinamik sitemap.xml: sabit kamu rotaları + veritabanındaki ürün/duyuru slug'ları.
 */
const db = require("../model/db");

exports.index = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const staticRoutes = ["/", "/urunler", "/duyurular"];
    const urls = staticRoutes.map((route) => `<url><loc>${baseUrl}${route}</loc></url>`);

    const [products] = await db.execute(
      "SELECT slug FROM products WHERE is_published = 1 ORDER BY created_at DESC"
    );
    for (const row of products) {
      urls.push(`<url><loc>${baseUrl}/urunler/${row.slug}</loc></url>`);
    }

    const [announcements] = await db.execute(
      "SELECT slug FROM announcements WHERE is_published = 1 ORDER BY created_at DESC"
    );
    for (const row of announcements) {
      urls.push(`<url><loc>${baseUrl}/duyurular/${row.slug}</loc></url>`);
    }

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
