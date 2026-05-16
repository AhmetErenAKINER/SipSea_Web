/**
 * Global csurf() POST isteklerini doğrular; GET sayfalarında token şablona geçmez.
 * Form içeren GET route'larına bu middleware eklenir → res.locals.csrfToken dolar.
 */
module.exports = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
