const express = require('express')
const auth = require('../middleware/auth')
const controller = require('../controllers/auth')

const router = express.Router()

router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/me', auth, controller.me)
router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password', controller.resetPassword)

module.exports = router
