require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/db')
const productRoutes = require("./routes/product.routes")
const cookieParser = require('cookie-parser')

const app = express()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: [
    "http://localhost:5173",
    "http://localhost:5174"
], credentials: true }))

// public
app.use('/public', express.static('public'))

//connect db
connectDB()

app.get("/", (req,res) => {
    res.send("API Running")
})

//prod
app.use("/api/products", productRoutes)

//anh prod
app.use("/products", express.static("public/products"))

//auth
const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes)

//cate
app.use('/api/categories', require('./routes/categories.routes'))

// etst
app.use("/api/users", require("./routes/user.routes"))

// address
const addressRoutes = require("./routes/address.routes");
app.use("/api/address", addressRoutes);

// admin
const adminRoutes = require('./routes/admin.routes')
app.use('/api/admin', adminRoutes)

// cart
const cartroutes = require('./routes/cart.routes')
app.use('/api/cart', cartroutes)

//order
const orderroutes = require('./routes/order.routes')
app.use('/api/order', orderroutes)

//banner
const bannerroutes = require('./routes/banner.routes')
app.use('/api/banner', bannerroutes)

//listen
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})