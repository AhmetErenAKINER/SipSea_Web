/**
 * Admin kimlik doğrulama: yalnizca role=admin hesaplari giris yapabilir.
 */
const bcrypt = require("bcrypt");
const db = require("../model/db");

exports.getLogin = (req, res) => {
  const message = req.session.message || null;
  delete req.session.message;

  const returnUrl = req.query.url || null;

  res.render("auth/login", {
    title: "Admin Giris",
    message,
    returnUrl
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND is_active = 1 AND role = 'admin' LIMIT 1",
      [req.body.email]
    );
    if (!users.length) {
      req.session.message = "Admin hesabi bulunamadi.";
      return res.redirect("/auth/login");
    }

    const user = users[0];
    const ok = await bcrypt.compare(req.body.password, user.password_hash);
    if (!ok) {
      req.session.message = "Sifre hatali.";
      return res.redirect("/auth/login");
    }

    req.session.user = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    const requested = req.query.url || "";
    const target = requested.startsWith("/admin") ? requested : "/admin";
    return res.redirect(target);
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res) => {
  await new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
  res.redirect("/");
};
