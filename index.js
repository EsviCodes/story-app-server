const express = require("express");
const playerRouter = require("./players/player-router");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
const jsonParser = bodyParser.json();

app
  .use(cors())
  .use(jsonParser)
  .use(playerRouter)
  .listen(port, () => console.log(`Listening to port ${port}`));
