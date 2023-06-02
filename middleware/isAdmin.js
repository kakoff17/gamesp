const isAdmin = (req, res, next) => {
    // verifica si el usuario corresponde a admin
    if (req.payload && req.payload.role === "admin") {
      next(); // El usuario es administrador, continúa con la siguiente función de enrutamiento
    } else {
      res.status(403).json({ message: "Acceso denegado. Debes ser administrador." });
    }
  };
  
  module.exports = isAdmin;