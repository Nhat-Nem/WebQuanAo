import '../ProductCard/ProductCard.css'
import { Link } from 'react-router-dom'

function ProductCard({product}) {

    return (
        <div className="product-card">
            <div className="product-img">
                <img src={`http://localhost:5050/products/${product.image}`}/>
            </div>
            
            <h3 className="product-name"> <Link to={`/product/${product._id}`}> {product.name} </Link> </h3>
            <p className="product-price">{product.price.toLocaleString('vi-VN')}₫</p>
        </div>
    )
}

export default ProductCard