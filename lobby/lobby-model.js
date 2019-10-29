const Sequelize = require("sequelize");
const db = require("../db");

const Lobby = db.define(
  "lobby",
  {
    name: Sequelize.STRING, // name of the lobby
    player1: Sequelize.INTEGER, // shows the player's ID
    player2: Sequelize.INTEGER, //  shows the player's ID
    status: Sequelize.STRING // full - waiting - writing
  },

  {
    tableName: "lobby"
  }
);

module.exports = Lobby;
