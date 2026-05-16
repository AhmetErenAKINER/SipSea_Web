# SipSea Web Backend

Express + EJS + MySQL. Yapi: `router` → `controller` → `middleware` → `model` + `views`.

## Kurulum

1. `.env.example` dosyasini `.env` olarak kopyalayin
2. `npm install`
3. MySQL'de `model/schema.sql` calistirin (yeni kurulum)
4. Eski DB kullaniyorsaniz: `scripts/migrate-cleanup.sql` (online_sessions kaldirma)
5. `npm run seed:admin`
6. `npm run dev` → http://localhost:3000

## Giris (yalnizca admin)

| Rol | E-posta | Sifre |
|-----|---------|-------|
| Admin | `erenakiner2003@gmail.com` | `Admin123!` |

Teklif yetkili ornek e-posta (giris yok): `demo@sipsea.local` — admin panelden eklenir.

## Roller

| Tip | Aciklama |
|-----|----------|
| Ziyaretci | Oturum yok; teklif formu kayitli e-posta olmadan gonderilemez |
| user (DB) | Adminin ekledigi teklif yetkili e-posta; giris yok |
| admin | Panel girisi, icerik ve e-posta yonetimi |

## Ozellikler

- **Kamu:** `/`, `/urunler`, `/urunler/:slug`, `/duyurular`, `/duyurular/:slug`, teklif (`POST /teklif`)
- **Admin:** urun, duyuru, galeri, site metinleri, teklif talepleri, teklif yetkili e-postalar
- **Sitemap:** `/sitemap.xml`
- **Ziyaretci sayaci:** IP + sure (`middleware/visitors.js`)
- **Online kullanici:** acik sekme (`online_tabs`, `online-tab-ping.js`)
- **CSRF:** `csurf` + `csrfLocal.js`
- **Slug:** `utils/slug.js`

## Veritabani tablolari

`users`, `categories`, `founders`, `products`, `announcements`, `quote_requests`, `gallery_images`, `site_settings`, `visitor_ips`, `online_tabs`, `site_stats`

## Onemli dosyalar

- `index.js` — middleware zinciri
- `controller/public.js` — kamu + teklif dogrulama
- `controller/admin.js` — yonetim
- `controller/auth.js` — admin giris
- `model/schema.sql` — sema
