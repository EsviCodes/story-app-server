const { Router } = require("express");
const Sequelize = require("sequelize");
const Sse = require("json-sse");
const Lobby = require("./lobby-model");
const Text = require("../texts/text-model");
const { toData } = require("../auth/jwt");

const router = new Router();
const stream = new Sse();
const Op = Sequelize.Op;

// In this app, a lobby is a writing room where to writers (players) can join to write a story together

// Dictionary to collect all the different streams which are created by getting a specific lobby
const streams = {};

// Functions used in stream-requests

// Function that updates a lobby and sends the updated information to the stream /lobbies
async function update() {
  const lobbiesList = await Lobby.findAll();
  const data = JSON.stringify(lobbiesList);

  stream.send(data);
}

// Function that looks for a stream with a specific id. If that stream does not exist, it will create a new stream.
// The id of the stream relates to the id of a lobby
function getStream(id) {
  let stream = streams[id];
  if (!stream) {
    stream = streams[id] = new Sse();
  }
  return stream;
}

// Function that updates an existing stream
function updateStream(entity) {
  const stream = getStream(entity.id);
  const data = JSON.stringify(entity);

  stream.send(data);
}

// End-Points

// Get all lobbies --stream
// Filter to only get the lobbies where the status of the lobby is waiting || writing
router.get("/lobbies", async (req, res) => {
  try {
    const lobbiesList = await Lobby.findAll({
      where: {
        [Op.or]: [{ status: "waiting" }, { status: "writing" }]
      }
    });

    const data = JSON.stringify(lobbiesList);

    stream.updateInit(data);
    stream.init(req, res);
  } catch (error) {
    console.error(error);
  }
});

// Get one specific lobby --stream
router
  .get("/lobbies/:id", async (req, res) => {
    try {
      const stream = getStream(req.params.id);
      const entity = await Lobby.findByPk(req.params.id, { include: [Text] });
      const data = JSON.stringify(entity);

      stream.updateInit(data);
      stream.init(req, res);
    } catch (error) {
      console.error(error);
    }
  })

  // Post a new lobby
  .post("/lobbies", async (req, res) => {
    try {
      const { name, title, description } = req.body;
      const { playerjwt } = req.headers;

      const entity = await Lobby.create({
        name,
        storyTitle: title,
        // With a post-request the jwt-token is sent in the header so it can be translated to a player's id
        player1: toData(playerjwt).playerId,
        storyDescription: description,
        // default status
        status: "waiting"
      });

      // Updates the new lobby to the stream
      await update();
      updateStream(entity);
      res.status(201);
      res.send(entity);
    } catch (error) {
      console.log("error", error);
    }
  });

// End-point when a second player wants to join an existing lobby
router.put("/lobbies/:id", async (req, res, next) => {
  try {
    const lobby = await Lobby.findByPk(req.params.id);

    if (lobby) {
      const { player1, player2 } = lobby.dataValues;
      const { playerjwt } = req.headers;

      let updateLobby = {};
      let key = "player1";

      if (player1) {
        key = "player2";
        updateLobby = { status: "writing" };

        if (player2) {
          return res.status(429).send({ message: "This writing room is full" });
        }
      }

      // With the brackets you create a variable key property
      // In this case "key" which is either player1 or player2
      updateLobby[key] = toData(playerjwt).playerId;

      // Updates the lobby
      await lobby.update(updateLobby);
      const updated = await Lobby.findByPk(req.params.id, { include: [Text] });

      // Updates the stream
      updateStream(updated);

      return res
        .status(200)
        .send({ message: "Player added succesfully to the lobby" });
    }

    res.status(429).send({ message: "This writing room does not exist" });
  } catch (error) {
    console.log("error", error);
  }
});

// End-point to which new sentences in a story are send
router.post("/texts", (req, res, next) => {
  const { playerjwt } = req.headers;
  const { text, lobbyId } = req.body;

  // Creates a new text
  Text.create({
    text: text,
    lobbyId: lobbyId,
    playerId: toData(playerjwt).playerId
  })
    .then(() => {
      // After a text is send, the turn shifts to the other player
      return Lobby.findByPk(lobbyId).then(lobby => {
        if (lobby.dataValues.turnToPlay === 1) {
          return lobby.update({
            ...lobby.dataValues,
            turnToPlay: 2
          });
        } else {
          return lobby.update({
            ...lobby.dataValues,
            turnToPlay: 1
          });
        }
      });
    })
    .then(() => {
      // Update the stream with the new Lobby and Text data
      return Lobby.findByPk(lobbyId, { include: [Text] }).then(updated => {
        updateStream(updated);
      });
    })
    .catch(next);
});

// End-point to stop a game
router.put("/lobbies/:id/quit", async (req, res, next) => {
  try {
    const lobby = await Lobby.findByPk(req.params.id);

    if (lobby) {
      await lobby.update({ player1: null, player2: null, status: "end" });
      const updated = await Lobby.findByPk(req.params.id, { include: [Text] });

      updateStream(updated);
      return res.status(200).send({ message: "Game Stopped" });
    }

    res.status(429).send({ message: "This writing room does not exist" });
  } catch (error) {
    console.log("error", error);
  }
});

// This end-point isn't used in the app
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
