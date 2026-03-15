const mongoose = require("mongoose")
const connectDB = require("./config/db") // sửa đúng path của bạn
const Product = require("./models/Product")

// 1️⃣ connect database trước
require("dotenv").config()
connectDB()

const addProduct = async () => {
    try {
        const product = new Product({
            name: "Áo thun basic",
            price: 199000,
            description: "Áo cotton",
            image: "example.jpg",
            sizes: [
                { size: "S", stock: 10 },
                { size: "M", stock: 5 },
                { size: "L", stock: 2 }
            ]
        })

        await product.save()
        console.log("Product added successfully")
        process.exit()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

addProduct()