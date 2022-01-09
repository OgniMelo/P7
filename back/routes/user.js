const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config-pfp')
const userCtrl = require('../controllers/user')

router.get('/', userCtrl.getAllUsers)
router.get('/:username', userCtrl.getUser)
router.post('/:username', auth, multer, userCtrl.updateUser)
router.delete('/:username', auth, userCtrl.deleteUser)

module.exports = router