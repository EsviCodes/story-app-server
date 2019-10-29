const { Router } = require("express");
const Player = require("./player-model");
const bcrypt = require("bcrypt");

const router = new Router();

router.post("/signup", (req, res, next) => {
  Player.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  })
    .then(() => res.status(201).send({ message: "Player created succesfully" }))
    .catch(next);
});

module.exports = router;
