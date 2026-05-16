/**
 * MySQL bağlantı havuzu (mysql2/promise).
 * Boş DB_PASSWORD ortamında password alanı config'e eklenmez (yerel root için).
 */
const mysql = require("mysql2");
require("dotenv").config();

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "sipsea_web",
  waitForConnections: true,
  connectionLimit: 10
};

if (process.env.DB_PASSWORD && String(process.env.DB_PASSWORD).trim().length > 0) {
  poolConfig.password = process.env.DB_PASSWORD.trim();
}

const pool = mysql.createPool(poolConfig);

module.exports = pool.promise();
