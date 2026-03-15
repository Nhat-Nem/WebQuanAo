const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Users = require("../models/Users")
const axios = require('axios')
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_KEY)

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

exports.login = async (req, res) => {

    const { username, password } = req.body

    try {

        const user = await Users.findOne({ username })

        if (!user) {
            return res.status(400).json({ message: "Tên người dùng không tồn tại" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" })
        }

        // lấy IP để xác định country
        let ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress

        // test localhost
        if (ip === "::1" || ip === "127.0.0.1") {
            ip = "8.8.8.8"
        }

        let country = "Unknown"
        let city = "Unknown"

        try {
            const geo = await axios.get(`https://ipwho.is/${ip}`)

            if (geo.data.success) {
                country = geo.data.country
                city = geo.data.city
            }

        } catch (err) {
            console.log("Không lấy được location:", err.message)
        }

        user.country = country
        user.city = city
        await user.save()

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.jwt,
            { expiresIn: "30d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({message: "Đăng nhập thành công"})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.forgotPassword = async (req, res) => {

    const { email } = req.body

    try {

        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "Mail không tồn tại" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")

        user.resetPasswordToken = hashedToken

        user.resetPasswordToken = resetToken
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000

        await user.save()

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Reset Password",
            html: `
                <h3>Reset Password</h3>
                <p>Click link để reset:</p>
                <a href="${resetUrl}">${resetUrl}</a>
            `
        })

        res.json({ message: "Đã gửi mail reset" })

    } catch (error) {

        console.log(error)
        res.status(500).json({ message: "Lỗi server" })

    }
}

exports.resetPassword = async (req, res) => {

    const { token } = req.params
    const { password } = req.body

    try {

        const user = await Users.findOne({ resetPasswordToken: token })

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ" })
        }

        if (user.resetPasswordExpire < Date.now()) {
            return res.status(400).json({ message: "Token đã hết hạn" })
        }

        const hash = await bcrypt.hash(password, 10)

        user.password = hash
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        res.json({ message: "Đổi mật khẩu thành công" })

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.logout = (req, res) => {
    res.clearCookie("token")
    res.json({message: "Đăng xuất thành công"})
}