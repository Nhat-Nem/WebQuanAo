const express = require('express')
const router = express.Router()
const Category = require('../models/Categories')

router.get('/', async(req, res) => {
    const categories = await Category.find()
    res.json(categories)
})

module.exports = router