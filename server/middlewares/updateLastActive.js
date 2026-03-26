const Users = require('../models/Users')

const updateLastActive = async (req, res, next) => {
    try {
        if (req.user) {
            const now = Date.now()

            if (!req.user.lastActivate || now - new Date(req.user.lastActivate) > 30000) {
                await Users.findByIdAndUpdate(req.user.id, {
                    lastActivate: new Date()
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}