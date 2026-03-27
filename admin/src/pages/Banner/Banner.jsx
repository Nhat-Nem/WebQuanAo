import { useEffect, useState } from "react";
import api from "../../services/api";
import './Banner.css'
import { toast } from "react-toastify"
import Swal from "sweetalert2"

function Banner() {
    useEffect(() => {
        document.title = "Quản lý Banner - Admin"
    }, [])

    const [banner, setBanner] = useState([])
    const [preview, setPreview] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [image, setImage] = useState(null)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({
        title: "",
        link: "",
        active: true
    })

    const categories = [
        { name: "Áo", link: "/category/ao" },
        { name: "Áo khoác - Hoodie", link: "/category/ao-khoac" },
        { name: "Quần", link: "/category/quan" },
        { name: "Phụ kiện", link: "/category/phu-kien" },
    ]

    const fetchBanner = () => {
        api.get("/banner")
            .then(res => setBanner(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchBanner()
    }, [])
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value 
        })
    }

    const handleAdd = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("title", form.title)
        formData.append("link", form.link)
        formData.append("active", form.active)

        if (image) {
            formData.append("image", image)
        }

        try {

            if (editId) {
                await api.put(`/banner/${editId}`, formData)
                toast.success("Cập nhật banner thành công")
            } else {
                await api.post("/banner", formData)
                toast.success("Thêm banner thành công")
            }

            fetchBanner()   // load lại banner

            setShowForm(false)
            setEditId(null)

            setForm({
                title: "",
                link: "",
                active: true
            })

            setImage(null)
            setPreview(null)

        } catch (err) {
            console.log(err)
            toast.error("Có lỗi xảy ra")
        }
    }

    const getCategoryName = (link) => {
        const cat = categories.find(c => c.link === link)
        return cat ? cat.name : link
    }

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Xoá banner này?",
            text: "Bạn có chắc xoá banner này vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Đồng ý"
        })

        if (!result.isConfirmed) return

        try {

            await api.delete(`/banner/${id}`)

            fetchBanner()

        } catch (err) {
            console.log(err)
        }
    }

    const toggleActive = async (banner) => {
        try {

            await api.put(`/banner/${banner._id}`, {
                active: !banner.active
            })

            fetchBanner()

        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = (banner) => {

        setEditId(banner._id)

        setForm({
            title: banner.title,
            link: banner.link,
            active: banner.active
        })

        setPreview(`${import.meta.env.VITE_SERVER_STATIC}/public/banners/${banner.image}`)

        setShowForm(true)
    }

    return (
        <>
            <div className="banner-page">
                <div className="banner-header">
                    <h2>Quản lý banner</h2>
                    <button onClick={() => setShowForm(true)} > Add Banner </button>
                </div>

                <div className="banner-content">
                    
                    {showForm && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>{editId ? "Edit Banner" : "Add Banner"}</h3>

                                <form onSubmit={handleAdd}>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        value={form.title}
                                        onChange={handleChange}
                                    />

                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            setImage(file)
                                            setPreview(URL.createObjectURL(file))
                                        }}
                                    />

                                    {preview && (
                                        <>
                                            <img src={preview} width='150' style={{marginTop: "10px"}} />
                                        </>
                                    )}

                                    <select
                                        name="link"
                                        value={form.link}
                                        onChange={handleChange}>
                                        <option value="">Chọn trang</option>

                                        {categories.map((c, i) => (
                                            <option key={i} value={c.link}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-save" type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Link</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {banner.map((banner, i) => (
                                <tr key={banner._id}>
                                    <td> {i + 1} </td>

                                    <td>
                                        <img src={`${import.meta.env.VITE_SERVER_STATIC}/public/banners/${banner.image}`} width={"120"} />
                                    </td>

                                    <td> {banner.title} </td>

                                    <td>
                                        <div className="banner-link">
                                            {getCategoryName(banner.link)} 
                                        </div>
                                    </td>

                                    <td>
                                        <div className="status-toggle">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={banner.active}
                                                    onChange={() => toggleActive(banner)}
                                                />
                                                <span className="slider"></span>
                                            </label>

                                            <span className={banner.active ? "status-text on" : "status-text off"}>
                                                {banner.active ? "Active" : "Hidden"}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <button onClick={() => handleEditClick(banner)}>Edit</button>
                                        <button onClick={() => handleDelete(banner._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Banner;