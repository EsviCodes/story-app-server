const Sequelize = require("sequelize");
const db = require("../db");

// In this app, a lobby is a writing room where to writers (players) can join to write a story together

const Lobby = db.define(
  "lobby",
  {
    name: Sequelize.STRING, // Name of the writing room
    player1: Sequelize.INTEGER, // Shows the player's ID
    player2: Sequelize.INTEGER, // Shows the player's ID
    // Shows who's turn it is to post a new sentence to the story
    turnToPlay: {
      type: Sequelize.INTEGER, // 1 || 2, referring to player1 or player2
      defaultValue: 1,
      validate: { isIn: [[1, 2]] }
    },
    storyTitle: Sequelize.STRING, // Title of the story
    storyDescription: Sequelize.TEXT, // Opening sentence of the story
    status: Sequelize.STRING // Waiting || Writing || End
  },

  {
    tableName: "lobby"
  }
);

module.exports = Lobby;

// turn
//toggle
