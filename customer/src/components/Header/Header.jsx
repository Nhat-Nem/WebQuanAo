import './Header.css'
import { Link } from 'react-router-dom';
import logoVLu from '../../assets/need.png'
import { useState } from 'react';

function Header({setSearch, cart}) {
    const [inputValue, setInputValue] = useState("")
    const token = localStorage.getItem('token')
    const tongquantity = cart?.reduce((sum, item) => 
        sum + item.quantity, 0
    )

    const handleChange = (e) => {
        const value = e.target.value
        setInputValue(value)
        setSearch(value.trim())
    }

    return (
        <header className='header'>
            <div className="logo">
                <Link to='/'>
                    <img src={logoVLu} alt='LNK - Clothes'/>
                </Link>
            </div>

            <nav className="navi">
                <Link to='/'>Tất cả sản phẩm</Link>
                <Link to='/category/ao'>Áo</Link>
                <Link to='/category/ao-khoac'>Áo khoác - Hoodie</Link>
                <Link to='/category/quan'>Quần</Link>
                <Link to='/category/phu-kien'>Phụ kiện</Link>
                <Link to='#'>About Us</Link>
            </nav>

            <div className="right">
                <div className="tim-kiem">
                    <input type="text" placeholder='Tìm kiếm...' value={inputValue} onChange={handleChange}/>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <div className="icons">
                    <Link to={token ? "/profile" : "/login"} style={{color: 'black'}}><i className="fa-regular fa-user"></i></Link>
                    <div className="cart">
                        <Link to='/cart'><i className="fa-solid fa-cart-shopping"></i></Link>
                        <span>{tongquantity}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;