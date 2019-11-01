const { Router } = require("express");
const Place = require("./place-model");

const router = new Router();

//Get all Places
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

// Post Default Data
router.post("/places/default", (req, res, next) => {
  Place.bulkCreate([
    { place: "England" },
    { place: "a land Far Far Away" },
    { place: "the Future" },
    { place: "a Forest" },
    { place: "the Rainbow" },
    { place: "a Volcano" },
    { place: "the Deep Sea" },
    { place: "a House on the Prairie" },
    { place: "Jane Austen's Home" },
    { place: "an academy called Codaisseur" }
  ])
    .then(() =>
      res.status(201).send({ message: "Place Data created succesfully" })
    )
    .catch(next);
});

module.exports = router;
