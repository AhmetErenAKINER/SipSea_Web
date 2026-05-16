/**
 * Kamu site controller: anasayfa, ürün/duyuru listesi ve detay, teklif formu,
 * online sekme ping/leave API uçları.
 */
const db = require("../model/db");

/** site_settings satırlarını key → value map'e çevirir (şablonlarda tek nesne) */
async function getSettingsMap() {
  const [settings] = await db.execute("SELECT setting_key, setting_value FROM site_settings");
  return settings.reduce((acc, row) => {
    acc[row.setting_key] = row.setting_value;
    return acc;
  }, {});
}

exports.home = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      "SELECT id, title, slug, summary, tech_stack, cover_image_path FROM products WHERE is_published = 1 ORDER BY created_at DESC LIMIT 6"
    );
    const [gallery] = await db.execute(
      "SELECT title, file_path FROM gallery_images ORDER BY created_at DESC LIMIT 8"
    );
    const [founders] = await db.execute(
      "SELECT full_name, role_title, photo_path FROM founders ORDER BY sort_order ASC, id ASC"
    );
    const [announcements] = await db.execute(
      `SELECT a.title, a.slug, a.summary, a.created_at, c.name AS category_name
       FROM announcements a
       LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.is_published = 1
       ORDER BY a.created_at DESC
       LIMIT 3`
    );
    const settings = await getSettingsMap();

    const quoteMessage = req.session.quoteMessage || null;
    const quoteMessageType = req.session.quoteMessageType || "success";
    delete req.session.quoteMessage;
    delete req.session.quoteMessageType;

    res.render("public/home", {
      title: "SipSea Soft",
      products,
      founders,
      announcements,
      gallery,
      settings,
      quoteMessage,
      quoteMessageType,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    next(error);
  }
};

exports.productsList = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      "SELECT id, title, slug, summary, content, tech_stack, cover_image_path, created_at FROM products WHERE is_published = 1 ORDER BY created_at DESC"
    );
    const settings = await getSettingsMap();
    res.render("public/products", {
      title: "Ürünlerimiz",
      products,
      settings
    });
  } catch (error) {
    next(error);
  }
};

exports.productDetail = async (req, res, next) => {
  try {
    const slug = (req.params.slug || "").trim();
    const [rows] = await db.execute(
      "SELECT id, title, slug, summary, content, tech_stack, cover_image_path, created_at FROM products WHERE slug = ? AND is_published = 1 LIMIT 1",
      [slug]
    );
    if (!rows.length) {
      return res.status(404).render("error", { title: "404", error: "Urun bulunamadi." });
    }
    const settings = await getSettingsMap();
    res.render("public/product-detail", {
      title: rows[0].title,
      product: rows[0],
      settings
    });
  } catch (error) {
    next(error);
  }
};

exports.announcementsList = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.id, a.title, a.slug, a.summary, a.created_at, c.name AS category_name
       FROM announcements a
       LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.is_published = 1
       ORDER BY a.created_at DESC`
    );
    const settings = await getSettingsMap();
    res.render("public/duyurular", { title: "Duyurular", rows, settings });
  } catch (error) {
    next(error);
  }
};

exports.announcementDetail = async (req, res, next) => {
  try {
    const slug = (req.params.slug || "").trim();
    const [rows] = await db.execute(
      `SELECT a.id, a.title, a.slug, a.summary, a.content, a.created_at, c.name AS category_name
       FROM announcements a
       LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.slug = ? AND a.is_published = 1
       LIMIT 1`,
      [slug]
    );
    if (!rows.length) {
      return res.status(404).render("error", { title: "404", error: "Duyuru bulunamadi." });
    }
    const settings = await getSettingsMap();
    res.render("public/duyuru-detail", {
      title: rows[0].title,
      announcement: rows[0],
      settings
    });
  } catch (error) {
    next(error);
  }
};

const onlineSessionUtils = require("../utils/onlineSessions");

/** Kamu sayfasındaki sekme heartbeat; admin oturumları 204 ile sessizce reddedilir */
exports.onlinePing = async (req, res, next) => {
  try {
    if (!onlineSessionUtils.isVisitorPingAllowed(req)) {
      return res.status(204).end();
    }

    const tabKey = String(req.query.tab || "")
      .trim()
      .slice(0, 64);
    if (!tabKey) {
      return res.status(400).end();
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    await onlineSessionUtils.touchTab(tabKey, ip);
    await onlineSessionUtils.purgeStaleSessions();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

/** pagehide / beforeunload ile sekme kapanınca tab satırını hemen sil */
exports.onlineLeave = async (req, res, next) => {
  try {
    const tabKey = String(req.query.tab || "")
      .trim()
      .slice(0, 64);
    if (!tabKey) {
      return res.status(400).end();
    }

    await onlineSessionUtils.removeTab(tabKey);
    await onlineSessionUtils.purgeStaleSessions();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.postQuoteForm = async (req, res, next) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const [allowedUsers] = await db.execute(
      "SELECT id FROM users WHERE LOWER(email) = ? AND role = 'user' AND is_active = 1 LIMIT 1",
      [email]
    );

    if (!allowedUsers.length) {
      req.session.quoteMessage =
        "Bu e-posta adresi sistemde kayitli degil. Teklif verebilmek icin lutfen admin ile iletisime gecin.";
      req.session.quoteMessageType = "error";
      return res.redirect("/#contact");
    }

    await db.execute(
      "INSERT INTO quote_requests (full_name, email, project_type, budget_range, message) VALUES (?, ?, ?, ?, ?)",
      [
        req.body.full_name,
        email,
        req.body.project_type || null,
        req.body.budget_range || null,
        req.body.message
      ]
    );
    req.session.quoteMessage =
      "Teklif talebiniz alindi. En kisa surede sizinle iletisime gececegiz.";
    req.session.quoteMessageType = "success";
    res.redirect("/#contact");
  } catch (error) {
    next(error);
  }
};
