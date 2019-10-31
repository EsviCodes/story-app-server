const { Router } = require("express");
const Noun = require("./noun-model");

const router = new Router();

// Get all Nouns
router.get("/nouns", (req, res, next) => {
  Noun.findAll()
    .then(nouns => {
      res.send(nouns);
    })
    .catch(next);
});

// Get one Noun
router.get("/nouns/:id", (req, res, next) => {
  Noun.findByPk(req.params.id)
    .then(noun => {
      res.send(noun);
    })
    .catch(next);
});

// Post default Data
router.post("/nouns/default", (req, res, next) => {
  Noun.bulkCreate([
    { noun: "world" },
    { noun: "better tomorrow" },
    { noun: "castle" },
    { noun: "kitten" },
    { noun: "computer program" },
    { noun: "candy" },
    { noun: "chickpea" },
    { noun: "heart" },
    { noun: "galaxy" },
    { noun: "koala" }
  ])
    .then(() =>
      res.status(201).send({ message: "Nouns Data created succesfully" })
    )
    .catch(next);
});

module.exports = router;
