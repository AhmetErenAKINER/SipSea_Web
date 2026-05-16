/**
 * Online kullanıcı sayacı — sekme (tab) bazlı (online_tabs).
 */
const db = require("../model/db");

function getWindowMinutes() {
  return Number(process.env.ONLINE_USER_WINDOW_MINUTES || 1);
}

async function purgeStaleSessions() {
  const windowMinutes = getWindowMinutes();
  await db.execute(
    "DELETE FROM online_tabs WHERE last_seen_at < (NOW() - INTERVAL ? MINUTE)",
    [windowMinutes]
  );
}

async function removeTab(tabKey) {
  if (!tabKey) return;
  await db.execute("DELETE FROM online_tabs WHERE tab_key = ?", [tabKey]);
}

async function touchTab(tabKey, ipAddress) {
  if (!tabKey) return;
  await db.execute(
    "INSERT INTO online_tabs (tab_key, ip_address, last_seen_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE ip_address = VALUES(ip_address), last_seen_at = NOW()",
    [tabKey, ipAddress]
  );
}

async function countActiveSessions() {
  await purgeStaleSessions();
  const windowMinutes = getWindowMinutes();
  const [rows] = await db.execute(
    "SELECT COUNT(*) AS online_count FROM online_tabs WHERE last_seen_at >= (NOW() - INTERVAL ? MINUTE)",
    [windowMinutes]
  );
  return rows[0]?.online_count || 0;
}

function isVisitorPingAllowed(req) {
  const role = req.session?.user?.role;
  return role !== "admin";
}

module.exports = {
  getWindowMinutes,
  purgeStaleSessions,
  removeTab,
  touchTab,
  countActiveSessions,
  isVisitorPingAllowed
};
