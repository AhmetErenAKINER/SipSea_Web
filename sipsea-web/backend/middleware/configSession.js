const session = require("express-session");

module.exports = session({
  secret: process.env.SESSION_SECRET || "replace-with-random-guid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  }
});
