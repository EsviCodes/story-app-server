const { Router } = require("express");
const Verb = require("./verb-model");

const router = new Router();

// Get all verbs
router.get("/verbs", (req, res, next) => {
  Verb.findAll()
    .then(verbs => {
      res.send(verbs);
    })
    .catch(next);
});

// Get one Verb
router.get("/verbs/:id", (req, res, next) => {
  Verb.findByPk(req.params.id)
    .then(verb => {
      res.send(verb);
    })
    .catch(next);
});

router.post("/verbs/default", (req, res, next) => {
  Verb.bulkCreate([
    { verb: "love" },
    { verb: "save" },
    { verb: "decorate" },
    { verb: "program" },
    { verb: "travel" },
    { verb: "cuddle" },
    { verb: "create" },
    { verb: "seek" },
    { verb: "live" },
    { verb: "dream" }
  ])
    .then(() =>
      res.status(201).send({ message: "Verbs Data created succesfully" })
    )
    .catch(next);
});

module.exports = router;
