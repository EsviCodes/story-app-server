const Sequelize = require("sequelize");
const db = require("../db");
const Lobby = require("../lobby/lobby-model");

const Text = db.define(
  "text",
  {
    text: Sequelize.TEXT,
    player: Sequelize.INTEGER //player id
  },

  {
    tableName: "texts"
  }
);

// relations
Text.belongsTo(Lobby);
Lobby.hasMany(Text);

db.sync({ force: false })
  .then(() => console.log("Text is Running"))
  .catch(console.error);

module.exports = Text;
