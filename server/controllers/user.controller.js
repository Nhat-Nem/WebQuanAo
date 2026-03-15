const Users = require('../models/Users')

exports.getInfor = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        res.status(500).json({message: "Lỗi server"})
    }
}