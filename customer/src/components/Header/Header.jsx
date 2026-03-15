import './Header.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoVLu from '../../assets/need.png'
import { useState, useEffect } from 'react'
import api from '../../services/api'

function Header({ cart }) {

    const location = useLocation()
    const navigate = useNavigate()

    const [inputValue, setInputValue] = useState("")
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        const checkLogin = async () => {
            try {
                await api.get("/auth/me")
                setIsLogin(true)
            } catch (err) {
                if (err.response?.status === 401) {
                    setIsLogin(false)
                } else {
                    console.error(err)
                }
            }
        }

        checkLogin()
    }, [location.pathname])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [location.pathname])

    const tongquantity = cart?.reduce(
        (sum, item) => sum + item.quantity,0) || 0

    const handleChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleSearch = () => {
        const keyword = inputValue.trim()

        if (!keyword) {
            navigate('/')
            return
        }

        navigate(`/?search=${keyword}`, { replace: true })
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleHome = () => {
        setInputValue("")
        navigate("/", { replace: true })
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const keyword = params.get("search") || ""
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputValue(keyword)
    }, [location.search])

    return (
        <header className='header'>

            <div className="logo">
                <img
                    src={logoVLu}
                    alt='LNK - Clothes'
                    onClick={handleHome}
                    style={{cursor: 'pointer'}}
                />
            </div>

            <nav className="navi">
                <Link to='/' onClick={handleHome}>Tất cả sản phẩm</Link>
                <Link to='/category/ao'>Áo</Link>
                <Link to='/category/ao-khoac'>Áo khoác - Hoodie</Link>
                <Link to='/category/quan'>Quần</Link>
                <Link to='/category/phu-kien'>Phụ kiện</Link>
                <Link to='/about-us'>About Us</Link>
            </nav>

            <div className="right">

                <div className="tim-kiem">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />

                    <i
                        className="fa-solid fa-magnifying-glass"
                        onClick={handleSearch}
                    ></i>
                </div>

                <div className="icons">

                    {/* user icon */}
                    <Link to={isLogin ? "/profile" : "/login"} style={{color: 'black'}}>
                        <i className="fa-regular fa-user"></i>
                    </Link>

                    <div className="cart">
                        <Link to='/cart'>
                            <i className="fa-solid fa-cart-shopping"></i>
                        </Link>
                        <span>{tongquantity}</span>
                    </div>

                </div>

            </div>

        </header>
    )
}

export default Header