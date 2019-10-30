const Sequelize = require("sequelize");
const db = require("../db");

const Character = db.define("character", {
  character: Sequelize.STRING
});

module.exports = Character;
