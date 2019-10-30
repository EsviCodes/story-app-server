const Sequelize = require("sequelize");
const db = require("../db");

const Character = db.define("character", {
  character: Sequelize.STRING
});

// Force true is on, because otherwise it will constantly fill up my database everytime it's running. I only want 10 in there.
db.sync({ force: false })
  .then(() => console.log("Character is Running"))
  .then(() => {
    Character.bulkCreate([
      { character: "programmer" },
      { character: "prince" },
      { character: "princess" },
      { character: "frog" },
      { character: "cat" },
      { character: "fluffy bunny" },
      { character: "teacher" },
      { character: "student" },
      { character: "vegan sausage" },
      { character: "pink elephant" }
    ]);
  })
  .catch(console.error);

module.exports = Character;
