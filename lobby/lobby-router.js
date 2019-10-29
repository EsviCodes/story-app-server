const { Router } = require("express");
const Sse = require("json-sse");
const Lobby = require("./lobby-model");
const Text = require("../texts/text-model");

const router = new Router();
const stream = new Sse();

//Dictionary
const streams = {};

console.log("streams at beginning", streams);

//componentdidmount in app components, so it will always stream

async function update() {
  const lobbiesList = await Lobby.findAll();
  const data = JSON.stringify(lobbiesList);
  stream.send(data);
}

// Get all Lobbies -- works
router.get("/lobbies", async (req, res) => {
  //console.log("Hi from Stream");
  const lobbiesList = await Lobby.findAll();
  const data = JSON.stringify(lobbiesList);

  // Test with http :5000/lobbies --stream
  stream.updateInit(data);
  stream.init(req, res);
});

// Stream one specifc lobby
router
  .get("/streams/:id", async (req, res) => {
    const stream = streams[req.params.id];

    const entity = Lobby.findByPk(req.params.id);
    const data = JSON.stringify(entity);

    stream.updateInit(data);
    stream.init(req, res);
  })

  // Get one Lobby
  // router
  //   .get("/lobbies/:id", async (req, res, next) => {
  //     console.log("get one lobby");
  //     const lobby = await Lobby.findByPk(req.params.id);

  //     const data = JSON.stringify(lobby);
  //     res.status(200);
  //     res.send("Ok");

  //     // Test with http :5000/lobbies/:id --stream
  //     // stream.updateInit(data);
  //     // stream.init(req, res);
  //   })

  .post("/lobbies", async (req, res) => {
    //console.log("Req Body is", req.body);
    const { name } = req.body;

    const entity = await Lobby.create({
      name,
      status: "waiting"
    });

    // Update the string for the stream
    await update();

    const stream = (streams[entity.id] = new Sse());
    const serialized = JSON.stringify(entity);
    stream.send(serialized);

    res.status(201);
    res.send("Thanks for adding a Lobby");
  });

// Edit Lobby

// see if play 1 / 2 is taken ==> logic in DB in Post request
// if player is in that room --> be directed to game straigt away
// status difference between full and playing or finished

router.put("/lobbies/:id", async (req, res, next) => {
  try {
    const lobby = await Lobby.findByPk(req.params.id);

    if (lobby) {
      const { player1, player2 } = lobby.dataValues;
      const { player } = req.body;
      const updateLobby = { status: "waiting" };
      let key = "player1";

      if (player1 !== null) {
        key = "player2";
        updateLobby = { status: "writing" };

        if (player2 !== null) {
          return res.status(429).send({ message: "This writing room is full" });
        }
      }

      updateLobby[key] = player;

      await lobby.update(updateLobby);
      const updated = await Lobby.findByPk(req.params.id, { include: [Text] });
      const data = JSON.stringify(updated);

      console.log("streams", streams);

      let stream = streams[req.params.id];

      if (!stream) {
        stream = streams[req.params.id] = new Sse();
      }
      console.log("streams UPDATE", streams);
      stream.send(data);

      return res
        .status(200)
        .send({ message: "Player added succesfully to the lobby" });
    }

    res.status(429).send({ message: "This writing room does not exist" });
  } catch (error) {
    console.log("error", error);
  }
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
