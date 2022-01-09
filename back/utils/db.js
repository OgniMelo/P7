const sequelize = require('sequelize')

module.exports = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_HOST,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})