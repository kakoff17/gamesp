const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment.model");
const Game = require("../models/Game.model");
const User = require("../models/User.model.js");

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