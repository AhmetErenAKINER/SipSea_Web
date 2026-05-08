const express = require("express");
const controller = require("../controller/sitemap");

const router = express.Router();

router.get("/sitemap.xml", controller.index);

module.exports = router;
