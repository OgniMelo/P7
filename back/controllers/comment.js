const Comment = require('../schemas/comment-schema')

exports.getUserComments = async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      username: req.params.username
    },
    raw: true
  })
  return res.status(200).json(comments)
}

exports.getPostComments = async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      postid: req.params.postid
    },
    order: [
      ['createdAt', 'ASC']
    ],
    raw: true
  })
  return res.status(200).json(comments)
}

exports.postComment = async (req, res, next) => {
  const { userid, username, postid, text } = req?.body

  if (!(userid && username && postid && text)) {
    return res.status(400).json({ error: 'Bad request.', message: 'Bad request.' })
  }

  try {
    const comment = Comment.build({
      userid,
      username,
      postid,
      text
    })
    const newComment = await comment.save()
    return res.status(201).json({ newComment, message: 'Post created.' })
  }
  catch {
    return res.status(500).json({ error: 'Error when saving comment.', message: 'Error when saving comment.' })
  }
}

exports.deleteComment = async (req, res, next) => {
  const { postid } = req?.body

  if (!postid) {
    return res.status(400).json({ error: 'Bad request.', message: 'Bad request.' })
  }

  try {
    await Comment.destroy({
      where: {
        id: req.params.id,
        postid
      }
    })
  }
  catch {
    return res.status(500).json({ error: 'Error when deleting comment.', message: 'Error when deleting comment.' })
  }

  return res.status(200).json({ message: 'Commentaire supprimé.'})
}