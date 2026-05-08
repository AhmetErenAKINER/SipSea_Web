require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../model/db");
const { generateUniqueSlug } = require("../utils/slug");

async function run() {
  const email = "erenakiner2003@gmail.com";
  const password = "Admin123!";
  const fullName = "Eren Akiner";
  const hash = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'admin', 1) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = 'admin', is_active = 1",
    [fullName, email, hash]
  );

  await db.execute(
    "INSERT IGNORE INTO categories (name, slug) VALUES ('Genel', 'genel'), ('Duyuru', 'duyuru'), ('Haber', 'haber')"
  );

  await db.execute(
    `INSERT IGNORE INTO founders (id, full_name, role_title, bio, sort_order) VALUES
      (1, 'Samet Karahan', 'Kurucu Ortak · Urun', 'Urun vizyonu ve musterı deneyimi tasarımı.', 1),
      (2, 'Eren Akiner', 'Kurucu Ortak · Muhendislik', 'Yazilim mimarisi ve teknik operasyon.', 2),
      (3, 'Arda Atesli', 'Kurucu Ortak · Strateji', 'Is gelistirme ve stratejik planlama.', 3)`
  );

  const demoProducts = [
    {
      title: "DealMate",
      summary: "Mobil odakli akilli teklif ve anlasma yonetim platformu.",
      content:
        "DealMate, kucuk ve orta olcekli ekipler icin teklif surecini hizlandiran bir urun. Mobil uygulama ve web paneliyle teklif takibi, kullanici segmentasyonu ve raporlama saglar.",
      tech: "React Native, Node.js, MySQL"
    },
    {
      title: "SipSea Web Suite",
      summary: "Kurumsal web siteleri icin yonetilebilir tema ve icerik altyapisi.",
      content:
        "SipSea Web Suite, firmalara hizli kurumsal web kurulumu sunar. Tema ozellestirme, medya yonetimi, SEO uyumlu sayfalar ve panel tabanli icerik guncelleme ozellikleri icerir.",
      tech: "EJS, Express, MySQL"
    }
  ];

  for (const item of demoProducts) {
    const [existing] = await db.execute("SELECT id FROM products WHERE title = ? LIMIT 1", [item.title]);
    if (existing.length) continue;
    const slug = await generateUniqueSlug("products", item.title);
    await db.execute(
      "INSERT INTO products (title, slug, summary, content, tech_stack, is_published) VALUES (?, ?, ?, ?, ?, 1)",
      [item.title, slug, item.summary, item.content, item.tech]
    );
  }

  console.log("Admin, kurucu ve demo urun verileri hazirlandi.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
