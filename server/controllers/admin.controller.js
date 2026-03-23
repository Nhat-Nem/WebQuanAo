const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/Users')

exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.find().select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
} 

exports.deleteUsers = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({message: "Xoá thành công"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments()
        const totalUser = await User.countDocuments()
        const totalOrder = await Order.countDocuments()

        const revenue = await Order.aggregate([
        {
            $match: { status: "completed" }
        },
        {
            $group: {
            _id: null,
            total: { $sum: "$totalPrice" }
            }
        }
        ])

        res.json({
            products: totalProducts,
            users:  totalUser,
            orders: totalOrder,
            revenue: revenue[0]?.total || 0
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getActivities = async (req, res) => {
    try {
        // lấy ít field thôi (nhẹ hơn)
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id createdAt')

        const users = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstname lastname username createdAt')

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name createdAt')

        // format activity 
        const orderActivities = orders.map(o => ({
            type: "order",
            message: `Đơn #${o._id.toString().slice(-6)} vừa được tạo`,
            createdAt: o.createdAt
        }))

        const userActivities = users.map(u => ({
            type: "user",
            message: `User ${u.firstname} ${u.lastname} (${u.username}) vừa đăng ký`,
            createdAt: u.createdAt
        }))

        const productActivities = products.map(p => ({
            type: "product",
            message: `Sản phẩm ${p.name} vừa được thêm`,
            createdAt: p.createdAt
        }))

        // merge
        const activities = [
            ...orderActivities,
            ...userActivities,
            ...productActivities
        ]

        // sort newest
        const sorted = activities.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        // trả về 10 cái 
        res.json(sorted.slice(0, 10))

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.revenureByMonth = async (req, res) => {
    try {
        const data = await Order.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        const formatted = data.map(item => ({
            month: `Tháng ${item._id}`,
            total: item.total
        }))

        res.json(formatted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.recentOrder = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstname lastname')

        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.updateRole = async (req, res) => {
    const { isAdmin } = req.body

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isAdmin },
        { returnDocument: "after" }
    )
    res.json(user)
}