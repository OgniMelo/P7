const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config-post')
const postCtrl = require('../controllers/post')

router.get('/', postCtrl.getAllPosts)
router.get('/:id', postCtrl.getPost)
router.get('/offset/:offset', postCtrl.getAllPostsOffset)
router.post('/', auth, multer, postCtrl.createPost)
router.post('/:id', auth, multer, postCtrl.updatePost)
router.delete('/:id', auth, postCtrl.deletePost)

module.exports = router