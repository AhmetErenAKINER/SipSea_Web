/**
 * Yönetim paneli route'ları.
 * /admin/users = teklif yetkili e-posta listesi (uye girisi yok).
 * Form GET'lerinde csrfLocal; galeri POST'ta upload.single('image').
 */
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

router.get("/announcements", isAuth, hasRole("admin"), csrfLocal, controller.listAnnouncements);
router.get("/announcements/add", isAuth, hasRole("admin"), csrfLocal, controller.getAddAnnouncement);
router.get(
  "/announcements/edit/:id",
  isAuth,
  hasRole("admin"),
  csrfLocal,
  controller.getEditAnnouncement
);
router.post("/announcements/add", isAuth, hasRole("admin"), controller.postAddAnnouncement);
router.post("/announcements/update", isAuth, hasRole("admin"), controller.postUpdateAnnouncement);
router.post("/announcements/delete", isAuth, hasRole("admin"), controller.deleteAnnouncement);

router.get("/quotes", isAuth, hasRole("admin"), controller.listQuoteRequests);

router.get("/users", isAuth, hasRole("admin"), csrfLocal, controller.listUsers);
router.get("/users/add", isAuth, hasRole("admin"), csrfLocal, controller.getAddUser);
router.post("/users/add", isAuth, hasRole("admin"), controller.postAddUser);
router.post("/users/deactivate", isAuth, hasRole("admin"), controller.deactivateUser);
router.post("/users/activate", isAuth, hasRole("admin"), controller.activateUser);

router.get("/settings", isAuth, hasRole("admin"), csrfLocal, controller.getSettings);
router.post("/settings", isAuth, hasRole("admin"), controller.postSettings);

router.get("/gallery", isAuth, hasRole("admin"), csrfLocal, controller.getGallery);
router.post("/gallery", isAuth, hasRole("admin"), upload.single("image"), controller.postGallery);
router.post("/gallery/founder-image", isAuth, hasRole("admin"), controller.postFounderImage);
router.post("/gallery/product-image", isAuth, hasRole("admin"), controller.postProductImage);
router.post("/gallery/remove-usage", isAuth, hasRole("admin"), controller.removeImageUsage);
router.post("/gallery/delete", isAuth, hasRole("admin"), controller.deleteGalleryImage);

module.exports = router;
