const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Categories')

exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, sizes } = req.body

        const mainImage = req.files["image"]
            ? req.files["image"][0].filename
            : null

        const subImages = req.files["images"]
            ? req.files["images"].map(file => file.filename)
            : []

        const newProduct = new Product({
            name,
            price,
            category,
            image: mainImage,
            images: subImages,
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

        // update thông tin
        product.name = req.body.name
        product.price = req.body.price
        product.category = req.body.category

        if (req.body.sizes) {
            product.sizes = JSON.parse(req.body.sizes)
        }

        if (req.body.deletedImages) {

            const deletedImages = JSON.parse(req.body.deletedImages)

            deletedImages.forEach(img => {

                const imgPath = path.join(__dirname, "..", "public", "products", img)

                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath)
                }
            })

            product.images = product.images.filter(
                img => !deletedImages.includes(img)
            )
        }

        if (req.files && req.files["image"]) {

            const oldImg = path.join(__dirname, "..", "public", "products", product.image)

            if (product.image && fs.existsSync(oldImg)) {
                fs.unlinkSync(oldImg)
            }

            product.image = req.files["image"][0].filename
        }

        if (req.files && req.files["images"]) {

            const newImages = req.files["images"].map(file => file.filename)

            product.images = [
                ...(product.images || []),
                ...newImages
            ]
        }

        // save
        const updated = await product.save()

        const populated = await updated.populate("category")

        res.json(populated)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })

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