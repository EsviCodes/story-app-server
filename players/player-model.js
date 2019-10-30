const Sequelize = require("sequelize");
const db = require("../db");
const Lobby = require("../lobby/lobby-model");

const Player = db.define(
  "player",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    tableName: "players"
  }
);

db.sync({ force: false })
  .then(() => console.log("Players is Running"))
  .catch(console.error);
module.exports = Player;
