const express = require('express')
const router = express.Router()
const controller = require('../controllers/banner.controller')
const auth = require('../middlewares/authMiddleware')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/banners')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.get("/", controller.getBanner)
router.post("/", auth, upload.single("image"), controller.addBanner)
router.put("/:id", auth, upload.single("image"), controller.editBanner)
router.delete("/:id", auth, controller.deleteBanner)
router.get("/active", controller.getActiveBanner)

module.exports = router