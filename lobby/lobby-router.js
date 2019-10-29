const { Router } = require("express");
const Sse = require("json-sse");
const Lobby = require("./lobby-model");
const Text = require("../texts/text-model");
const { toData } = require("../auth/jwt");

const router = new Router();
const stream = new Sse();

//Dictionary
const streams = {};

//console.log("streams at beginning", streams);

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
      // console.log("REQ-ID", req.params.id);

      const stream = getStream(req.params.id);

      const entity = await Lobby.findByPk(req.params.id, { include: [Text] });
      //console.log("ENTITY", entity);
      const data = JSON.stringify(entity);

      // console.log("DATA", data);
      // console.log("STREAM", stream);

      stream.updateInit(data);
      stream.init(req, res);
    } catch (error) {
      //console.log("Error in GET ONE LOBBY", error);
    }
  })

  .post("/lobbies", async (req, res) => {
    try {
      //console.log("Req Body is", req.body);
      const { name, title, description } = req.body;
      //console.log("REQ", req.headers);
      const { playerjwt } = req.headers;
      //console.log("TO DATA", toData(playerjwt));

      const entity = await Lobby.create({
        name,
        storyTitle: title,
        player1: toData(playerjwt).playerId,
        storyDescription: description,
        status: "waiting"
      });

      // Update the string for the stream
      await update();

      updateStream(entity);

      res.status(201);
      //res.send("Thanks for adding a Lobby");
      res.send(entity);
    } catch (error) {
      console.log("error", error);
    }
  });

// Edit Lobby
// if player is in that room --> be directed to game straigt away

router.put("/lobbies/:id", async (req, res, next) => {
  try {
    const lobby = await Lobby.findByPk(req.params.id);
    console.log("PUT REQUEST");

    if (lobby) {
      const { player1, player2 } = lobby.dataValues;
      //const { player } = req.body;
      const { playerjwt } = req.headers;
      //const updateLobby = { status: "waiting" };
      const updateLobby = {};
      let key = "player1";

      //this seat is filled when a new game is created. Doesn't have to be in the logic.
      if (player1) {
        key = "player2";
        updateLobby = { status: "writing" };

        if (player2) {
          return res.status(429).send({ message: "This writing room is full" });
        }
      }

      //CHECK IF THIS WORKS TOMORROW
      updateLobby[key] = toData(playerjwt).playerId;

      await lobby.update(updateLobby);
      const updated = await Lobby.findByPk(req.params.id, { include: [Text] });

      updateStream(updated);

      //console.log("streams UPDATE", streams);
      stream.send(data);

      return res
        .status(200)
        .send({ message: "Player added succesfully to the lobby" });
    }

    res.status(429).send({ message: "This writing room does not exist" });
  } catch (error) {
    //console.log("error", error);
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
