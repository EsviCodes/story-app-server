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

module.exports = router;
