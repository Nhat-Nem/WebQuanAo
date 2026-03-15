const Banner = require('../models/Banner')

exports.getBanner = async (req, res) => {
    try {
        const banner = await Banner.find().sort({ createdAt: -1 })
        res.json(banner)
    } catch (error) {
        res.status(500).json({message: "Lỗi server"})
    }
}

exports.addBanner = async (req, res) => {
    try {

        const banner = new Banner({
            title: req.body.title,
            link: req.body.link,
            active: req.body.active,
            image: req.file ? req.file.filename : null
        })

        await banner.save()

        res.json(banner)

    } catch (error) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

exports.editBanner = async (req, res) => {
    try {

        const updateData = {
            title: req.body.title,
            link: req.body.link,
            active: req.body.active
        }

        if (req.file) {
            updateData.image = req.file.filename
        }

        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: "after" }
        )

        res.json(banner)

    } catch (error) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id)
        res.json({ message: "Xoá thành công" })
    } catch (err) {
        res.status(500).json({ message: "Không thể xoá banner" })
    }
}

exports.getActiveBanner = async (req, res) => {
    try {

        const banner = await Banner.find({ active: true })
            .sort({ createdAt: -1 })

        res.json(banner)

    } catch (error) {
        res.status(500).json({message: "Lỗi server"})
    }
}