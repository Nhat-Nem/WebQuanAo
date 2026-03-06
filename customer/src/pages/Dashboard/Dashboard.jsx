import ProductCard from '../../components/ProductCard/ProductCard'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import "../Dashboard/Dashboard.css"

const banner = [
        `http://localhost:5050/public/banners/banner1.jpg`,
        `http://localhost:5050/public/banners/banner2.jpg`,
        `http://localhost:5050/public/banners/banner3.jpg`
    ]

function Dashboard({search, setCart}) {  
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [currentBanner, setCurrentBanner] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banner.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {

        const delay = setTimeout(() => {

            const currentPage = search ? 1 : page

            api.get(`/products?search=${search || ""}&page=${currentPage}`)
                .then(res => {
                    setProducts(res.data.products)
                    setTotalPages(res.data.totalPages)
                })
                .catch(err => console.log(err))

        }, 200)

        return () => clearTimeout(delay)

    }, [search, page])

    return(
        <>
            <div className="dashboard-page">

                <div className="banner">
                    <img src={banner[currentBanner]} />
                </div>

                <h2>Tất cả sản phẩm</h2>
                <div className="product-list">
                    {products.map(product => (
                        <ProductCard key={product._id}
                                    product={product}
                                    setCart={setCart}
                        />
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

export default Dashboard