const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/isLogin.js");

// POST /auth/signup  - Crea un nuevo usuario
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // Comprueba si el email, la contraseña y el username estan rellenados.
  if (!username || !email || !password) {
    res.status(400).json({ message: "Todos los campos deben estar completos" });
    return;
  }

  // Comprobar si el mail tiene un formato correcto.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "La dirección de mail no es valida." });
    return;
  }

  // Comprueba si la contraseña cumple los mínimos requeridos
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "La constraseña debe tener al menos 6 caracteres y tener al menos un número, una letra minúscula y una mayúscula.",
    });
    return;
  }

  // Comprueba que no haya un usuario con el mismo email
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res
        .status(400)
        .json({ message: "El usuario ya ha sido creado anteriormente." });
      return;
    }

    // Encriptación de contraseña
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    //console.log(encryptedPassword)

    await User.create({
      username: username,
      email: email,
      password: encryptedPassword,
    });
    res.json("Usuario creado con éxito");
  } catch (error) {
    next(error);
  }
});

// POST  /auth/login - Ruta de comprobacion de login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Comprobacion de no haber emptyString
  if (email === "" || password === "") {
    res
      .status(400)
      .json({ message: "Debe proporcionar un usuario y una contraseña" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      res
        .status(401)
        .json({ message: "Usuario no encontrado con esa dirección email." });
      return;
    }

    // Compara contraseñas y verifica si es válida
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Contraseña no válida." });
      return;
    }

    const payload = {
      _id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role
    };

    // Crear token para enviarselo al cliente
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "10d",
    });
    res.json({ authToken: authToken });
    
  } catch (error) {
    next(error);
  }
});

// GET  /auth/verify  -  Comprobar en el frontend que el usuario esté validado
router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(req.payload);

  res.json({payload: req.payload})

});

module.exports = router;