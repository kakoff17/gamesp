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

// POST "/api/games/create" =>  Crea un juego en la BD con información del FE

router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, description, image, genre, platform, gameplay } =
    req.body; 
  try {  

    await Game.create({
      name,
      description,
      image,
      genre,
      platform,
      gameplay,
    });
    res.json("Juego creado");
  } catch (error) {
    next(error);
  }
});

// GET "/api/games/:gameId" => Muestra la vista de un juego por su ID
router.get("/:gameId", async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const response = await Game.findById(gameId);    
    //console.log(response)    
    const gameData = {
      game: response,      
    };
    
    res.json(gameData);
  } catch (error) {
    next(error);
  }
});

// GET "/api/games/:gameId/comment"
router.get("/:gameId/comment", async (req, res, next) => {
  const {gameId} = req.params;

  try{
    const allComments = await Comment.find({game: gameId}).populate("author")
    res.json(allComments)

  }catch (error){
    next(error)
  }
})

// DELETE "/api/games/:gameId" => Elimina un juego //! SOLO ADMINS
router.delete("/:gameId/delete", isAuthenticated, async (req, res, next) => {
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

  try {
    await Game.findByIdAndUpdate(gameId, {
      name: name,
      description: description,
      image: image,
      genre: genre,
      platform: platform,
      gameplay: gameplay,
    });
    res.json("Juego actualizado");
  } catch (error) {
    next(error);
  }
});

// POST "/games/:gameId/comment" => Crea un nuevo comentario del juego

router.post("/:gameId/comment", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  const { content } = req.body;
  const { gameId } = req.params;
  try {
    const gameParams = await Game.findById(gameId);
    await Comment.create({
      content,
      game: gameParams._id,
      author: userId,
    });
    res.json("comentario creado");
  } catch (err) {
    next(err);
  }
});

// DELETE "/games/:gameId/comment/:commId" => Elimina el comentario del juego
router.delete("/:gameId/comment/:commId", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    const {commId} = req.params;
    try {
      // todo condicional que no cualquier pueda borrar un comentario.
      await Comment.findByIdAndDelete(commId);
      res.json({ message: "Comentario eliminado" });
    }catch (err) {
      next(err);
    }
  }
);

// * RUTAS DE FAVORITOS
// todo

// POST "/api/games/:gameId/fav" => añade juego como favorito del usuario

router.post("/games/:gameId/favourite", isAuthenticated, async (req, res, next) => {
  const { gameId } = req.params;

  try {
    await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { favGame: gameId } },
      { new: true }
    );
    res.status(200).json({ successMessage: "Juego añadido a favoritos" });
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/games/:gameId/fav/remove" elimina un juego de favorito

router.delete("/:gameId/fav/delete", isAuthenticated, async (req, res, next) => {
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


module.exports = router;