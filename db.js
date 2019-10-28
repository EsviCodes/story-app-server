const Sequelize = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgres://postgres:secret@localhost:5432/postgres`;

db = new Sequelize(databaseUrl);

db.sync({ force: false })
  .then(() => console.log("DB Running"))
  .catch(console.error);

module.exports = db;
