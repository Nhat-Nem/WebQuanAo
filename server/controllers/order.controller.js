const Cart = require('../models/Cart')
const Order = require('../models/Order')

exports.getAllOrder = async (req, res) => {
    try {
        const order = await Order.find()
            .populate('user', 'firstname lastname email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
        res.json(order)
    } catch (err) {
        res.status(500).json({message: "error.message"})
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { items, totalPrice, address, paymentMethod } = req.body

        const order = new Order({
            user: req.user.id,
            items,
            totalPrice,
            address,
            paymentMethod
        })

        await order.save()

        await Cart.updateOne(
            { user: req.user.id },
            { $set: { items: [] } }
        )

        res.status(201).json({message: "Đặt hàng thành công", order})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Lỗi server"})
    }
}

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.find({user: req.user.id}).populate('items.product', 'name image').sort({createdAt: -1})
        res.json(order)
    } catch (error) {
        console.log(error)
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({message: "Không tìm thấy đơn hàng"})
        }

        // khong cho sua neu hoan thanh
        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.status(400).json({message: "Không thể cập nhật đơn này"})
        }

        order.status = status

        await order.save()

        const updated = await Order.findById(order._id).populate('user', 'email').populate('items.product', 'name')

        res.json(updated)
    } catch (error) {
        console.log("Lỗi server")
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById().populate('user', 'email').populate('items.product', 'name image')
        if (!order) {
            return res.status(404).json({message: "Không tìm thấy đơn hàng"})
        }

        res.json(order)
    } catch (error) {
        console.log(error)
    }
}