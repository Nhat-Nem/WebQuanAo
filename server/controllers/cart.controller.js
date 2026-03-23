const Cart = require('../models/Cart')
const auth = require('../middlewares/authMiddleware')

exports.addtoCart = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body
        let cart = await Cart.findOne({ user: req.user.id })

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] })
        }

        const exist = cart.items.find(item =>
            item.product.toString() === productId &&
            item.size === size
        )

        if (exist) {
            exist.quantity += quantity
        } else {
            cart.items.push({
                product: productId,
                quantity,
                size    
            })
        }

        await cart.save()

        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate("items.product")

        res.json(updatedCart)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server lỗi" })
    }
}

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user.id}).populate('items.product')

        if(!cart) {
            return res.json({items: []})
        }

        res.json({items: cart.items})
    } catch (error) {
        res.status(500).json({message: "Lỗi server"})
    }
}

exports.deleteCartProduct = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })

        cart.items = cart.items.filter(
            item => item._id.toString() !== req.params.id
        )

        await cart.save()

        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate('items.product')

        res.json(updatedCart)

    } catch (error) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

exports.updateCart = async (req, res) => {
    const {id, type} = req.body

    const cart = await Cart.findOne({user: req.user.id})

    const item = cart.items.id(id)

    if (!item) {
        return res.status(404).json({message: "không tìm thấy sản phẩm"})
    }

    if (type === 'increase') {
        item.quantity += 1
    }

    if (type === 'decrease' && item.quantity > 1) {
        item.quantity -= 1
    }

    await cart.save()
    const updatecart = await Cart.findOne({user: req.user.id}).populate('items.product')
    res.json(updatecart)
}

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user.id})

        if (!cart) {
            return res.json({message: "Cart đang trống"})
        }

        cart.items = []
        await cart.save()

        res.json(cart)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}