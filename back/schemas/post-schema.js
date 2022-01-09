const sequelize = require('sequelize')
const db = require('../utils/db')

const Post = db.define('Posts', {
  author: {
    type: sequelize.STRING,
    required: true
  },
  title: {
    type: sequelize.STRING,
    required: true
  },
  description: {
    type: sequelize.TEXT,
  },
  media: {
    type: sequelize.STRING,
  }
})

module.exports = Post