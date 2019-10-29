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

function getStream(id) {
  let stream = streams[id];
  if (!stream) {
    stream = streams[id] = new Sse();
  }

  return stream;
}

function updateStream(entity) {
  const stream = getStream(entity.id);
  const data = JSON.stringify(entity);

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
  .get("/lobbies/:id", async (req, res) => {
    try {
      console.log("REQ-ID", req.params.id);

      const stream = getStream(req.params.id);

      const entity = await Lobby.findByPk(req.params.id, { include: [Text] });
      //console.log("ENTITY", entity);
      const data = JSON.stringify(entity);

      console.log("DATA", data);
      console.log("STREAM", stream);

      stream.updateInit(data);
      stream.init(req, res);
    } catch (error) {
      console.log("Error in GET ONE LOBBY", error);
    }
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

  // .get("/lobbies/:id", (req, res, next) => {
  //   Lobby.findByPk(req.params.id, { include: [Text] })
  //     .then(lobby => {
  //       res.send(lobby);
  //     })
  //     .catch(next);
  // })

  .post("/lobbies", async (req, res) => {
    //console.log("Req Body is", req.body);
    const { name, title, player, description } = req.body;

    const entity = await Lobby.create({
      name,
      storyTitle: title,
      player1: player,
      storyDescription: description,
      status: "waiting"
    });

    // Update the string for the stream
    await update();

    updateStream(entity);

    res.status(201);
    //res.send("Thanks for adding a Lobby");
    res.send(entity);
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

      updateStream(updated);

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
        updateStream({ id: req.params.id });
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

module.exports = router;
