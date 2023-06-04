const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// GET "/api/profile" => Show the profile
router.get("/", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const profile = await User.findById(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// PUT "/api/profile/edit" => edita los datos de un usuario
router.put("/edit", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  try {
    const { username, email, newPassword, lastPassword, image } = req.body;
    const profile = await User.findById(userId);
    // Verifica las contraseñas
    const verifyPassword = await bcrypt.compare(lastPassword, profile.password);
    if (!verifyPassword) {
      res.status(400).json({ errorMesage: "Las contraseñas no coinciden" });
      return;
    }    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualiza el perfil de usuario
    await User.findByIdAndUpdate(userId, {
      username,
      password: hashedPassword,
      email,
      image,
    });
    res.json("Usuario actualizado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
