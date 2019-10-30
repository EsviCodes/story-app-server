const Sequelize = require("sequelize");
const db = require("../db");

const Noun = db.define("noun", {
  noun: Sequelize.STRING
});

// Force true is on, because otherwise it will constantly fill up my database everytime it's running. I only want 10 in there.
db.sync({ force: false })
  .then(() => console.log("Noun is Running"))
  .then(() => {
    Noun.bulkCreate([
      { noun: "world" },
      { noun: "better tomorrow" },
      { noun: "castle" },
      { noun: "kitten" },
      { noun: "computer program" },
      { noun: "candy" },
      { noun: "chickpeas" },
      { noun: "heart" },
      { noun: "galaxy" },
      { noun: "koala" }
    ]);
  })
  .catch(console.error);

module.exports = Noun;
