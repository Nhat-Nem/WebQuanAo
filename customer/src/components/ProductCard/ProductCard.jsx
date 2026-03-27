import '../ProductCard/ProductCard.css'
import { Link } from 'react-router-dom'

function ProductCard({product}) {
    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`}>
                <div className="product-img">
                    <img src={`${import.meta.env.VITE_SERVER_STATIC}/products/${product.image}`}/>
                </div>
            </Link>
            
            <h3 className="product-name"> <Link to={`/product/${product._id}`}> {product.name} </Link> </h3>
            <p className="product-price">{product.price.toLocaleString('vi-VN')}₫</p>
        </div>
    )
}

export default ProductCard