const Sequelize = require("sequelize");
const db = require("../db");

const Noun = db.define("noun", {
  noun: Sequelize.STRING
});

module.exports = Noun;
