/**
 * Kimlik doğrulama route'ları. Login GET'te csrfLocal ile form token'ı üretilir.
 */
const express = require("express");
const controller = require("../controller/auth");
const csrfLocal = require("../middleware/csrfLocal");

const router = express.Router();

router.get("/login", csrfLocal, controller.getLogin);
router.post("/login", controller.postLogin);
router.get("/logout", controller.logout);

module.exports = router;
