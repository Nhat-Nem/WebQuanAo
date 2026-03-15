const express = require('express')
const router = express.Router()
const controller = require('../controllers/address.controller')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/', authMiddleware, controller.addAddress)
router.get('/', authMiddleware, controller.getAddresses)
router.delete('/:id',authMiddleware, controller.deleteAddress)
router.put('/:id', authMiddleware, controller.updateAddress)
module.exports = router