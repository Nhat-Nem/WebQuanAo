require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const connectDB = require("./config/db")
const User = require("../server/models/Users")

const createAdmin = async () => {
  await connectDB()

  const hashedPassword = await bcrypt.hash("123456", 10)

  await User.create({
    firstname: "Nguyễn",
    lastname: "Nam",
    username: "admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    isAdmin: true
  })

  console.log("Admin created")
  process.exit()
}

createAdmin()