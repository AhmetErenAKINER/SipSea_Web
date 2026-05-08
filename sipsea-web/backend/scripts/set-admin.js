require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../model/db");

async function run() {
  const email = "eren@sipsea.com";
  const password = "Admin123!";
  const fullName = "Eren Akiner";
  const hash = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'admin', 1) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = 'admin', is_active = 1",
    [fullName, email, hash]
  );

  console.log("Admin kullanici hazir: eren@sipsea.com");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
