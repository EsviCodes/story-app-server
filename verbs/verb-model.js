const Sequelize = require("sequelize");
const db = require("../db");

const Verb = db.define("verb", {
  verb: Sequelize.STRING
});

module.exports = Verb;
