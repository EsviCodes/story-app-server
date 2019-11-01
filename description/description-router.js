const { Router } = require("express");
const Noun = require("../nouns/noun-model");
const Character = require("../characters/character-model");
const Verb = require("../verbs/verb-model");
const Place = require("../places/place-model");
const Sequelize = require("sequelize");

const router = new Router();

// When you create a new writing room in the app, you have to fill in the blanks in a given first sentence. If you choose to get random suggestions, this end-point is requested.

router.get("/description/random", (req, res, next) => {
  Promise.all([
    Place.findOne({
      order: [Sequelize.fn("RANDOM")]
    }),
    Character.findOne({
      order: [Sequelize.fn("RANDOM")]
    }),
    Verb.findOne({
      order: [Sequelize.fn("RANDOM")]
    }),
    Noun.findOne({
      order: [Sequelize.fn("RANDOM")]
    })
  ])
    .then(values => {
      const description = {
        place: values[0].place,
        character: values[1].character,
        verb: values[2].verb,
        noun: values[3].noun
      };
      res.send(description).end();
    })
    .catch(console.error);
});

module.exports = router;
