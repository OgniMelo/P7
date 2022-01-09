const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const upvoteCtrl = require('../controllers/upvote')

router.get('/user/:username', upvoteCtrl.getUserUpvotes)
router.get('/post/:postid', upvoteCtrl.getPostUpvotes)
router.post('/add/:postid', auth, upvoteCtrl.addUserUpvote)
router.delete('/delete/:postid', auth, upvoteCtrl.deleteUserUpvote)

module.exports = router