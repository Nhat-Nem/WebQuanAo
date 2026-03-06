const express = require('express')
const router = express.Router()
const controller = require('../controllers/order.controller')
const auth = require('../middlewares/authMiddleware')

router.post('/', auth,  controller.createOrder)
router.get('/my', auth, controller.getOrder)
router.get('/', auth, controller.getAllOrder)
router.get('/:id', auth, controller.getOrderById)
router.put('/:id', auth, controller.updateStatus)

module.exports = router