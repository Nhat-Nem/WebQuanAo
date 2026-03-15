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
