const sequelize = require('sequelize')
const db = require('../utils/db')

const Score = db.define('Scores', {
  userid: {
    type: sequelize.INTEGER,
    required: true,
  },
  username: {
    type: sequelize.STRING,
    required: true,
  },
  game: {
    type: sequelize.STRING,
    required: true
  },
  score: {
    type: sequelize.INTEGER,
    required: true,
    defaultValue: 0
  },
})

module.exports = Score