const Sequelize = require("sequelize");
const db = require("../db");
const Lobby = require("../lobby/lobby-model");

const Text = db.define(
  "text",
  {
    text: Sequelize.STRING, // set to STRING
    playerId: Sequelize.INTEGER
  },

  {
    tableName: "texts"
  }
);

// relations
Text.belongsTo(Lobby);
Lobby.hasMany(Text);

module.exports = Text;
