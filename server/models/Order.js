const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity: Number,
        price: Number,
        size: String
    }],
    totalPrice: {type: Number, required: true},
    address: {type: String, required: true},
    paymentMethod: {type: String, enum: ['qr', 'cod'], required: true}, 
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)