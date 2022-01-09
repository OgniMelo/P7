const express = require('express')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')

const db = require('./utils/db')

function handleDisconnect() {
  db.authenticate().then(() => {
    console.log('Connected to db.')
    db.sync()
  })
  .catch(err => {
    console.error('Error when connecting to db : ' + err)
    setTimeout(handleDisconnect, 5000)
  })
}
handleDisconnect()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const upvoteRoutes = require('./routes/upvote')
const commentRoutes = require('./routes/comment')
const scoreRoutes = require('./routes/score')

const app = express()

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.REQ_HOST)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Custom-Headers, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use('/media', express.static(path.join(__dirname, 'media')))
app.use(express.static('media'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/upvote', upvoteRoutes)
app.use('/comment', commentRoutes)
app.use('/score', scoreRoutes)

module.exports = app