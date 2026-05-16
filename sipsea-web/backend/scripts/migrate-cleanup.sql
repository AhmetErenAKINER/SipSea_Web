-- Mevcut veritabaninda eski yapilari temizlemek icin (bir kez calistirin)
USE sipsea_web;

DROP TABLE IF EXISTS online_sessions;

-- Eski visitor rolunu kullanmiyorsak (opsiyonel, hata verirse atlayin):
-- ALTER TABLE users MODIFY role ENUM('user', 'admin') NOT NULL DEFAULT 'user';
