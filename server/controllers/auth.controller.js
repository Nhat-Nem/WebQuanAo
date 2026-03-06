const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Users = require("../models/Users")

exports.register = async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body

    try {
        // kiem tra username co ton tai k
        const existusername = await Users.findOne({$or: [{username}, {email}]})
        if (existusername) {
            return res.status(400).json({message: "Username đã tồn tại"})
        }

        // ma hoa mat khau
        const hash = await bcrypt.hash(password, 10)

        // tao user moi
        const newUser = new Users({firstname, lastname, username, email, password: hash})

        await newUser.save()

        res.status(200).json({message: "Đăng kí thành công"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Lỗi server"})
    }   
}

exports.login =  async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await Users.findOne({username})

        if (!user) {
            return res.status(400).json({message: "Tên người dùng không tồn tại"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "Sai mật khẩu"})
        }
        
        const token = jwt.sign({id:user._id, isAdmin: user.isAdmin}, process.env.jwt, {expiresIn: "30d"})

        res.status(200).json({message: "Đăng nhập thành công", token})
        console.log("JWT key: ", process.env.jwt)
    } catch (error) {
        console.log('loi la: ',error)
        res.status(500).json({message: "Server error"})
    }
}