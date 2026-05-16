/**
 * Galeri görsel yükleme: multer disk storage, MIME ve boyut doğrulaması.
 * Dosyalar public/uploads/gallery altına timestamp'li isimle yazılır.
 */
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "public", "uploads", "gallery")),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
    cb(null, safeName);
  }
});

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Sadece gorsel dosyasi yukleyebilirsiniz."));
    }
    cb(null, true);
  }
});

module.exports = upload;
