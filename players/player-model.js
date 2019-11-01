const Sequelize = require("sequelize");
const db = require("../db");

// A player is a writer in the app

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

module.exports = Player;
