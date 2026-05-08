const db = require("../model/db");

module.exports = async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const windowMinutes = Number(process.env.VISITOR_IP_WINDOW_MINUTES || 30);
    const [rows] = await db.execute("SELECT last_counted_at FROM visitor_ips WHERE ip_address = ? LIMIT 1", [ip]);

    let shouldCount = false;
    if (!rows.length) {
      shouldCount = true;
    } else {
      const last = new Date(rows[0].last_counted_at).getTime();
      const now = Date.now();
      const diffMinutes = (now - last) / (1000 * 60);
      shouldCount = diffMinutes >= windowMinutes;
    }

    if (shouldCount) {
      await db.execute(
        "INSERT INTO visitor_ips (ip_address, last_counted_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_counted_at = NOW()",
        [ip]
      );
      await db.execute(
        "INSERT INTO site_stats (stat_key, stat_value) VALUES ('total_visitors', 1) ON DUPLICATE KEY UPDATE stat_value = stat_value + 1"
      );
    }
  } catch (error) {
    console.error("Visitor middleware error:", error.message);
  }

  next();
};
