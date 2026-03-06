const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    phone: {type: String, required: true},
    isDefault: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = mongoose.model("Address", AddressSchema)