const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Users = require("../models/Users")
const axios = require('axios')
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const { Resend } = require("resend")
const validator = require("validator")

const resend = new Resend(process.env.RESEND_KEY)

exports.register = async (req, res) => {
    let {firstname, lastname, username, email, password} = req.body

    try {
        email = email?.toLowerCase().trim()

        const errors = {}

        // validate email
        if (!email || !validator.isEmail(email)) {
            errors.email = "Email không hợp lệ"
        }

        // validate password
        if (!password || !validator.isLength(password, {min: 6})) {
            errors.password = "Password phải ít nhất 6 ký tự"
        }

        // validate firstname
        if (!firstname || !validator.isLength(firstname.trim(), { min: 2 })) {
            errors.firstname = "Firstname tối thiểu 2 ký tự"
        } else if (!validator.isAlpha(firstname.replace(/\s/g, ""), "vi-VN")) {
            errors.firstname = "Firstname không hợp lệ"
        }

        // validate lastname
        if (!lastname || !validator.isLength(lastname.trim(), { min: 2 })) {
            errors.lastname = "Lastname tối thiểu 2 ký tự"
        } else if (!validator.isAlpha(lastname.replace(/\s/g, ""), "vi-VN")) {
            errors.lastname = "Lastname không hợp lệ"
        }


        const isSpamName = (name) => {
            const cleaned = name.toLowerCase().replace(/\s/g, "")
            return /(.)\1{3,}/.test(cleaned) // aaaa
        }

        if (isSpamName(firstname)) {
            errors.firstname = "Firstname không hợp lệ"
        }

        if (isSpamName(lastname)) {
            errors.lastname = "Lastname không hợp lệ"
        }

        // validate username
        if (!username || !validator.isLength(username, {min: 3})) {
            errors.username = "Username tối thiểu 3 ký tự"
        }

        // check trùng (chỉ khi không lỗi format)
        if (!errors.username) {
            const existUsername = await Users.findOne({ username })
            if (existUsername) {
                errors.username = "Username đã tồn tại"
            }
        }

        if (!errors.email) {
            const existEmail = await Users.findOne({ email })
            if (existEmail) {
                errors.email = "Email đã tồn tại"
            }
        }

        // all error
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors })
        }

        const hash = await bcrypt.hash(password, 10)

        const newUser = new Users({
            firstname, lastname, username, email, password: hash
        })

        await newUser.save()

        res.status(200).json({message: "Đăng kí thành công"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Lỗi server"})
    }   
}

exports.checkExist = async (req, res) => {
    try {
        const { username, email } = req.query

        const result = {}

        if (username) {
            const exist = await Users.findOne({ username })
            result.username = !!exist
        }

        if (email) {
            const exist = await Users.findOne({ email })
            result.email = !!exist
        }

        res.json(result)
    } catch (error) {
        return res.status(400).json({messsage: error.message})
    }
}

exports.login = async (req, res) => {

    const { username, password, rememberMe } = req.body

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
        user.lastActivate = new Date()
        await user.save()

        const day = rememberMe ? 30 : 3

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.jwt,
            { expiresIn: `${day}d` }
        )

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: day * 24 * 60 * 60 * 1000
        // })

        res.status(200).json({message: "Đăng nhập thành công", token})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.forgotPassword = async (req, res) => {

    const { email } = req.body

    try {
        email = email?.toLowerCase().trim()

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({message: "Email không hợp lệ"})
        }


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

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000

        await user.save()

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

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
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await Users.findOne({ resetPasswordToken: hashedToken })

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
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.json({message: "Đăng xuất thành công"})
}