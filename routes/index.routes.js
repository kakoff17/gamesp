const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes"))
router.use("/games", require("./games.routes"))
router.use("/profile", require("./profile.routes"))

module.exports = router;