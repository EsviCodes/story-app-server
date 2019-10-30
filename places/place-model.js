const Sequelize = require("sequelize");
const db = require("../db");

const Place = db.define("place", {
  place: Sequelize.STRING
});

module.exports = Place;
