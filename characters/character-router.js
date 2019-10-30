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

module.exports = router;
