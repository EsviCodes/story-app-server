const { Router } = require("express");
const Place = require("./place-model");

const router = new Router();

// Get all Places
router.get("/places", (req, res, next) => {
  Place.findAll()
    .then(places => {
      res.send(places);
    })
    .catch(next);
});

// Get one Place
router.get("/places/:id", (req, res, next) => {
  Place.findByPk(req.params.id)
    .then(place => {
      res.send(place);
    })
    .catch(next);
});

module.exports = router;
