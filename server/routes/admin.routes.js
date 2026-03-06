const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.get('/stats', adminController.getStats)
router.get('/revenue-by-month', adminController.revenureByMonth)
router.get('/recent-orders', adminController.recentOrder)
router.get('/users', adminController.getAllUsers)
router.delete('/user/:id', adminController.deleteUsers)
module.exports = router