const Sequelize = require("sequelize");
const db = require("../db");

const Lobby = db.define(
  "lobby",
  {
    name: Sequelize.STRING, // name of the lobby
    player1: Sequelize.INTEGER, // shows the player's ID
    player2: Sequelize.INTEGER, //  shows the player's ID
    storyTitle: Sequelize.STRING,
    storyDescription: Sequelize.TEXT,
    status: Sequelize.STRING // full - waiting - writing
  },

  {
    tableName: "lobby"
  }
);

db.sync({ force: false })
  .then(() => console.log("Lobby is Running"))
  .catch(console.error);

module.exports = Lobby;
