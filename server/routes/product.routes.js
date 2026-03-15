const express = require('express')
const router = express.Router()
const controller = require('../controllers/product.controller')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/products')
    }, filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/category/:slug', controller.getProductByCate)
router.get("/:id", controller.getProductById)
router.post('/', upload.fields([
    {name: "image", maxCount: 1},
    {name: "images", maxCount: 10}
]), controller.createProduct)
router.get('/', controller.getProduct)
router.delete('/:id', controller.deleteProducts)
router.put('/:id', upload.fields([
    {name: "image", maxCount: 1},
    {name: "images", maxCount: 10}
]), controller.updateProduct)
router.get('/related/:id', controller.getRelatedProducts)
module.exports = router