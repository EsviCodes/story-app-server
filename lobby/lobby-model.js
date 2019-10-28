const Sequelize = require("sequelize");
const db = require("../db");

const Lobby = db.define(
  "lobby",
  {
    name: Sequelize.STRING, // name of the lobby
    player1: Sequelize.STRING, // shows the username
    player2: Sequelize.STRING, //  shows the username
    status: Sequelize.STRING // full - waiting - writing
  },

  {
    tableName: "lobby"
  }
);

module.exports = Lobby;
