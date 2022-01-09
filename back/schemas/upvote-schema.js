const sequelize = require('sequelize')
const db = require('../utils/db')

const Upvote = db.define('Upvote', {
  userid: {
    type: sequelize.INTEGER,
    required: true
  },
  username: {
    type: sequelize.STRING,
    required: true
  },
  postid: {
    type: sequelize.INTEGER,
    required: true
  }
})

module.exports = Upvote