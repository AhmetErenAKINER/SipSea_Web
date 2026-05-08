const express = require("express");
const controller = require("../controller/admin");
const isAuth = require("../middleware/isAuth");
const hasRole = require("../middleware/hasRole");
const csrfLocal = require("../middleware/csrfLocal");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", isAuth, hasRole("admin"), controller.dashboard);

router.get("/products", isAuth, hasRole("admin"), csrfLocal, controller.listProducts);
router.get("/products/add", isAuth, hasRole("admin"), csrfLocal, controller.getAddProduct);
router.get("/products/edit/:id", isAuth, hasRole("admin"), csrfLocal, controller.getEditProduct);
router.post("/products/add", isAuth, hasRole("admin"), controller.postAddProduct);
router.post("/products/update", isAuth, hasRole("admin"), controller.postUpdateProduct);
router.post("/products/delete", isAuth, hasRole("admin"), controller.deleteProduct);
router.get("/quotes", isAuth, hasRole("admin"), controller.listQuoteRequests);

router.get("/settings", isAuth, hasRole("admin"), csrfLocal, controller.getSettings);
router.post("/settings", isAuth, hasRole("admin"), controller.postSettings);

router.get("/gallery", isAuth, hasRole("admin"), csrfLocal, controller.getGallery);
router.post("/gallery", isAuth, hasRole("admin"), upload.single("image"), controller.postGallery);
router.post("/gallery/founder-image", isAuth, hasRole("admin"), controller.postFounderImage);
router.post("/gallery/product-image", isAuth, hasRole("admin"), controller.postProductImage);
router.post("/gallery/remove-usage", isAuth, hasRole("admin"), controller.removeImageUsage);
router.post("/gallery/delete", isAuth, hasRole("admin"), controller.deleteGalleryImage);

module.exports = router;
