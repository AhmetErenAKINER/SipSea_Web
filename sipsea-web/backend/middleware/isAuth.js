/**
 * Giriş yapmamış istekleri login sayfasına yönlendirir.
 * url query parametresi ile login sonrası orijinal hedefe dönüş sağlanır.
 */
module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect(`/auth/login?url=${encodeURIComponent(req.originalUrl)}`);
  }

  next();
};
