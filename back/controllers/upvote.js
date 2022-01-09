const cookie = require('cookie')
const Upvote = require('../schemas/upvote-schema')
const User = require('../schemas/user-schema')
const { getUserId } = require('../middleware/auth')

exports.getUserUpvotes = async (req, res, next) => {
  const upvotes = await Upvote.findAll({
    attributes: ['postid'],
    where: {
      username: req.params.username
    },
    raw: true
  })
  return res.status(200).json(upvotes)
}

exports.getPostUpvotes = async (req, res, next) => {
  const upvotes = await Upvote.count({
    where: {
      postid: req.params.postid
    }
  })
  return res.status(200).json(upvotes)
}

exports.addUserUpvote = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)
  const { author } = req?.body

  const user = await User.findOne({
    where: {
      userid
    },
    raw: true
  })

  const upvote = await Upvote.build({
    userid,
    username: user.username,
    postid: req.params.postid
  })
  await upvote.save()
  await User.increment({
    nbUpvotes: 1
  },
  {
    where: {
      username: author
    }
  })
  return res.status(200).end()
}

exports.deleteUserUpvote = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)
  const { author } = req?.body

  await Upvote.destroy({
    where: {
      userid,
      postid: req.params.postid
    }
  })
  await User.decrement({
    nbUpvotes: 1
  },
  {
    where: {
      username: author
    }
  })
  return res.status(200).end()
}