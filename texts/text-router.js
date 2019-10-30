const { Router } = require("express");
const Text = require("./text-model");
const Lobby = require("../lobby/lobby-model");
const { toData } = require("../auth/jwt");

const router = new Router();

// Get all Texts
router.get("/texts", (req, res, next) => {
  Text.findAll()
    .then(texts => {
      res.send(texts);
    })
    .catch(next);
});

// Get one text
router.get("/texts/:id", (req, res, next) => {
  Text.findByPk(req.params.id, { include: [Lobby] })
    .then(text => {
      res.send(text);
    })
    .catch(next);
});

//Create new Text
router.post("/texts", (req, res, next) => {
  const { playerjwt } = req.headers;
  const { text, lobbyId } = req.body;
  Text.create({
    text: text,
    lobbyId: lobbyId,
    playerId: toData(playerjwt).playerId
  })
    .then(text => res.json(text))
    .catch(next);
});

// Edit text
router.put("/texts/:id", (req, res, next) => {
  Text.findByPk(req.params.id)
    .then(text => {
      if (text) {
        text.update(req.body).then(text => res.json(text));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete Text
router.delete("/texts/:id", (req, res, next) => {
  Text.destroy({
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
