const sequelize = require('sequelize')
const db = require('../utils/db')

const mailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const User = db.define('Users', {
  userid: {
    type: sequelize.INTEGER,
    primaryKey: true,
    required: true,
    unique: true,
    autoIncrement: true
  },
  email: {
    type: sequelize.STRING,
    required: true,
    unique: true,
    validate: {
      is: mailRegex,
      isEmail: true
    }
  },
  username: {
    type: sequelize.STRING,
    required: true,
    unique: true
  },
  password: {
    type: sequelize.STRING,
    required: true
  },
  firstName: {
    type: sequelize.STRING,
    required: true
  },
  lastName: {
    type: sequelize.STRING,
    required: true
  },
  pfp: {
    type: sequelize.STRING,
    required: true
  },
  nbPosts: {
    type: sequelize.INTEGER,
    required: true,
    defaultValue: 0
  },
  nbUpvotes: {
    type: sequelize.INTEGER,
    required: true,
    defaultValue: 0
  },
  admin: {
    type: sequelize.BOOLEAN,
    required: true,
    defaultValue: false
  }
})

module.exports = User