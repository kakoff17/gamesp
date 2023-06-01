const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  genre: {
    type: String,
    enum: [
      "Acción",
      "Estrategia",
      "Rol",
      "Disparos",
      "Aventura",
      "Carreras",
      "Deportes",
      "Educación",
    ],
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
