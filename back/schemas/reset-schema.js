const sequelize = require('sequelize')
const db = require('../utils/db')

const Reset = db.define('Reset', {
  userid: {
    type: sequelize.INTEGER,
    primaryKey: true,
    required: true,
    unique: true
  },
  token: {
    type: sequelize.STRING,
    required: true
  },
  expires: {
    type: sequelize.DATE,
    required: true
  }
})

module.exports = Reset