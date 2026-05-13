# SipSea Web Backend

Bu proje, derste anlatilan yapıya uygun olarak `router-controller-middleware-model` mimarisi ile hazirlanmistir.

## Kurulum

1. `cp .env.example .env` (Windows icin dosyayi kopyalayin)
2. `npm install`
3. MySQL'de `model/schema.sql` dosyasini calistirin (mevcut veritabani varsa yeni tablolarin olusmasi icin tekrar calistirin)
4. `npm run seed:admin` (tek kurulum scripti: `scripts/seed-admin.js`)
5. `npm run dev`

## Notlar

- `public/js/home-parallax.js` anasayfa scroll parallax (dalga / katman solmasi).
- `public/js/admin-return-button.js` navbar admin dugmesi (footer + anasayfa).
- `frontend/DESIGN.md` tasarim token referansi; canli sayfa `home.ejs`.

## Ilk Admin Girisi

- E-posta: `erenakiner2003@gmail.com`
- Sifre: `Admin123!` (ilk giristen sonra degistirin)

## Kriter Karsiliklari

- Dinamik sitemap: `/sitemap.xml`
- IP kontrollu ziyaretci sayisi: `middleware/visitors.js`
- Online kullanici: `middleware/onlineUsers.js`
- Urun slug yapisi (admin icerik yonetimi): `utils/slug.js` + `products` tablosu
- CSRF: `csurf` + `middleware/csrfLocal.js`
- Galeri upload (local): `middleware/upload.js` + `gallery_images` tablosu
