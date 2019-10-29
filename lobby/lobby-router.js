const { Router } = require("express");
const Sse = require("json-sse");
const Lobby = require("./lobby-model");

const router = new Router();
const stream = new Sse();

router.get("/lobbies", async (req, res) => {
  //console.log("Hi from Stream");
  const lobbiesList = await Lobby.findAll();

  const data = JSON.stringify(lobbiesList);
  //console.log("After Stringify - lobbies in Db", data);

  // Test with http :5000/lobbies --stream
  stream.updateInit(data);
  stream.init(req, res);
});

// Get one Lobby
router
  .get("/lobbies/:id", async (req, res, next) => {
    const lobbyStream = await Lobby.findByPk(req.params.id);

    const data = JSON.stringify(lobbyStream);
    //console.log("After Stringify - lobby in Db", data);

    // Test with http :5000/lobbies/:id --stream
    stream.updateInit(data);
    stream.init(req, res);
  })
  //     .then(lobby => {
  //       res.send(lobby);
  //     })
  //     .catch(next);
  // })

  .post("/lobbies", async (req, res) => {
    //console.log("Req Body is", req.body);
    const { name } = req.body;

    const entity = await Lobby.create({
      name
    });

    // Update the string for the stream
    const lobbiesList = await Lobby.findAll();
    const data = JSON.stringify(lobbiesList);
    stream.send(data);

    res.status(201);
    res.send("Thanks for adding a Lobby");
  });

// Edit Lobby

// see if play 1 / 2 is taken ==> logic in DB in Post request
// if player is in that room --> be directed to game straigt away
// status difference between full and playing or finished

router.put("/lobbies/:id", async (req, res, next) => {
  const lobbyStream = await Lobby.findByPk(req.params.id)
    //Lobby.findByPk(req.params.id)
    .then(lobby => {
      if (lobby) {
        if (lobby.dataValues.player1 === null) {
          // console.log("lobby", lobby.dataValues.player1);
          // console.log(req.body);
          const { player } = req.body;
          //console.log(player);

          const updateLobby = { player1: player, status: "waiting" };
          // console.log("update Lobby P1", updateLobby);

          lobby
            .update(updateLobby)
            .then(() =>
              res
                .status(200)
                .send({ message: "Player added succesfully to the lobby" })
            );
        } else if (lobby.dataValues.player2 === null) {
          //console.log("lobby", lobby.dataValues.player2);
          //console.log(req.body);
          //const updateLobby = { ...req.body, status: "writing" };
          const { player } = req.body;

          const updateLobby = { player2: player, status: "waiting" };
          console.log("update Lobby P2", updateLobby);

          lobby.update(updateLobby).then(() =>
            res.status(200).send({
              message: "Player added succesfully to the writing room"
            })
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
