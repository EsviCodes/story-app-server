const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const authMiddleware = require("./auth/authMiddleware");

// Routers
const playerRouter = require("./players/player-router");
const authRouter = require("./auth/auth-router");
const lobbyRouter = require("./lobby/lobby-router");
const textRouter = require("./texts/text-router");
const characterRouter = require("./characters/character-router");
const placeRouter = require("./places/place-router");

const app = express();
const port = process.env.PORT || 5000;
const jsonParser = bodyParser.json();

app
  .use(cors())
  .use(jsonParser)
  .use(playerRouter) // sign up
  .use(authRouter) // log in
  //.use(authMiddleware)
  .use(lobbyRouter)
  .use(textRouter)
  .use(characterRouter)
  .use(placeRouter)
  .get("/", (req, res) => {
    res.status(200);
    res.send("Hello World");
  })
  .listen(port, () => console.log(`Listening to port ${port}`));
