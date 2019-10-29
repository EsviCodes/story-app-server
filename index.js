const express = require("express");
const playerRouter = require("./players/player-router");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./auth/auth-router");
const authMiddleware = require("./auth/authMiddleware");

const app = express();
const port = process.env.PORT || 5000;
const jsonParser = bodyParser.json();

app
  .use(cors())
  .use(jsonParser)
  .use(playerRouter)
  .use(authRouter)
  .use(authMiddleware)
  .listen(port, () => console.log(`Listening to port ${port}`));
