module.exports = (...roles) => {
  return (req, res, next) => {
    const role = req.session.user?.role;

    if (!role || !roles.includes(role)) {
      return res.status(403).render("error", {
        title: "Yetkisiz Erisim",
        error: "Bu alana erisim yetkiniz yok."
      });
    }

    next();
  };
};
