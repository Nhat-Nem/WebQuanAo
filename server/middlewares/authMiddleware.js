const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: "Không có token"})
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message: "Token không hợp lệ"})
    }
}

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Chưa đăng nhập" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.jwt)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ" })
    }
}