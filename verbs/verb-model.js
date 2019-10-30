const Sequelize = require("sequelize");
const db = require("../db");

const Verb = db.define("verb", {
  verb: Sequelize.STRING
});

// Force true is on, because otherwise it will constantly fill up my database everytime it's running. I only want 10 in there.
db.sync({ force: false })
  .then(() => console.log("Verb is Running"))
  .then(() => {
    Verb.bulkCreate([
      { verb: "love" },
      { verb: "save" },
      { verb: "decorate" },
      { verb: "program" },
      { verb: "travel" },
      { verb: "cuddle" },
      { verb: "create" },
      { verb: "seek" },
      { verb: "live" },
      { verb: "dream" }
    ]);
  })
  .catch(console.error);

module.exports = Verb;
