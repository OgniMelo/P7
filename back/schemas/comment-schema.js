const sequelize = require('sequelize')
const db = require('../utils/db')

const Comment = db.define('Comment', {
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
  },
  text: {
    type: sequelize.TEXT,
    required: true
  }
})

module.exports = Comment