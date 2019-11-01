const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const bcrypt = require("bcrypt");
const Player = require("../players/player-model");

const router = new Router();

// Endpoints
router.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please give me some credentials, stranger" });
  }

  Player.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(player => {
      if (!player) {
        res.status(400).send({
          message: "Username or password incorrect, sorry"
        });
      }

      // Use bcrypt.compareSync to check the password against the stored hash
      else if (bcrypt.compareSync(req.body.password, player.password)) {
        // If the password is correct, return a JWT with the userId of the user (user.id)
        res.send({
          jwt: toJWT({ playerId: player.id }) // make a token, with userId encrypted inside of it
        });
      } else {
        res.status(400).send({
          message: "Username or password incorrect, sorry"
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong"
      });
    });
});

router.get("/secret-endpoint", (req, res) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  console.log("SPLIT:", auth);

  if (auth && auth[0] === "Bearer" && auth[1]) {
    const data = toData(auth[1]);
    res.send({
      message: "Thanks for visiting the secret endpoint.",
      data
    });
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

module.exports = router;
