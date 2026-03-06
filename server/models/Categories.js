const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    slug: {type: String, required: true, unique: true},
    keywords: [{type: String}]
}, {timestamps: true})

module.exports = mongoose.model('Categories', CategoriesSchema)