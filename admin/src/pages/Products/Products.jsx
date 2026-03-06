import { useEffect, useState } from 'react';
import api from '../../services/api'
import './Products.css'

const defaultForm = () => ({
        name: "",
        price: "",
        category: "",
        image: "",
        sizes: [
            { size: "S", stock: 0 },
            { size: "M", stock: 0 },
            { size: "L", stock: 0 }
        ]
    })

function Products() {
    const [search, setSearch] = useState("")
    const [filcategory, setFilCategory] = useState("")
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState(defaultForm())

    useEffect(() => {
        api.get("/products").then(res => setProducts(res.data.products)).catch((error) => console.log(error))
        api.get("/categories").then(res => setCategories(res.data)).catch((error) => console.log(error))

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

    const deleteProd = async (id) => {
        const confirm = window.confirm("Bạn có chắc muốn xoá sản phẩm này không")

        if (!confirm) {
            return;
        }

        try {
            await api.delete(`/products/${id}`)
            setProducts(products.filter(product => product._id != id))
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = async (e) => {
        if (e.target.name == 'image') {
            const file = e.target.files[0]
            setFormData({...formData, image: file})

            if (file) {
                setImagePreview(URL.createObjectURL(file))
            }
        } else {
            setFormData({...formData, [e.target.name]: e.target.value})
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

            const res = await api.post('/products', data)
            setProducts([...products, res.data])
            setShowModal(false)

            setFormData(defaultForm())
            setImagePreview(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = (product) => {
        setFormData({
            _id: product._id,
            name: product.name,
            price: product.price,
            sizes: product.sizes,
            category: product.category?._id,
            image: product.image
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
            
            if (formData.image instanceof File) {
                data.append("image", formData.image)
            }

            const res = await api.put(`/products/${formData._id}`, data)

            setProducts(products.map(p => 
                p._id === formData._id ? res.data : p
            ))

            setFormData(defaultForm())
            setShowEdit(false)
            setImagePreview(null)
        } catch (error) {
            console.log(error)
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

                    <button className='add' onClick={() => {setShowModal(true)}}>Add Product</button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên</th>
                                <th>Giá tiền</th>
                                <th>Số lượng</th>
                                <th>Danh mục</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filterProduct.map(product => (
                                <tr key = {product._id}>
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
                            ))}
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Chọn mục sản phẩm -- </option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <input type="file" name='image' onChange={handleChange} required/>
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview}/>
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

                            {/* cac gia tri con lai */}
                            <input type="text" name='name' value={formData.name} onChange={handleChange}/>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} />
                            {formData.sizes?.map((s, index) => (
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