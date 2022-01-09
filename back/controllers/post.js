const fs = require('fs')
const cookie = require('cookie')
const Post = require('../schemas/post-schema')
const Upvote = require('../schemas/upvote-schema')
const Comment = require('../schemas/comment-schema')
const User = require('../schemas/user-schema')
const { getUserId } = require('../middleware/auth')

exports.getAllPosts = async (req, res, next) => {
  const posts = await Post.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 10,
    raw: true
  })
  if (!posts.length) {
    return res.status(404).json({ error: new Error('No post found.'), message: 'No post found.' })
  }
  return res.status(200).json(posts)
}

exports.getPost = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id
    },
    raw: true
  })
  if (!post) {
    return res.status(404).json({ error: new Error('Post not found.'), message: 'Post not found.' })
  }
  return res.status(200).json(post)
}

exports.getAllPostsOffset = async (req, res, next) => {
  const offset = +req.params.offset || 0
  const posts = await Post.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 10,
    offset,
    raw: true
  })
  return res.status(200).json(posts)
}

exports.createPost = async (req, res, next) => {
  const jsonPost = JSON.parse(req.body?.post)
  const { author, title, description } = jsonPost
  var media = req?.file?.filename

  if (!(author && title && (description || media))) {
    return res.status(400).json({ error: new Error('Bad request.'), message: 'Bad request.' })
  }

  if (media) {
    media = `${req.protocol}://${req.get('host')}/groupomania/media/post/${media}`
  }

  try {
    const post = await Post.build({
      author,
      title,
      description,
      media
    })
    const newPost = await post.save()
    await User.increment({
      nbPosts: 1
    },
    {
      where: {
        username: author
      }
    })
    return res.status(201).json({ postid: newPost.id, message: 'Post created.' })
  }
  catch(error) {
    return res.status(500).json({ error, message: error.message })
  }
}

exports.updatePost = async (req, res, next) => {
  const { author, title, description, media } = req.body

  const post = await Post.findOne({
    where: {
      id: req.params.id,
      author
    }
  })
  post.set({
    title,
    description,
    media
  })
  await post.save()
  return res.status(200).json({ message: 'Post updated.' })
}

exports.deletePost = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)

  const post = await Post.findOne({
    where: {
      id: req.params.id
    },
    raw: true
  })
  if (!post) {
    return res.status(404).json({ error: new Error('Post not found.'), message: 'Post not found.' })
  }

  const author = await User.findOne({
    where: {
      username: post.author
    },
    raw: true
  })

  const user = await User.findOne({
    where: {
      userid
    },
    raw: true
  })

  if (!user?.admin && userid !== author?.userid) {
    return res.status(403).json({ error: new Error('Unauthorized operation.'), message: 'Unauthorized operation.' })
  }
  try {
    var filename
    if (post.media) {
      filename = post.media.split('/media/post/')[1]
    }
    const nbUpvotes = await Upvote.count({
      where: {
        postid: req.params.id
      }
    })
    await Post.destroy({
      where: {
        id: req.params.id
      }
    })
    if (post.media) {
      fs.unlinkSync(`media/post/${filename}`)
    }
    await Comment.destroy({
      where: {
        postid: req.params.id
      }
    })
    await User.decrement({
      nbPosts: 1,
      nbUpvotes
    },
    {
      where: {
        username: author.username
      }
    })
  }
  catch {
    return res.status(500).json({ error: new Error('Error when deleting post'), message: 'Error when deleting post' })
  }
  return res.status(200).json({ message: 'Post deleted.' })
}