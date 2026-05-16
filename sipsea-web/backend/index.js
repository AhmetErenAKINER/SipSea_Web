/**
 * Uygulama giriş noktası: Express örneğini oluşturur, middleware zincirini kurar,
 * route mount'larını yapar ve HTTP sunucusunu başlatır.
 *
 * Middleware sırası kasıtlıdır — oturum ve body parser, CSRF'den önce gelmeli;
 * ziyaretçi/online sayaçları route handler'lardan önce her istekte çalışır.
 */
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const configSession = require("./middleware/configSession");
const locals = require("./middleware/locals");
const navProducts = require("./middleware/navProducts");
const visitors = require("./middleware/visitors");
const onlineUsers = require("./middleware/onlineUsers");

const publicRouter = require("./router/public");
const authRouter = require("./router/auth");
const adminRouter = require("./router/admin");
const sitemapRouter = require("./router/sitemap");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Statik dosyalar router'lardan önce; böylece CSS/JS için session/CSRF devreye girmez
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(configSession);
app.use(locals);
app.use(navProducts);
app.use(visitors);
app.use(onlineUsers);

// Tüm state-changing POST isteklerinde _csrf doğrulanır (formlarda hidden input)
app.use(csurf());

app.use(sitemapRouter);
app.use("/", publicRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
  res.status(404).render("error", { title: "404", error: "Sayfa bulunamadi." });
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).render("error", {
      title: "Guvenlik Hatasi",
      error: "CSRF token dogrulanamadi. Formu yenileyip tekrar deneyin."
    });
  }
  console.error(err);
  res.status(500).render("error", { title: "Hata", error: err.message || "Beklenmeyen hata olustu." });
});

const { purgeStaleSessions } = require("./utils/onlineSessions");

const port = Number(process.env.PORT || 3000);
app.listen(port, async () => {
  try {
    // Sunucu yeniden başladığında süresi dolmuş sekme kayıtlarını temizle
    await purgeStaleSessions();
  } catch (error) {
    console.error("Online tabs startup purge:", error.message);
  }
  console.log(`SipSea backend running on http://localhost:${port}`);
});
