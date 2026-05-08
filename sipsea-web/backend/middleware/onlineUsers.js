const db = require("../model/db");

module.exports = async (req, res, next) => {
  try {
    if (!req.sessionID) return next();

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    await db.execute(
      "INSERT INTO online_sessions (session_id, ip_address, last_seen_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE ip_address = VALUES(ip_address), last_seen_at = NOW()",
      [req.sessionID, ip]
    );

    const windowMinutes = Number(process.env.ONLINE_USER_WINDOW_MINUTES || 5);
    await db.execute(
      "DELETE FROM online_sessions WHERE last_seen_at < (NOW() - INTERVAL ? MINUTE)",
      [windowMinutes]
    );
  } catch (error) {
    console.error("Online user middleware error:", error.message);
  }

  next();
};
