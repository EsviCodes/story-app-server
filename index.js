const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening to port ${port}`));
