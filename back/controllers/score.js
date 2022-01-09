const Score = require('../schemas/score-schema')
const User = require('../schemas/user-schema')

exports.getAllScores = async (req, res, next) => {
  const scores = await Score.findAll({
    attributes: ['username', 'game', 'score'],
    raw: true
  })

  return res.status(200).json(scores)
}

exports.getUserScores = async (req, res, next) => {
  const scores = await Score.findAll({
    where: {
      username: req.params.username
    },
    raw: true
  })

  return res.status(200).json(scores)
}

exports.updateUserScore = async (req, res, next) => {
  const { game, score } = req?.body

  if (!game || isNaN(score)) {
    return res.status(400).json({ error: 'Bad request.', message: 'Bad request.' })
  }

  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  const existingScore = await Score.findOne({
    where: {
      username: req.params.username,
      game
    },
    raw: true
  })

  if (!existingScore) {
    try {
      await Score.build({
        userid: user.userid,
        username: user.username,
        game,
        score
      }).save()
    }
    catch {
      return res.status(500).json({ error: 'Error when saving score.', message: 'Error when saving score.' })
    }
  }
  else {
    if (existingScore.score < score) {
      try {
        await Score.update({ score }, {
          where: {
            username: req.params.username,
            game
          }
        })
      }
      catch {
        return res.status(500).json({ error: 'Error when saving score.', message: 'Error when saving score.' })
      }
    }
  }

  return res.status(200).json({ message: 'Score saved.' })
}