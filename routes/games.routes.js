const express = require("express");
const router = express.Router();

const Game = require("../models/Game.model")
const { isAuthenticated } = require("../middleware/isLogin.js");
const isAdmin = require("../middleware/isAdmin.js")
const Comment = require("../models/Comment.model");

// GET "/api/games" => All game list
router.get("/", async (req, res, next) => {
    try{
    const allGames = await Game.find()
    console.log(allGames)
    res.json(allGames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Error de servidor" });
  }
})

// GET "/api/games/:gameId" => Muestra toda la lista de juegos
router.get("/:gameId", async (req, res, next) => {

    const {gameId} = req.params

    try{
        const response = await Game.findById(gameId)
        res.json(response)

    } catch(error){
        next(error)
    }

})

// POST "/api/games/:gameId" => Crea un comentario en el juego
router.post("/:gameId", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id
    try{
        const {content} = req.body;
        const gameParams = await Game.findById(req.params.gameId)
        console.log()
        await Comment.create({            
            content,
            game: gameParams._id,
            author: userId,
        });
        res.json("Comentario creado")
    } catch(error){
        next(error)
    }
})

// DELETE "/api/games/:gameId" => Elimina un juego 
router.delete("/:gameId", isAdmin, async (req, res, next) => {    
    try{
        const gameId = req.params.gameId;
        const deletedGame = await Game.findByIdAndDelete(gameId)
        res.json("Juego eliminado")
    } catch(error){
        next(error)
    }
})

module.exports = router



