/**
 * Yönetim paneli CRUD ve site ayarları.
 * Slug üretimi utils/slug üzerinden; dashboard istatistikleri site_stats + online_tabs'tan okunur.
 */
const db = require("../model/db");
const { generateUniqueSlug } = require("../utils/slug");
const { countActiveSessions } = require("../utils/onlineSessions");

/** Veritabanında anahtar yoksa form varsayılanlarına düşmek için */
const defaultSettings = {
  contact_email: "example@email.com",
  contact_phone: "+90 555 000 00 00",
  contact_address: "Istanbul, Turkiye",
  about_text: "SipSea Soft, co-founder ekibiyle dijital urunler gelistirir.",
  hero_badge_text: "Kuruluş 2026",
  hero_title_text: "Yeni Nesil Yazılım Mükemmelliği.",
  hero_description_text:
    "Zekâ ile ölçeklenebilirliği dengeleyen dijital temeller tasarlıyoruz. Amacımız, karmaşık problemleri uzun ömürlü kod ile görünmez ve akıcı deneyimlere dönüştürmek.",
  products_section_title: "Ürün Vitrini",
  products_section_description: "Modern verimliliğin yazılım mimarisi.",
  founders_section_title: "Vizyonumuz.",
  quote_section_title: "Projeni Başlat.",
  quote_section_description: "Hedefini anlat, mimariyi ve altyapıyı biz tasarlayalım.",
  footer_copyright_text: "© 2026 SipSea Soft. Tüm hakları saklıdır."
};

// --- Dashboard ---

exports.dashboard = async (req, res, next) => {
  try {
    const [statsRows] = await db.execute(
      "SELECT stat_value FROM site_stats WHERE stat_key='total_visitors' LIMIT 1"
    );
    const onlineCount = await countActiveSessions();
    const [productRows] = await db.execute(
      "SELECT COUNT(*) AS total_products FROM products"
    );
    const [galRows] = await db.execute(
      "SELECT COUNT(*) AS total_images FROM gallery_images"
    );
    const [quoteRows] = await db.execute(
      "SELECT COUNT(*) AS total_quotes FROM quote_requests WHERE status='new'"
    );
    const [annRows] = await db.execute(
      "SELECT COUNT(*) AS total_announcements FROM announcements"
    );

    res.render("admin/dashboard", {
      title: "Admin Panel",
      stats: {
        totalVisitors: statsRows[0]?.stat_value || 0,
        onlineUsers: onlineCount,
        totalProducts: productRows[0]?.total_products || 0,
        totalAnnouncements: annRows[0]?.total_announcements || 0,
        totalImages: galRows[0]?.total_images || 0,
        totalQuotes: quoteRows[0]?.total_quotes || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Ürünler ---

exports.listProducts = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, title, slug, summary, tech_stack, is_published, created_at FROM products ORDER BY created_at DESC"
    );
    res.render("admin/products-list", { title: "Urun Yonetimi", rows });
  } catch (error) {
    next(error);
  }
};

exports.getAddProduct = async (req, res, next) => {
  try {
    res.render("admin/product-add", { title: "Yeni Urun" });
  } catch (error) {
    next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(404).render("error", { title: "Bulunamadi", error: "Gecersiz urun." });
    }
    const [rows] = await db.execute(
      "SELECT id, title, slug, summary, content, tech_stack, cover_image_path, is_published FROM products WHERE id = ? LIMIT 1",
      [id]
    );
    if (!rows.length) {
      return res.status(404).render("error", { title: "Bulunamadi", error: "Urun bulunamadi." });
    }
    res.render("admin/product-edit", { title: "Urun Duzenle", product: rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const slug = await generateUniqueSlug("products", req.body.title);
    await db.execute(
      "INSERT INTO products (title, slug, summary, content, tech_stack, cover_image_path, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.title,
        slug,
        req.body.summary || null,
        req.body.content,
        req.body.tech_stack || null,
        req.body.cover_image_path || null,
        req.body.is_published ? 1 : 0
      ]
    );
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
};

exports.postUpdateProduct = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.body.product_id, 10);
    if (!Number.isFinite(productId) || productId < 1) {
      return res.status(400).render("error", { title: "Hata", error: "Gecersiz urun." });
    }
    const [existing] = await db.execute("SELECT id FROM products WHERE id = ? LIMIT 1", [
      productId
    ]);
    if (!existing.length) {
      return res.status(404).render("error", { title: "Bulunamadi", error: "Urun bulunamadi." });
    }
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    if (!title || !content) {
      return res
        .status(400)
        .render("error", { title: "Hata", error: "Baslik ve detayli icerik zorunludur." });
    }
    const slug = await generateUniqueSlug("products", title, productId);
    await db.execute(
      "UPDATE products SET title = ?, slug = ?, summary = ?, content = ?, tech_stack = ?, cover_image_path = ?, is_published = ? WHERE id = ?",
      [
        title,
        slug,
        (req.body.summary || "").trim() || null,
        content,
        (req.body.tech_stack || "").trim() || null,
        (req.body.cover_image_path || "").trim() || null,
        req.body.is_published ? 1 : 0,
        productId
      ]
    );
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await db.execute("DELETE FROM products WHERE id = ?", [req.body.product_id]);
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
};

// --- Teklif talepleri ---

exports.listQuoteRequests = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, full_name, email, project_type, budget_range, status, created_at FROM quote_requests ORDER BY created_at DESC"
    );
    res.render("admin/quote-requests", { title: "Teklif Talepleri", rows });
  } catch (error) {
    next(error);
  }
};

// --- Site metinleri (site_settings) ---

exports.getSettings = async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT setting_key, setting_value FROM site_settings");
    const dbSettings = rows.reduce((acc, r) => ({ ...acc, [r.setting_key]: r.setting_value }), {});
    const settings = { ...defaultSettings, ...dbSettings };
    res.render("admin/settings", { title: "Site Metinleri", settings });
  } catch (error) {
    next(error);
  }
};

exports.postSettings = async (req, res, next) => {
  try {
    const entries = {
      contact_email: req.body.contact_email || defaultSettings.contact_email,
      contact_phone: req.body.contact_phone || defaultSettings.contact_phone,
      contact_address: req.body.contact_address || defaultSettings.contact_address,
      about_text: req.body.about_text || defaultSettings.about_text,
      hero_badge_text: req.body.hero_badge_text || defaultSettings.hero_badge_text,
      hero_title_text: req.body.hero_title_text || defaultSettings.hero_title_text,
      hero_description_text:
        req.body.hero_description_text || defaultSettings.hero_description_text,
      products_section_title:
        req.body.products_section_title || defaultSettings.products_section_title,
      products_section_description:
        req.body.products_section_description ||
        defaultSettings.products_section_description,
      founders_section_title:
        req.body.founders_section_title || defaultSettings.founders_section_title,
      quote_section_title: req.body.quote_section_title || defaultSettings.quote_section_title,
      quote_section_description:
        req.body.quote_section_description || defaultSettings.quote_section_description,
      footer_copyright_text:
        req.body.footer_copyright_text || defaultSettings.footer_copyright_text
    };

    for (const [key, value] of Object.entries(entries)) {
      await db.execute(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [key, value]
      );
    }
    res.redirect("/admin/settings");
  } catch (error) {
    next(error);
  }
};

// --- Galeri: yükleme + kurucu/ürün kapak ataması ---

exports.getGallery = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, title, file_path, file_size, created_at FROM gallery_images ORDER BY created_at DESC"
    );
    const [founders] = await db.execute(
      "SELECT id, full_name, photo_path FROM founders ORDER BY sort_order ASC, id ASC"
    );
    const [products] = await db.execute(
      "SELECT id, title, cover_image_path FROM products ORDER BY created_at DESC"
    );
    res.render("admin/gallery", { title: "Galeri", rows, founders, products });
  } catch (error) {
    next(error);
  }
};

exports.postGallery = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).render("error", { title: "Dosya Hatasi", error: "Lutfen bir gorsel secin." });
    }

    await db.execute(
      "INSERT INTO gallery_images (title, file_path, file_name, mime_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.title || "Galeri Gorseli",
        `/uploads/gallery/${req.file.filename}`,
        req.file.filename,
        req.file.mimetype,
        req.file.size,
        req.session.user.id
      ]
    );

    res.redirect("/admin/gallery");
  } catch (error) {
    next(error);
  }
};

exports.postFounderImage = async (req, res, next) => {
  try {
    await db.execute("UPDATE founders SET photo_path = ? WHERE id = ?", [
      req.body.photo_path || null,
      req.body.founder_id
    ]);
    res.redirect("/admin/gallery");
  } catch (error) {
    next(error);
  }
};

exports.postProductImage = async (req, res, next) => {
  try {
    await db.execute("UPDATE products SET cover_image_path = ? WHERE id = ?", [
      req.body.cover_image_path || null,
      req.body.product_id
    ]);
    res.redirect("/admin/gallery");
  } catch (error) {
    next(error);
  }
};

exports.removeImageUsage = async (req, res, next) => {
  try {
    // Görseli silmeden önce founders/products referanslarını kopar
    const imagePath = req.body.file_path;
    await db.execute("UPDATE founders SET photo_path = NULL WHERE photo_path = ?", [imagePath]);
    await db.execute("UPDATE products SET cover_image_path = NULL WHERE cover_image_path = ?", [
      imagePath
    ]);
    res.redirect("/admin/gallery");
  } catch (error) {
    next(error);
  }
};

exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const imageId = req.body.image_id;
    const imagePath = req.body.file_path;
    await db.execute("UPDATE founders SET photo_path = NULL WHERE photo_path = ?", [imagePath]);
    await db.execute("UPDATE products SET cover_image_path = NULL WHERE cover_image_path = ?", [
      imagePath
    ]);
    await db.execute("DELETE FROM gallery_images WHERE id = ?", [imageId]);
    res.redirect("/admin/gallery");
  } catch (error) {
    next(error);
  }
};

// --- Duyurular ---

exports.listAnnouncements = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.id, a.title, a.slug, a.summary, a.is_published, a.created_at, c.name AS category_name
       FROM announcements a
       LEFT JOIN categories c ON c.id = a.category_id
       ORDER BY a.created_at DESC`
    );
    res.render("admin/duyuru-list", { title: "Duyuru Yonetimi", rows });
  } catch (error) {
    next(error);
  }
};

exports.getAddAnnouncement = async (req, res, next) => {
  try {
    const [categories] = await db.execute("SELECT id, name FROM categories ORDER BY name ASC");
    res.render("admin/duyuru-add", { title: "Yeni Duyuru", categories });
  } catch (error) {
    next(error);
  }
};

exports.getEditAnnouncement = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(404).render("error", { title: "Bulunamadi", error: "Gecersiz duyuru." });
    }
    const [rows] = await db.execute(
      "SELECT id, title, slug, summary, content, category_id, is_published FROM announcements WHERE id = ? LIMIT 1",
      [id]
    );
    if (!rows.length) {
      return res.status(404).render("error", { title: "Bulunamadi", error: "Duyuru bulunamadi." });
    }
    const [categories] = await db.execute("SELECT id, name FROM categories ORDER BY name ASC");
    res.render("admin/duyuru-edit", {
      title: "Duyuru Duzenle",
      announcement: rows[0],
      categories
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddAnnouncement = async (req, res, next) => {
  try {
    const slug = await generateUniqueSlug("announcements", req.body.title);
    const categoryId = req.body.category_id ? Number.parseInt(req.body.category_id, 10) : null;
    await db.execute(
      "INSERT INTO announcements (title, slug, summary, content, category_id, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.title,
        slug,
        req.body.summary || null,
        req.body.content,
        Number.isFinite(categoryId) ? categoryId : null,
        req.session.user.id,
        req.body.is_published ? 1 : 0
      ]
    );
    res.redirect("/admin/announcements");
  } catch (error) {
    next(error);
  }
};

exports.postUpdateAnnouncement = async (req, res, next) => {
  try {
    const annId = Number.parseInt(req.body.announcement_id, 10);
    if (!Number.isFinite(annId) || annId < 1) {
      return res.status(400).render("error", { title: "Hata", error: "Gecersiz duyuru." });
    }
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    if (!title || !content) {
      return res
        .status(400)
        .render("error", { title: "Hata", error: "Baslik ve icerik zorunludur." });
    }
    const slug = await generateUniqueSlug("announcements", title, annId);
    const categoryId = req.body.category_id ? Number.parseInt(req.body.category_id, 10) : null;
    await db.execute(
      "UPDATE announcements SET title = ?, slug = ?, summary = ?, content = ?, category_id = ?, is_published = ? WHERE id = ?",
      [
        title,
        slug,
        (req.body.summary || "").trim() || null,
        content,
        Number.isFinite(categoryId) ? categoryId : null,
        req.body.is_published ? 1 : 0,
        annId
      ]
    );
    res.redirect("/admin/announcements");
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await db.execute("DELETE FROM announcements WHERE id = ?", [req.body.announcement_id]);
    res.redirect("/admin/announcements");
  } catch (error) {
    next(error);
  }
};

// --- Teklif yetkili e-postalar (giris yok; yalnizca POST /teklif whitelist) ---

exports.listUsers = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, is_active, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
    );
    res.render("admin/users-list", { title: "Teklif Yetkili E-postalar", rows });
  } catch (error) {
    next(error);
  }
};

exports.getAddUser = async (req, res, next) => {
  try {
    const message = req.session.adminMessage || null;
    delete req.session.adminMessage;
    res.render("admin/user-add", { title: "E-posta Ekle", message });
  } catch (error) {
    next(error);
  }
};

exports.postAddUser = async (req, res, next) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();

    if (!email) {
      req.session.adminMessage = "E-posta adresi zorunludur.";
      return res.redirect("/admin/users/add");
    }

    const [existing] = await db.execute(
      "SELECT id, role FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );
    if (existing.length) {
      if (existing[0].role === "admin") {
        req.session.adminMessage = "Bu adres bir admin hesabina ait.";
      } else {
        req.session.adminMessage = "Bu e-posta zaten listede.";
      }
      return res.redirect("/admin/users/add");
    }

    await db.execute(
      "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, '-', 'user', 1)",
      [email, email]
    );
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.body.user_id, 10);
    if (!Number.isFinite(userId) || userId < 1) {
      return res.status(400).render("error", { title: "Hata", error: "Gecersiz kullanici." });
    }
    await db.execute("UPDATE users SET is_active = 0 WHERE id = ? AND role = 'user'", [userId]);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.body.user_id, 10);
    if (!Number.isFinite(userId) || userId < 1) {
      return res.status(400).render("error", { title: "Hata", error: "Gecersiz kullanici." });
    }
    await db.execute("UPDATE users SET is_active = 1 WHERE id = ? AND role = 'user'", [userId]);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};
