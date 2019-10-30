const Sequelize = require("sequelize");
const db = require("../db");

const Lobby = db.define(
  "lobby",
  {
    name: Sequelize.STRING, // name of the lobby
    player1Id: Sequelize.INTEGER, // shows the player's ID
    player2Id: Sequelize.INTEGER, //  shows the player's ID
    storyTitle: Sequelize.STRING,
    storyDescription: Sequelize.TEXT,
    status: Sequelize.STRING // full - waiting - writing
  },

  {
    tableName: "lobby"
  }
);

module.exports = Lobby;
