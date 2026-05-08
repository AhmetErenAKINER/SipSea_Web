const mysql = require("mysql2");
require("dotenv").config();

// DB_PASSWORD bos veya yoksa sifre gonderilmez (XAMPP varsayilan root ile uyumlu).
// Eskiden || "123456" kullanimi bos .env'de bile yanlis sifre yolluyordu.
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
