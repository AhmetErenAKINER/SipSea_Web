module.exports = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path || "";
  const originalUrl = req.originalUrl || "";
  res.locals.isAdminRoute = originalUrl.startsWith("/admin");
  res.locals.isAuthRoute = originalUrl.startsWith("/auth");
  res.locals.isAdminDashboard = originalUrl === "/admin" || originalUrl === "/admin/";
  next();
};
