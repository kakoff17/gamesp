const Videogames = require("../models/Game.model.js");
const mongoose = require("mongoose");
require("../db/index.js");
const allVideogames = require("./videogames.json");
Videogames.insertMany(allVideogames)
  .then(() => {
    console.log("Juegos insertados en la DB");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(error);
  });
