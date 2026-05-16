/**
 * Kamu route'ları. Teklif POST global CSRF ile korunur.
 * Online ping/leave GET olduğu için csurf token gerektirmez.
 */
const express = require("express");
const controller = require("../controller/public");

const router = express.Router();

router.get("/", controller.home);
router.get("/urunler", controller.productsList);
router.get("/urunler/:slug", controller.productDetail);
router.get("/duyurular", controller.announcementsList);
router.get("/duyurular/:slug", controller.announcementDetail);

router.get("/kurucular", (req, res) => res.redirect("/#founders"));
router.get("/iletisim", (req, res) => res.redirect("/#contact-info"));

router.get("/api/online-ping", controller.onlinePing);
router.get("/api/online-leave", controller.onlineLeave);

router.post("/teklif", controller.postQuoteForm);

module.exports = router;
