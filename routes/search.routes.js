const express = require("express");
const router = express.Router();

const Game = require("../models/Game.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

// GET "/" Muestra la pagina principal con el buscador
router.get("/", async (req, res, next) => {
  
});

router.post("/results", async (req, res, next) => {

})
    

module.exports = router;