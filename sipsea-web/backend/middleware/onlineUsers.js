/**
 * Her istekte süresi dolmuş online_tabs kayıtlarını temizler.
 */
const { purgeStaleSessions } = require("../utils/onlineSessions");

module.exports = async (req, res, next) => {
  try {
    await purgeStaleSessions();
  } catch (error) {
    console.error("Online user middleware error:", error.message);
  }

  next();
};
