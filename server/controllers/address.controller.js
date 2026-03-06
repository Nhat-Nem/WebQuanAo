const Address = require('../models/Address')

exports.addAddress = async (req, res) => {
    try {
        const {firstName, lastName, address, city, phone, isDefault } = req.body

        if (isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { $set: { isDefault: false } }
            )
        }

        const newAddress = new Address({
            user: req.user.id, firstName, lastName, address, city, phone, isDefault
        })

        await newAddress.save()

        res.status(200).json({message: "Thêm địa chỉ thành công", data: newAddress})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id })
        res.status(200).json(addresses)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if (!address) {
            return res.status(400).json({ message: "Không tìm thấy địa chỉ" })
        }

        const wasDefault = address.isDefault

        // Xoá địa chỉ
        await Address.findByIdAndDelete(req.params.id)

        // Nếu địa chỉ bị xoá là default
        if (wasDefault) {
            // Lấy địa chỉ cũ nhất còn lại
            const oldestAddress = await Address.findOne({ user: req.user.id })
                .sort({ createdAt: 1 })

            if (oldestAddress) {
                oldestAddress.isDefault = true
                await oldestAddress.save()
            }
        }

        res.json({ message: "Xoá thành công" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const { isDefault } = req.body
        const diachi = await Address.findById(req.params.id)

        if (isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { $set: { isDefault: false } }
            )
        }

        // check dia chi có thấy k
        if (!diachi) {
            return res.status(400).json({message: "Không tìm thấy id"})
        }

        // check id user có trung id dia chi cua user đó k
        if (diachi.user.toString() !== req.user.id) {
            return res.status(403).json({message: "Không có quyền chỉnh sửa địa chỉ này này"})
        } 

        diachi.firstName = req.body.firstName
        diachi.lastName = req.body.lastName
        diachi.address = req.body.address
        diachi.city = req.body.city
        diachi.phone = req.body.phone
        diachi.isDefault = req.body.isDefault

        await diachi.save()
        res.json({message: "Cập nhật địa chỉ thành công", data: diachi})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}