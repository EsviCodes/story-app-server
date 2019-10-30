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

module.exports = router;
