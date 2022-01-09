const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const scoreCtrl = require('../controllers/score')

router.get('/game/:game', scoreCtrl.getAllScores)
router.get('/:username', scoreCtrl.getUserScores)
router.post('/:username', auth, scoreCtrl.updateUserScore)

module.exports = router