/**
 * Toplam ziyaretçi sayacı: site_stats.total_visitors değerini günceller.
 *
 * Aynı IP, VISITOR_IP_WINDOW_MINUTES süresi içinde tekrar sayılmaz (F5 / çoklu sekme şişirmesini önler).
 * Yalnızca kamu GET sayfaları sayılır; API ping, admin ve auth trafiği hariç tutulur.
 */
const db = require("../model/db");

/** Proxy ve localhost varyantlarını tek anahtar altında birleştir */
function normalizeIp(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }
  if (ip === "::1") {
    ip = "127.0.0.1";
  }
  return ip;
}

function isVisitorCountRequest(req) {
  if (req.method !== "GET") {
    return false;
  }

  const path = req.path || "";
  if (path.startsWith("/api/")) return false;
  if (path.startsWith("/admin") || path.startsWith("/auth")) {
    return false;
  }
  if (path === "/sitemap.xml") return false;

  return true;
}

module.exports = async (req, res, next) => {
  try {
    if (!isVisitorCountRequest(req)) {
      return next();
    }

    const ip = normalizeIp(req);
    const windowMinutes = Number(process.env.VISITOR_IP_WINDOW_MINUTES || 30);

    // Pencere kontrolü MySQL tarafında; JS Date / timezone kayması riskini azaltır
    const [rows] = await db.execute(
      `SELECT ip_address FROM visitor_ips
       WHERE ip_address = ? AND last_counted_at >= (NOW() - INTERVAL ? MINUTE)
       LIMIT 1`,
      [ip, windowMinutes]
    );

    if (rows.length) {
      return next();
    }

    await db.execute(
      "INSERT INTO visitor_ips (ip_address, last_counted_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_counted_at = NOW()",
      [ip]
    );
    await db.execute(
      "INSERT INTO site_stats (stat_key, stat_value) VALUES ('total_visitors', 1) ON DUPLICATE KEY UPDATE stat_value = stat_value + 1"
    );
  } catch (error) {
    console.error("Visitor middleware error:", error.message);
  }

  next();
};
