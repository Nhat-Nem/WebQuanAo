import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import './ProductDetail.css'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

function ProductDetail({ setCart }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [mainImage, setMainImage] = useState("")
    const [selectedSize, setSelectedSize] = useState('S')
    const [related, setRelated] = useState([])

    useEffect(() => {
        api.get(`/products/related/${id}`).then(res => setRelated(res.data)).catch(err => console.log(err))
    }, [id])

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data)
                setMainImage(res.data.image)
                // đổi title    
                document.title = `${res.data.name} | SHOP`
            })
            .catch(err => console.log(err))

        window.scrollTo(0, 0)

    }, [id])

    const addtocart = async () => {
        try {
            await api.post('/cart', {
                productId: product._id,
                quantity: 1,
                size: selectedSize
            })

            const res = await api.get('/cart')
            setCart(res.data.items) 

        } catch (error) {
                console.log(error)
        }
    }
    
    const buyNow = async () => {
        try {
            // them vao cart
            await api.post('/cart', {
                productId: product._id,
                quantity: 1,
                size: selectedSize
            })

            // cap nhat cart global
            const res = await api.get('/cart')
            setCart(res.data.items)

            navigate('/checkout')
        } catch (error) {
            console.log(error)
        }
    }

    if (!product) return <h2>Loading...</h2>

    return (
        <>
            <div className="product-detail">

                {/* left */}
                <div className="detail-left">
                    <PhotoProvider>
                        <PhotoView src={`http://localhost:5050/products/${mainImage}`}>
                            <img src={`http://localhost:5050/products/${mainImage}`} className="product-img" />
                        </PhotoView>
                    </PhotoProvider>

                    <div className="thumb-list">
                        {[product.image, ...(product.images || [])].map((img, index) => (
                            <img key={index}
                                src={`http://localhost:5050/products/${img}`}
                                className={mainImage === img ? "thumb active" : "thumb"}
                                onClick={() => setMainImage(img)} />
                        ))}
                    </div>
                </div>

                <div className="detail-right">
                    <h2>{product.name}</h2>
                    <p className="price"> {product.price.toLocaleString('vi-VN')}₫ </p>

                    <div className="size-selection">
                        <p>Size</p>
                        <div className="size-list">
                            {['S', 'M', 'L'].map(size => (
                                <button key={size} className={selectedSize === size ? 'active' : ""} onClick={() => setSelectedSize(size)}> {size} </button>
                            ))}
                        </div>
                    </div>

                    <button className="add-btn" onClick={addtocart}>
                        THÊM VÀO GIỎ
                    </button>

                    <button className="buy-btn" onClick={buyNow}>
                        MUA NGAY
                    </button>

                    <div className="product-extra">
                        <h3>Chi tiết sản phẩm</h3>
                        <ul>
                            <li>Kích thước: S - M - L.</li>
                            <li>Chất liệu: Cotton.</li>
                            <li>Relaxed Boxy.</li>
                            <li>Artwork được áp dụng kỹ thuật in lụa.</li>
                        </ul>

                        <h3>Size Chart</h3>
                        <p>Mẫu nữ  cao 1m58 nặng 48kg mặc sản phẩm size S.</p>
                        <p>Mẫu nữ cao 1m58 nặng 44kg mặc sản phẩm size S.</p>
                        <img src={`http://localhost:5050/public/sizechart.png`} />
                    </div>
                </div>
            </div>

            <div className="related-products">
                <h2>CÁC SẢN PHẨM KHÁC</h2>

                <div className="related-list">
                    {related.map(p => (
                        <Link 
                            key={p._id} 
                            to={`/product/${p._id}`} 
                            className="related-item"
                        >
                            <img src={`http://localhost:5050/products/${p.image}`} />

                            <p className="name">{p.name}</p>

                            <p className="price">
                                {p.price.toLocaleString('vi-VN')}₫
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProductDetail;