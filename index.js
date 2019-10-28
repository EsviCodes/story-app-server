const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authMiddleware = require("./auth/authMiddleware");

// Routers
const playerRouter = require("./players/player-router");
const authRouter = require("./auth/auth-router");
const lobbyRouter = require("./lobby/lobby-router");

const app = express();
const port = process.env.PORT || 5000;
const jsonParser = bodyParser.json();

app
  .use(cors())
  .use(jsonParser)
  .use(playerRouter) // sign up
  //.use(authRouter) // log in
  .use(lobbyRouter)

  //.use(authMiddleware)
  .listen(port, () => console.log(`Listening to port ${port}`));
