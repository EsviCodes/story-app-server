const { Router } = require("express");
const Character = require("./character-model");

const router = new Router();

// Get all Characters
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

// Post Default Data
router.post("/characters/default", (req, res, next) => {
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
  ])
    .then(() =>
      res.status(201).send({ message: "Characters Data created succesfully" })
    )
    .catch(next);
});

module.exports = router;