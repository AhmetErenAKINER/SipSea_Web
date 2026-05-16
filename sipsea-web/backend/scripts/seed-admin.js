/**
 * Geliştirme ortamı seed: admin hesabi, teklif yetkili örnek e-posta, örnek içerik.
 * Çalıştırma: npm run seed:admin
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../model/db");
const { generateUniqueSlug } = require("../utils/slug");

async function run() {
  const email = "erenakiner2003@gmail.com";
  const password = "Admin123!";
  const fullName = "Eren Akıner";
  const hash = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'admin', 1) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = 'admin', is_active = 1",
    [fullName, email, hash]
  );

  await db.execute(
    "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, '-', 'user', 1) ON DUPLICATE KEY UPDATE role = 'user', is_active = 1",
    ["demo@sipsea.local", "demo@sipsea.local"]
  );

  const [adminRows] = await db.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const adminId = adminRows[0]?.id || 1;

  await db.execute(
    "INSERT IGNORE INTO categories (name, slug) VALUES ('Genel', 'genel'), ('Duyuru', 'duyuru'), ('Haber', 'haber')"
  );

  await db.execute(
    `INSERT IGNORE INTO founders (id, full_name, role_title, bio, sort_order) VALUES
      (1, 'Samet Karahan', 'Kurucu Ortak · Urun', 'Urun vizyonu ve musterı deneyimi tasarımı.', 1),
      (2, 'Eren Akıner', 'Kurucu Ortak · Muhendislik', 'Yazilim mimarisi ve teknik operasyon.', 2),
      (3, 'Arda Ateşli', 'Kurucu Ortak · Strateji', 'Is gelistirme ve stratejik planlama.', 3)`
  );

  await db.execute(
    "UPDATE founders SET full_name = 'Eren Akıner' WHERE id = 2 OR full_name IN ('Eren Akiner', 'Eren Akıner')"
  );
  await db.execute(
    "UPDATE founders SET full_name = 'Arda Ateşli' WHERE id = 3 OR full_name IN ('Arda Atesli', 'Arda Ateşli')"
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
    const [existing] = await db.execute("SELECT id FROM products WHERE title = ? LIMIT 1", [
      item.title
    ]);
    if (existing.length) continue;
    const slug = await generateUniqueSlug("products", item.title);
    await db.execute(
      "INSERT INTO products (title, slug, summary, content, tech_stack, is_published) VALUES (?, ?, ?, ?, ?, 1)",
      [item.title, slug, item.summary, item.content, item.tech]
    );
  }

  const [duyuruCat] = await db.execute("SELECT id FROM categories WHERE slug = 'duyuru' LIMIT 1");
  const [haberCat] = await db.execute("SELECT id FROM categories WHERE slug = 'haber' LIMIT 1");
  const categoryDuyuru = duyuruCat[0]?.id || null;
  const categoryHaber = haberCat[0]?.id || null;

  const demoAnnouncements = [
    {
      title: "SipSea Web Lansmani",
      summary: "Kurumsal web sitemiz yayinda.",
      content:
        "SipSea Soft olarak yeni kurumsal web sitemizi yayinladik. Urun vitrini, duyurular ve teklif modulu ile musterilerimize daha iyi hizmet verecegiz.",
      categoryId: categoryDuyuru
    },
    {
      title: "Yeni Urun: DealMate",
      summary: "Mobil teklif yonetimi artik kullanimda.",
      content:
        "DealMate urunumuzun beta surumu kullanicilarimiza acildi. Detaylar icin urunler sayfasini ziyaret edebilirsiniz.",
      categoryId: categoryHaber
    }
  ];

  for (const item of demoAnnouncements) {
    const [existing] = await db.execute("SELECT id FROM announcements WHERE title = ? LIMIT 1", [
      item.title
    ]);
    if (existing.length) continue;
    const slug = await generateUniqueSlug("announcements", item.title);
    await db.execute(
      "INSERT INTO announcements (title, slug, summary, content, category_id, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [item.title, slug, item.summary, item.content, item.categoryId, adminId]
    );
  }

  console.log("Admin, teklif yetkili e-posta, kurucu, demo urun ve duyuru verileri hazirlandi.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
