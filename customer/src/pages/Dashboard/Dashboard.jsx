import ProductCard from '../../components/ProductCard/ProductCard'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import "../Dashboard/Dashboard.css"
import useTitle from '../../hooks/useTitle'
import { Link, useSearchParams } from "react-router-dom"
import Pagination from "../../components/Panigation/Panigation"
import "../../components/Panigation/Panigation.css"

function Dashboard({setCart}) {  
    useTitle("Shop - LNK")

    const [searchParams] = useSearchParams()
    const search = searchParams.get("search") || ""
    const [banners, setBanners] = useState([])
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [currentBanner, setCurrentBanner] = useState(0)

    useEffect(() => {

        if (banners.length === 0) return

        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length)
        }, 3000)

        return () => clearInterval(interval)

    }, [banners])

    //lay banner
    useEffect(() => {
        api.get("/banner/active")
            .then(res => setBanners(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [page])

    useEffect(() => {

        const delay = setTimeout(() => {

            const currentPage = search ? 1 : page
            api.get(`/products?search=${search}&page=${currentPage}`)
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
                    {banners.length > 0 && (
                        <Link to={banners[currentBanner].link}>
                            <img
                                src={`${import.meta.env.VITE_SERVER_STATIC}/public/banners/${banners[currentBanner].image}`}
                                alt={banners[currentBanner].title}
                            />
                        </Link>
                    )}

                    <div className="banner-dots">
                        {banners.map((_, index) => (
                            <span
                                key={index}
                                className={index === currentBanner ? "dot active" : "dot"}
                                onClick={() => setCurrentBanner(index)}
                            ></span>
                        ))}
                    </div>
                </div>

                {search ? (
                    <h2>Tìm thấy {products.length} kết quả với từ khóa "{search}"</h2>
                ) : (
                    <h2>Tất cả sản phẩm</h2>
                )}

                <div className="product-list">
                    {products.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            setCart={setCart}
                        />
                    ))}
                </div>

                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

            </div>
        </>
    )
}

export default Dashboard