const db = require("../model/db");

/** En güncel 3 yayınlanmış ürün — navbar alt menüsü için */
module.exports = async (req, res, next) => {
  const url = req.originalUrl || "";
  if (url.startsWith("/admin") || url.startsWith("/auth")) {
    res.locals.navProducts = [];
    return next();
  }
  try {
    const [rows] = await db.execute(
      "SELECT id, title, slug FROM products WHERE is_published = 1 ORDER BY created_at DESC LIMIT 3"
    );
    res.locals.navProducts = rows;
  } catch (err) {
    res.locals.navProducts = [];
  }
  next();
};
