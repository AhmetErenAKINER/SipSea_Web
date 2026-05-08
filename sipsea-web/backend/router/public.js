const express = require("express");
const controller = require("../controller/public");

const router = express.Router();

router.get("/", controller.home);
router.get("/urunler", controller.productsList);
router.get("/kurucular", controller.founders);
router.get("/iletisim", controller.contact);
router.post("/teklif", controller.postQuoteForm);

module.exports = router;
