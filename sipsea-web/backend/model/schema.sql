-- SipSea Web veritabanı şeması (nihai)

CREATE DATABASE IF NOT EXISTS sipsea_web;
USE sipsea_web;

-- admin: panel girişi | user: teklif yetkili e-posta (giriş yok)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS founders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  role_title VARCHAR(120) NOT NULL,
  bio TEXT NULL,
  photo_path VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  summary VARCHAR(400) NULL,
  content TEXT NOT NULL,
  tech_stack VARCHAR(255) NULL,
  cover_image_path VARCHAR(255) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(180) NOT NULL,
  project_type VARCHAR(120) NULL,
  budget_range VARCHAR(80) NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'reviewed', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  summary VARCHAR(400) NULL,
  content TEXT NOT NULL,
  category_id INT NULL,
  author_id INT NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ann_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_ann_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NOT NULL,
  file_size INT NOT NULL,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gallery_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS visitor_ips (
  ip_address VARCHAR(64) PRIMARY KEY,
  last_counted_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS online_tabs (
  tab_key VARCHAR(64) PRIMARY KEY,
  ip_address VARCHAR(64) NOT NULL,
  last_seen_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS site_stats (
  stat_key VARCHAR(80) PRIMARY KEY,
  stat_value BIGINT NOT NULL DEFAULT 0
);

INSERT IGNORE INTO site_stats (stat_key, stat_value) VALUES ('total_visitors', 0);
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('contact_email', 'example@email.com'),
  ('contact_phone', '+90 555 000 00 00'),
  ('contact_address', 'Istanbul, Turkiye'),
  ('about_text', 'SipSea Soft, co-founder ekibiyle dijital urunler gelistirir.'),
  ('hero_badge_text', 'Kurulus 2026'),
  ('hero_title_text', 'Yeni Nesil Yazilim Mukemmelligi.'),
  ('hero_description_text', 'Zeka ile olceklenebilirligi dengeleyen dijital temeller tasarliyoruz.'),
  ('products_section_title', 'Urun Vitrini'),
  ('products_section_description', 'Modern verimliligin yazilim mimarisi.'),
  ('founders_section_title', 'Vizyonumuz.'),
  ('quote_section_title', 'Projeni Baslat.'),
  ('quote_section_description', 'Hedefini anlat, mimariyi ve altyapiyi biz tasarlayalim.'),
  ('footer_copyright_text', '© 2026 SipSea Soft. Tum haklari saklidir.');

INSERT IGNORE INTO founders (id, full_name, role_title, bio, sort_order) VALUES
  (1, 'Samet Karahan', 'Kurucu Ortak · Urun', 'Urun vizyonu ve musterı deneyimi tasarımı.', 1),
  (2, 'Eren Akıner', 'Kurucu Ortak · Muhendislik', 'Yazilim mimarisi ve teknik operasyon.', 2),
  (3, 'Arda Ateşli', 'Kurucu Ortak · Strateji', 'Is gelistirme ve stratejik planlama.', 3);
