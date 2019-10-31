const { Router } = require("express");
const Sequelize = require("sequelize");
const Sse = require("json-sse");
const Lobby = require("./lobby-model");
const Text = require("../texts/text-model");
const { toData } = require("../auth/jwt");

const router = new Router();
const stream = new Sse();

const Op = Sequelize.Op;

//Dictionary
const streams = {};

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
  const lobbiesList = await Lobby.findAll({
    where: {
      [Op.or]: [{ status: "waiting" }, { status: "writing" }]
    }
  });

  // filter to only send back lobby where lobbies have players waiting
  const data = JSON.stringify(lobbiesList);

  stream.updateInit(data);
  stream.init(req, res);
});

// Stream one specifc lobby
router
  .get("/lobbies/:id", async (req, res) => {
    try {
      const stream = getStream(req.params.id);
      const entity = await Lobby.findByPk(req.params.id, { include: [Text] });
      const data = JSON.stringify(entity);

      stream.updateInit(data);
      stream.init(req, res);
    } catch (error) {}
  })

  .post("/lobbies", async (req, res) => {
    try {
      const { name, title, description } = req.body;

      const { playerjwt } = req.headers;
      // playerjwt gives only the PlayerId

      const entity = await Lobby.create({
        name,
        storyTitle: title,
        player1: toData(playerjwt).playerId,
        storyDescription: description,
        status: "waiting"
      });

      //username = await // sending new entity with extra information about username player1 & 2

      // Update the string for the stream
      await update();

      updateStream(entity);

      res.status(201);

      res.send(entity);
    } catch (error) {
      console.log("error", error);
    }
  });

// Edit Lobby
router.put("/lobbies/:id", async (req, res, next) => {
  try {
    const lobby = await Lobby.findByPk(req.params.id);

    if (lobby) {
      console.log("lobby existst");
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

      updateLobby[key] = toData(playerjwt).playerId;

      await lobby.update(updateLobby);
      const updated = await Lobby.findByPk(req.params.id, { include: [Text] });

      updateStream(updated);

      return res
        .status(200)
        .send({ message: "Player added succesfully to the lobby" });
    }

    res.status(429).send({ message: "This writing room does not exist" });
  } catch (error) {}
});

// Sends new texts to
router.post("/texts", (req, res, next) => {
  const { playerjwt } = req.headers;
  const { text, lobbyId } = req.body;
  Text.create({
    text: text,
    lobbyId: lobbyId,
    playerId: toData(playerjwt).playerId
  })
    .then(() => {
      return Text.findAll({
        where: { lobbyId: req.body.lobbyId }
      });
    })
    .then(text => {
      // After a text is send, the turn shifts
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
      return Lobby.findByPk(lobbyId, { include: [Text] }).then(updated => {
        console.log("Updated", updated);
        updateStream(updated);
      });

      // return Lobby.findByPk(lobbyId, { include: [Text] }).then(updated => {
      //   console.log("Updated", updated);
      //   updateStream(updated);
      // });

      res.json(text);
    })
    .catch(next);
});

// Edit - Stop a Game
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
