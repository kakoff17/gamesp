const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/isLogin.js");
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

// GET "/api/games/:gameId/comment" => Lista los comentarios del juego

router.get("/:gameId/comment", async (req, res, next) => {
  const { gameId } = req.params;
  try {
    const gameComments = await Comment.find({ game: gameId });
    res.json(gameComments);
  } catch (error) {
    next(error);
  }
});

// POST "/api/games/:gameId/comment" => Crea un comentario en el juego
router.post("/:gameId/comment", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  try {
    const { content } = req.body;
    const gameParams = await Game.findById(req.params.gameId);
    await Comment.create({
      content,
      game: gameParams._id,
      author: userId,
    });
    res.json("Comentario creado");
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

router.put("/:gameId", isAuthenticated, async (req, res, next) => {
  const { gameId } = req.params;
  const { name, description, image, genre, platfrom, gameplay } = req.body;

  try {
    await Game.findByIdAndUpdate(gameId, {
      name,
      description,
      image,
      genre,
      platfrom,
      gameplay,
    });
    res.json("Juego actualizado");
  } catch (error) {
    next(error);
  }
});

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

// POST "/api/games/:gameId/remove" elimina un juego de favorito

router.post("/:gameId/fav/remove", isAuthenticated, async (req, res, next) => {
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
});

module.exports = router;
