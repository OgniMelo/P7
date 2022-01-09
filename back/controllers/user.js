const cookie = require('cookie')
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const { Op } = require('sequelize')
const User = require('../schemas/user-schema')
const Post = require('../schemas/post-schema')
const Comment = require('../schemas/comment-schema')
const Upvote = require('../schemas/upvote-schema')
const Score = require('../schemas/score-schema')
const { getUserId } = require('../middleware/auth')

exports.getAllUsers = async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['userid', 'username', 'firstName', 'lastName'],
    raw: true
  })
  if (!users.length) {
    return res.status(404).json({ error: new Error('Users not found.'), message: 'Users not found.' })
  }

  return res.status(200).json(users)
}

exports.getUser = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)

  const existingUser = await User.findOne({
    where: {
      username: req.params.username
    },
    raw: true
  })
  if (!existingUser) {
    return res.status(404).json({ error: new Error('User not found.'), message: 'User not found.' })
  }

  var user
  if (userid) {
    user = await User.findOne({
      where: {
        userid
      },
      raw: true
    })
  }

  const userToSend = {
    email: '',
    username: existingUser.username,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    pfp: existingUser.pfp,
    nbPosts: existingUser.nbPosts,
    nbUpvotes: existingUser.nbUpvotes,
    admin: existingUser.admin
  }

  if (!user?.admin && userid !== existingUser.userid) {
    return res.status(200).json(userToSend)
  }

  userToSend.email = existingUser.email
  return res.status(200).json(userToSend)
}

exports.updateUser = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)
  const jsonUser = JSON.parse(req.body?.user)
  const { email, username, password, firstName, lastName } = jsonUser
  var { admin } = jsonUser
  var pfp = req?.file?.filename
  var oldPfp

  if (pfp) {
    pfp = `${req.protocol}://${req.get('host')}/groupomania/media/pfp/${req.file.filename}`
  }

  const user = await User.findOne({
    where: {
      userid
    },
    raw: true
  })

  const userToModify = await User.findOne({
    where: {
      username: req.params.username
    },
    raw: true
  })
  oldPfp = user.pfp

  if (!(user || userToModify)) {
    return res.status(404).json({ error: new Error('User not found.'), message: 'User not found.' })
  }

  if (!user.admin && userid !== userToModify.userid) {
    return res.status(403).json({ error: new Error('Unauthorized operation.'), message: 'Unauthorized operation.' })
  }

  if (!user.admin) {
    admin = false
  }

  const existingUser = await User.findOne({
    where: {
      [Op.not]: [
        { userid: userToModify.userid }
      ],
      [Op.or]: [
        { email },
        { username }
      ]
    },
    raw: true
  })
  if (existingUser) {
    if (existingUser.email === userToModify.email) {
      return res.status(403).json({ error: new Error('Email address already registered.'), message: 'Email address already registered.' })
    }
    return res.status(403).json({ error: new Error('Username already in use.'), message: 'Username already in use.' })
  }

  try {
    if (password) {
      if (zxcvbn(password, [email, username, firstName, lastName]).score < 2) {
        return res.status(400).json({ error: new Error('Password security error.'), message: 'Password is not strong enough.' })
      }
      const hash = await bcrypt.hash(password, 10)
      await User.update({ email, password: hash, username, firstName, lastName, pfp }, {
        where: {
          userid: userToModify.userid
        }
      })
    }
    else {
      await User.update({ email, username, firstName, lastName, pfp, admin }, {
        where: {
          userid: userToModify.userid
        }
      })
    }
    if (username !== req.params.username) {
      await Post.update({ author: username }, {
        where: {
          author: req.params.username
        }
      })
      await Comment.update({ username }, {
        where: {
          username: req.params.username
        }
      })
      await Upvote.update({ username }, {
        where: {
          username: req.params.username
        }
      })
      await Score.update({ username }, {
        where: {
          username: req.params.username
        }
      })
    }
    if (pfp) {
      const filename = oldPfp.split('/media/pfp/')[1]
      if (filename !== 'ProfileImage.png') {
        fs.unlinkSync(`media/pfp/${filename}`)
      }
    }
  }
  catch {
    return res.status(500).json({ error: new Error('Error when updating user.'), message: 'Error when updating user.' })
  }

  const newUser = await User.findOne({
    where: {
      userid: userToModify.userid
    },
    raw: true
  })
  return res.status(200).json({ user: newUser, message: 'User updated.' })
}

exports.deleteUser = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)

  const requestingUser = await User.findOne({
    where: {
      userid
    },
    raw: true
  })

  if (!requestingUser?.admin && requestingUser.username !== req.params.username) {
    return res.status(403).json({ error: new Error('Unauthorized operation.'), message: 'Unauthorized operation.' })
  }

  const userToDelete = await User.findOne({
    where: {
      username: req.params.username
    },
    raw: true
  })
  if (!userToDelete) {
    return res.status(404).json({ error: new Error('User not found.'), message: 'User not found.' })
  }
  try {
    const filename = userToDelete.pfp.split('/media/pfp/')[1]
    await User.destroy({
      where: {
        username: userToDelete.username
      }
    })
    if (filename !== 'ProfileImage.png') {
      fs.unlinkSync(`media/pfp/${filename}`)
    }
    await Post.destroy({
      where: {
        author: userToDelete.username
      }
    })
    await Comment.destroy({
      where: {
        username: userToDelete.username
      }
    })
    await Upvote.destroy({
      where: {
        username: userToDelete.username
      }
    })
    await Score.destroy({
      where: {
        username: userToDelete.username
      }
    })
  }
  catch {
    return res.status(500).json({ error: new Error('Error when deleting user.'), message: 'Error when deleting user.' })
  }
  return res.status(200).json({ message: 'User deleted.' })
}