const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Categories')

exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, sizes } = req.body

        const newProduct = new Product({
            name,
            price,
            category,
            image: req.file.filename,
            sizes: JSON.parse(sizes) 
        })

        await newProduct.save()
        res.status(201).json(newProduct)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.getProduct = async (req, res) => {
    try {
        const search = req.query.search || ""

        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const products = await Product.find()
            .populate("category")

        const filtered = products.filter(product => {

            const nameMatch = product.name
                .toLowerCase()
                .includes(search.toLowerCase())

            const keywordMatch = product.category?.keywords?.some(keyword =>
                keyword.toLowerCase().includes(search.toLowerCase())
            )

            return nameMatch || keywordMatch
        })

        const total = filtered.length

        const paginated = filtered.slice(skip, skip + limit)

        res.json({
            products: paginated,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({message: "Không tìm thấy sản phẩm này"})
        }

        const imgPath = path.join(__dirname, "..", "public", "products", product.image)

        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath)
        }

        await Product.findByIdAndDelete(req.params.id)
        res.json({message: "Xoá thành công"})
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
        }

        product.name = req.body.name
        product.price = req.body.price
        product.category = req.body.category

        if (req.body.sizes) {
            product.sizes = JSON.parse(req.body.sizes)
        }

        // xử lý ảnh nếu có upload ảnh mới
        if (req.file) {
            const oldImg = path.join(__dirname, '../public/products', product.image)

            if (fs.existsSync(oldImg)) {
                fs.unlinkSync(oldImg)
            }

            product.image = req.file.filename
        }

        const updated = await product.save()
        const populated = await updated.populate("category")

        res.json(populated)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProductByCate = async (req, res) => {
    try {
        const slug = req.params.slug

        const page = parseInt(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const products = await Product.find()
            .populate("category")

        const filtered = products.filter(p => 
            p.category?.slug === slug
        )

        const total = filtered.length

        const paginated = filtered.slice(skip, skip + limit)

        res.json({
            products: paginated,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        const related = await Product.find({
            category: product.category,
            _id: { $ne: id }
        }).limit(10)

        res.json(related)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}