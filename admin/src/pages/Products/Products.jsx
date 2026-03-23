import { useEffect, useState } from 'react';
import api from '../../services/api'
import './Products.css'
import { toast } from 'react-toastify'
import Pagination from '../../components/Panigation/Panigation';
import '../../components/Panigation/Panigation.css'
import Swal from 'sweetalert2';

const defaultForm = () => ({
        name: "",
        price: "",
        category: "",
        image: "",
        images: [],
        sizes: [
            { size: "S", stock: 0 },
            { size: "M", stock: 0 },
            { size: "L", stock: 0 }
        ]
    })

function Products() {

    const [deletedImages, setDeletedImages] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")
    const [filcategory, setFilCategory] = useState("")
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState(defaultForm())

    useEffect(() => {
        api.get(`/products?page=${page}`)
        .then(res =>  { 
            setProducts(res.data.products) 
            setTotalPages(res.data.totalPages) } )
        .catch((error) => console.log(error))

        api.get("/categories").then(res => setCategories(res.data)).catch((error) => console.log(error))
    }, [page])

    useEffect(() => {
        //nếu modal mở có thể ấn "esc" de thoát form
        if (!showModal) return;
        const handleKeydown = async (e) => {
            if (e.key == "Escape") {
                setShowModal(false)
                setImagePreview(null)
                setFormData(defaultForm())
            }
        }

        window.addEventListener("keydown", handleKeydown)
        return () => {
            window.removeEventListener("keydown", handleKeydown)
        }
    }, [showModal])

    useEffect(() => {
        document.title = 'Quản lý sản phẩm - Admin'
    }, [])

    const deleteProd = async (id) => {
        const result = await Swal.fire({
            title: "Xoá sản phẩm?",
            text: "Sản phẩm này sẽ bị xoá vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xoá",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            await api.delete(`/products/${id}`)
            setProducts(products.filter(product => product._id != id))
            toast.success('Xoá sản phẩm thành công')
        } catch (error) {
            console.log(error)
            toast.error('Xoá sản phẩm thất bại')
        }
    }

    const handleChange = (e) => {

        if (e.target.name === 'image') {
            const file = e.target.files[0]
            setFormData({ ...formData, image: file })

            if (file) {
                setImagePreview(URL.createObjectURL(file))
            }
        }

        else if (e.target.name === 'images') {
            const newFiles = Array.from(e.target.files)

            setFormData({
                ...formData,
                images: [...formData.images, ...newFiles]
            })

            e.target.value = null
        }

        else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const filterProduct = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(search.toLowerCase())
        const matchCate = filcategory ? product.category?._id === filcategory : true
        return matchName && matchCate
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData()

            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("sizes", JSON.stringify(formData.sizes))
            data.append("category", formData.category)

            data.append("image", formData.image)
            
            // ảnh phụ
            for (let i = 0; i < formData.images.length; i++) {
                data.append("images", formData.images[i])
            }

            const res = await api.post('/products', data)

            setPage(1)
            setProducts([...products, res.data])
            setShowModal(false)

            setFormData(defaultForm())
            setImagePreview(null)

            toast.success("Thêm sản phẩm thành công")
        } catch (error) {
            console.log(error)
            toast.error("Thêm sản phẩm thất bại")
        }
    }

    const handleEdit = (product) => {
        setDeletedImages([])

        setFormData({
            _id: product._id,
            name: product.name,
            price: product.price,
            sizes: product.sizes,
            category: product.category?._id,
            image: product.image,
            images: product.images || []
        })

        setImagePreview(`http://localhost:5050/products/${product.image}`)
        setShowEdit(true)
    }

    const handleEdited = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("sizes", JSON.stringify(formData.sizes))
            data.append("category", formData.category)
            // ảnh phụ
            for (let i = 0; i < formData.images.length; i++) {
                if (formData.images[i] instanceof File) {
                    data.append("images", formData.images[i])
                }
            }

            if (formData.image instanceof File) {
                data.append("image", formData.image)
            }

            data.append('deletedImages', JSON.stringify(deletedImages))

            const res = await api.put(`/products/${formData._id}`, data)

            setProducts(products.map(p => 
                p._id === formData._id ? res.data : p
            ))
        
            setFormData(defaultForm())
            setShowEdit(false)
            setImagePreview(null)

            toast.success("Cập nhật sản phẩm thành công!")
        } catch (error) {
            console.log(error)
            toast.error("Cập nhật sản phẩm thất bại")
        }
    }

    return (
        <>
            <div className="products-container">
                <div className="header">
                    <h2>Quản lý sản phẩm</h2>

                    <div className="filters">
                        <input type="text" placeholder='Tìm sản phẩm...' value={search} onChange={(e) => setSearch(e.target.value)}/>

                        <select value={filcategory} onChange={(e) => setFilCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}> {cat.name} </option>
                            ))}
                        </select>
                    </div>

                    <button className='add-btn' onClick={() => {setShowModal(true)}}>Add Product</button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hình ảnh</th>
                                <th>Tên</th>
                                <th>Giá tiền</th>
                                <th>Số lượng</th>
                                <th>Danh mục</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filterProduct.map((product, index) => (
                                <tr key = {product._id}>
                                    <td> {(page - 1) * 20 + index + 1} </td>
                                    <td><img src={`http://localhost:5050/products/${product.image}`} alt={product.name} className='product-img'/></td>
                                    <td>{product.name}</td>
                                    <td>{(product.price).toLocaleString('vi-VN')}₫</td>
                                    <td>
                                        {product.sizes?.map((s, index) => (
                                            <div key={index}>
                                            {s.size}: {s.stock}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{product.category?.name}</td>
                                    <td>
                                        <button className='action-btn' onClick={() => handleEdit(product)}>Edit</button>
                                        <button className='action-btn' onClick={() => deleteProd(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                    <p className="product-count">
                        Showing {(page - 1) * 20 + 1} - {(page - 1) * 20 + filterProduct.length} trong tổng {products.length} sản phẩm
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Product</h3>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            <input type="text" name='name' placeholder='Tên sản phẩm' value={formData.name} onChange={handleChange} required/>
                            <input type="text" name='price' placeholder='Giá sản phẩm' value={formData.price} onChange={handleChange} required/>
                            {formData.sizes.map((s, index) => (
                                <div key={index} className='size-row'>
                                    <label>{s.size}</label>
                                    <input
                                        type="number"
                                        value={s.stock}
                                        onChange={(e) => {
                                            const updatedSizes = [...formData.sizes]
                                            updatedSizes[index].stock = e.target.value
                                            setFormData({ ...formData, sizes: updatedSizes })
                                        }}
                                    />
                                </div>
                            ))}
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Chọn mục sản phẩm -- </option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <label>Ảnh chính</label>
                            <input type="file" name='image' onChange={handleChange} required/>
                            
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview}/>
                                </div>
                            )}

                            <label>Ảnh phụ</label>
                            <input type="file" name='images' multiple onChange={handleChange} />

                            {formData.images.length > 0 && (
                                <div className="image-grid">
                                    {formData.images.map((img, i) => (
                                        <div className="image-item" key={i}>
                                            <img src={img instanceof File ? URL.createObjectURL(img) : img} />

                                            <button type='button' className='remove-img' onClick={() => {
                                                const newImgs = [...formData.images]
                                                newImgs.splice(i, 1)
                                                setFormData({...formData, images: newImgs})
                                            }}>
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="button">
                                <button type='button' onClick={() => {setShowModal(false); setFormData(defaultForm()); setImagePreview(null)}}>Huỷ</button>
                                <button type='submit' onClick={() => setImagePreview(null)}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="edit-layout">
                    <div className="edit">
                        <h3>Edit Products</h3>
                        <hr />
                        <form onSubmit={handleEdited}>
                            {/* Ảnh hien tai product */}
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} />
                                </div>
                            )}

                            {/* button thay doi anh */}
                            <input type="file" name='image'onChange={handleChange} />
                            
                            {/* preview va edit anh phu */}
                            <label>Ảnh phụ</label>
                            <input type="file" name="images" multiple onChange={handleChange} />

                            {formData.images.length > 0 && (
                                <div className="image-grid">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="image-item">
                                            <img src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:5050/products/${img}`} />
                                            <button className='remove-img' type='button' onClick={() => {
                                                const imgToDelete = formData.images[i]
                                                const newImgs = [...formData.images]
                                                newImgs.splice(i, 1)
                                                setFormData({...formData, images: newImgs})

                                                if (!(imgToDelete instanceof File)) {
                                                    setDeletedImages([...deletedImages, imgToDelete])
                                                }
                                            }}>
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* cac gia tri con lai */}
                            <input type="text" name='name' value={formData.name} onChange={handleChange}/>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} />
                            {formData.sizes?.map((s, index) => (
                                <div className="size-row" key={index}>
                                    <div key={index}>
                                        <label>{s.size}</label>
                                        <input
                                        type="number"
                                        value={s.stock}
                                        onChange={(e) => {
                                            const updatedSizes = [...formData.sizes]
                                            updatedSizes[index].stock = e.target.value
                                            setFormData({ ...formData, sizes: updatedSizes })
                                        }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <div className="button">
                                <button type='button' onClick={() => {setShowEdit(false); setFormData(defaultForm()); setImagePreview(null)}}>Huỷ</button>
                                <button type='submit'>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}

export default Products;