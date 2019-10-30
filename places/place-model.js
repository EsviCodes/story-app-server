const Sequelize = require("sequelize");
const db = require("../db");

const Place = db.define("place", {
  place: Sequelize.STRING
});

// Force true is on, because otherwise it will constantly fill up my database everytime it's running. I only want 10 in there.
db.sync({ force: false })
  .then(() => console.log("Place is Running"))
  .then(() => {
    Place.bulkCreate([
      { place: "England" },
      { place: "a land Far Far Away" },
      { place: "the Future" },
      { place: "a Forest" },
      { place: "the Rainbow" },
      { place: "a Vulcano" },
      { place: "the deep Sea" },
      { place: "a House on the Prairie" },
      { place: "Jane Austen's Home" },
      { place: "a place called Codaisseur" }
    ]);
  })
  .catch(console.error);

module.exports = Place;
