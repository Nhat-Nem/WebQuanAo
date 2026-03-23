import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import ProductCard from '../../components/ProductCard/ProductCard';
import './CategoryProduct.css'

const categoryNames = {
    ao: "Áo",
    quan: "Quần",
    'ao-khoac' : "Jacket - Hoodie",
    'phu-kien' : "Phụ kiện"
}

function CategoryProduct() {
    const { slug } = useParams()
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sort, setSort] = useState("default")

    useEffect(() => {
        api.get(`/products/category/${slug}?page=${page}`).then(res => {setProducts(res.data.products), setTotalPages(res.data.totalPages)
        })
        .catch(err => console.log(err))
    }, [slug, page])

    useEffect(() => {
        const name = categoryNames[slug] || slug
        document.title = `${name} | Shop`
    }, [slug])

    let sortedProducts = [...products]

    if (sort === "price-asc") {
        sortedProducts.sort((a,b) => a.price - b.price)
    }

    if (sort === "price-desc") {
        sortedProducts.sort((a,b) => b.price - a.price)
    }

    if (sort === "name-asc") {
        sortedProducts.sort((a,b) => a.name.localeCompare(b.name))
    }

    if (sort === "name-desc") {
        sortedProducts.sort((a,b) => b.name.localeCompare(a.name))
    }

    return (
        <>
            <div className='categoryprod-page'>
                <div className="category-header">
                    <div className="category-title">
                        <h2>{categoryNames[slug] || slug}</h2>
                        <span>{products.length} sản phẩm</span>
                    </div>

                    <div className="sort-box">
                        <label>Sắp xếp:</label>
                        <select value={sort} onChange={(e)=>setSort(e.target.value)}>
                            <option value="default">Mặc định</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                            <option value="name-asc">Tên A - Z</option>
                            <option value="name-desc">Tên Z - A</option>
                        </select>
                    </div>
                </div>

                <div className="products-grid">
                    {sortedProducts.map(product => (
                        <ProductCard key={product._id} product={product}/>
                    ))}
                </div>

                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}> Prev </button>

                    <span>Page {page} / {totalPages}</span>

                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}> Next </button>
                </div>
            </div>
        </>
    )
}

export default CategoryProduct;