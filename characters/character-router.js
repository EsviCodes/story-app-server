const { Router } = require("express");
const Character = require("./character-model");

const router = new Router();

// End-points

// Get all characters
router.get("/characters", (req, res, next) => {
  Character.findAll()
    .then(characters => {
      res.send(characters);
    })
    .catch(next);
});

// Get one character
router.get("/characters/:id", (req, res, next) => {
  Character.findByPk(req.params.id)
    .then(character => {
      res.send(character);
    })
    .catch(next);
});

// Post default data
router.post("/characters/default", (req, res, next) => {
  Character.bulkCreate([
    { character: "smart programmer" },
    { character: "cowardly hero" },
    { character: "strong princess" },
    { character: "magnificent dragon" },
    { character: "fluffy cat" },
    { character: "huge bunny" },
    { character: "brave witch" },
    { character: "greedy writer" },
    { character: "hairy hobbit" },
    { character: "pink elephant" }
  ])
    .then(() =>
      res.status(201).send({ message: "Character data created succesfully" })
    )
    .catch(next);
});

module.exports = router;
