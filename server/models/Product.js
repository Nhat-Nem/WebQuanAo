const mongoose = require('mongoose')

//
const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
})

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    image: {type: String},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Categories"},
    sizes: [sizeSchema]
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema)