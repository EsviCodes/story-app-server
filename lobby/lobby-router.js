const { Router } = require("express");
const Lobby = require("./lobby-model");
const Player = require("../players/player-model");

const router = new Router();

// see if play 1 / 2 is taken ==> logic in DB in Post request

// Get all Lobbies
router.get("/lobbies", (req, res, next) => {
  Lobby.findAll()
    .then(lobbies => {
      res.send(lobbies);
    })
    .catch(next);
});

// Get one Lobby
router.get("/lobbies/:id", (req, res, next) => {
  Lobby.findByPk(req.params.id, { include: [Player] })
    .then(lobby => {
      res.send(lobby);
    })
    .catch(next);
});

//Create new Lobby
router.post("/lobbies", (req, res, next) => {
  Lobby.create(req.body)
    .then(lobby => res.json(lobby))
    .catch(next);
});

// Edit Lobby

// see if play 1 / 2 is taken ==> logic in DB in Post request
// if player is in that room --> be directed to game straigt away
// status difference between full and playing or finished

router.put("/lobbies/:id", (req, res, next) => {
  Lobby.findByPk(req.params.id)
    .then(lobby => {
      if (lobby) {
        if (lobby.dataValues.player1 === null) {
          console.log("lobby", lobby.dataValues.player1);
          console.log(req.body);
          const updateLobby = { ...req.body, status: "waiting" };

          lobby
            .update(updateLobby)
            .then(() =>
              res
                .status(200)
                .send({ message: "Player added succesfully to the lobby" })
            );
        } else if (lobby.dataValues.player2 === null) {
          console.log("lobby", lobby.dataValues.player2);
          console.log(req.body);
          const updateLobby = { ...req.body, status: "writing" };

          lobby
            .update(updateLobby)
            .then(() =>
              res
                .status(200)
                .send({ message: "Player added succesfully to the lobby" })
            );
        } else {
          res.status(429).send({ message: "This writing room is full" });
        }
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete Lobby
router.delete("/lobbies/:id", (req, res, next) => {
  Lobby.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

module.exports = router;
