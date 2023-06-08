const isAdmin = (req, res, next) => {
  if (req.payload.role === "admin") {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  isAdmin,
};
