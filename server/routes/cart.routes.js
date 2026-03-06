const express = require('express')
const router = express.Router()
const controller = require('../controllers/cart.controller')
const auth = require('../middlewares/authMiddleware')

router.post('/', auth, controller.addtoCart)
router.get('/', auth, controller.getCart)
router.delete('/remove/:id', auth, controller.deleteCartProduct)
router.put('/', auth, controller.updateCart)
router.delete('/clear', auth, controller.clearCart)

module.exports = router