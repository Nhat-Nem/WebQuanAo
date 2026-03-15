const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const controller = require('../controllers/user.controller')
const checkAdmin = require('../middlewares/checkAdmin')

router.get('/me', authMiddleware, controller.getInfor)

module.exports = router