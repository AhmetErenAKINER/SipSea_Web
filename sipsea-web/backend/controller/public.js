const db = require("../model/db");

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
    const [gallery] = await db.execute("SELECT title, file_path FROM gallery_images ORDER BY created_at DESC LIMIT 8");
    const [statsRows] = await db.execute("SELECT stat_value FROM site_stats WHERE stat_key='total_visitors' LIMIT 1");
    const [onlineRows] = await db.execute("SELECT COUNT(*) AS online_count FROM online_sessions");
    const [founders] = await db.execute("SELECT full_name, role_title, photo_path FROM founders ORDER BY sort_order ASC, id ASC");
    const settings = await getSettingsMap();
    const quoteMessage = req.session.quoteMessage || null;
    delete req.session.quoteMessage;

    res.render("public/home", {
      title: "SipSea Soft",
      products,
      founders,
      gallery,
      totalVisitors: statsRows[0]?.stat_value || 0,
      onlineUsers: onlineRows[0]?.online_count || 0,
      settings,
      quoteMessage,
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

exports.founders = async (req, res, next) => {
  try {
    const settings = await getSettingsMap();
    const [founders] = await db.execute("SELECT full_name, role_title, bio, photo_path FROM founders ORDER BY sort_order ASC, id ASC");
    res.render("public/about", {
      title: "Kurucular",
      founders,
      settings
    });
  } catch (error) {
    next(error);
  }
};

exports.contact = async (req, res, next) => {
  try {
    const settings = await getSettingsMap();
    res.render("public/contact", { title: "Iletisim", settings });
  } catch (error) {
    next(error);
  }
};

exports.postQuoteForm = async (req, res, next) => {
  try {
    await db.execute(
      "INSERT INTO quote_requests (full_name, email, project_type, budget_range, message) VALUES (?, ?, ?, ?, ?)",
      [
        req.body.full_name,
        req.body.email,
        req.body.project_type || null,
        req.body.budget_range || null,
        req.body.message
      ]
    );
    req.session.quoteMessage = "Teklif talebiniz alindi. En kisa surede sizinle iletisime gececegiz.";
    res.redirect("/#contact");
  } catch (error) {
    next(error);
  }
};
