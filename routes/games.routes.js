const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/isLogin.js");
const { isAdmin } = require("../middleware/isAdmin.js");
const Comment = require("../models/Comment.model");
const Game = require("../models/Game.model");
const User = require("../models/User.model.js");

// GET "/api/games" => All game list
router.get("/", async (req, res, next) => {
  try {
    const allGames = await Game.find();
    //console.log(allGames);
    res.json(allGames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error de servidor" });
  }
});

// GET "/api/games/:gameId" => Muestra la vista de un juego por su ID
router.get("/:gameId", async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const response = await Game.findById(gameId);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/games/:gameId" => Elimina un juego //! SOLO ADMINS
router.delete("/:gameId", isAuthenticated, async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    await Game.findByIdAndDelete(gameId);
    res.json("Juego eliminado");
  } catch (error) {
    next(error);
  }
});

// PUT "/api/games/:gameId" => Edita un juego //! SOLO ADMINS

router.put("/:gameId/edit", isAuthenticated, async (req, res, next) => {
    const { gameId } = req.params;
    const { name, description, image, genre, platform, gameplay } = req.body;
    // const platformUpdated = platform.split(", ");
    // const genreUpdated = genre.split(", ");
    console.log(platform, genre)

    try {
      await Game.findByIdAndUpdate(gameId, {
        name,
        description,
        image,
        genre,
        platform,
        gameplay,
      });
      res.json("Juego actualizado");
    } catch (error) {
      next(error);
    }
  }
);

// POST "/api/games/:gameId/fav" => añade juego como favorito del usuario

router.post("/games/:gameId/fav", isAuthenticated, async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const addFavoriteGame = await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { favGame: gameId } },
      { new: true }
    );
    res.status(200).json({ successMessage: "Juego añadido a favoritos" });
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/games/:gameId/remove" elimina un juego de favorito

router.delete(
  "/:gameId/fav/remove",
  isAuthenticated,
  async (req, res, next) => {
    const { gameId } = req.params;

    try {
      await User.findByIdAndUpdate(
        req.payload._id,
        { $pull: { favGame: gameId } },
        { new: true }
      );
      res.json("Juego eliminado de favoritos");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/api/games/:gameId/comments" => Se envian los comentarios del juego

router.get("/:gameId/comments", isAuthenticated, async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const gameComments = await Comment.find({ game: gameId }).populate(
      "author"
    );
    console.log(gameComments);
    res.json(gameComments);
  } catch (error) {
    next(error);
  }
});

// POST "/api/games/:gameId/comments" => Crea un nuevo comentario desde el Front

router.get("/:gameId/comments", isAuthenticated, async (req, res, next) => {
  const { gameId } = req.params;
  const { content } = req.body;
  const userId = req.payload._id;

  try {
    const gameComments = await Game.find(gameId);
    await Comment.create({ content, game: gameParams._id, author: userId });
    console.log(gameComments);
    res.json("Creado el comentario");
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/games/:gameId/comments/:commentId" => Elimina un comentario por su ID

router.delete(
  "/:games/comments/:commentId",
  isAuthenticated,
  async (req, res, next) => {
    const userId = req.payload._id;
    const { commentId } = req.params;

    try {
      const response = await Comment.findById(commentId);

      if (!response) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      if (response.author.toString() !== userId) {
        return res.status(403).json({ message: "Acceso no autorizado" });
      }

      await Comment.findByIdAndDelete(commentId);

      res.json({ message: "Comentario eliminado" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
