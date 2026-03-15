const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const auth = require('../middlewares/authMiddleware')
const User = require('../models/Users')

router.post("/login", authController.login)
router.post("/register", authController.register)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("firstname lastname email isAdmin")

        res.json(user)
    } catch (error) {
        res.status(500).json({message: "Lỗi server"})
    }
})

router.post('/logout', authController.logout)
module.exports = router