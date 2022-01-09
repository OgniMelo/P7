const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')

router.post('/register', authCtrl.userRegister)
router.post('/login', authCtrl.userLogin)
router.get('/logout', authCtrl.userLogout)
// Reset
router.post('/reset', authCtrl.requestPasswordReset)
router.patch('/reset', authCtrl.resetPassword)

module.exports = router