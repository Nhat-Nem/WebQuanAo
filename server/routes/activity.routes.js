const express = require("express")
const router = express.Router()
const Users = require("../models/Users")

router.post("/", async (req, res) => {
    try {
        if (!req.user) return res.sendStatus(401)

        await Users.findByIdAndUpdate(req.user.id, {
            lastActivate: new Date()
        })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router