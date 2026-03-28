import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Sidebar.css'
import api from '../../services/api'
import { LayoutDashboard, Package, ReceiptText, Users, Image, LogOut, Store } from "lucide-react"

function Sidebar() {

    const navigate = useNavigate()
    const [admin, setAdmin] = useState(null)

    useEffect(() => {

        api.get('/auth/me')
            .then(res => {

                if(!res.data.isAdmin){
                    navigate("/login")
                    return
                }

                setAdmin(res.data)

            })
            .catch(() => {
                navigate("/login")
            })

    }, [navigate])

    const handleLogout = async () => {

        try {
            await api.post("/auth/logout")
            localStorage.removeItem('token')
            window.open(`${import.meta.env.VITE_CLIENT_URL}`, "_blank")
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="sidebar">

            <div className="sidebar-top">
                <h3>Admin</h3>

                <ul>
                    <li><NavLink to='/'><LayoutDashboard size={18}/> Dashboard</NavLink></li>
                    <li><NavLink to='/products'><Package size={18}/> Sản phẩm</NavLink></li>
                    <li><NavLink to='/orders'><ReceiptText size={18}/> Đơn hàng</NavLink></li>
                    <li><NavLink to='/user'><Users size={18}/> Người dùng</NavLink></li>
                    <li><NavLink to='/banner'><Image size={18}/> Banner</NavLink></li>
                </ul>
            </div>

            <div className="sidebar-bottom">

                <div className="sidebar-profile">
                    <div className="avatar">
                        {admin?.firstname?.charAt(0)}
                    </div>

                    <div>
                        <p className="name">
                            {admin ? `${admin.firstname} ${admin.lastname}` : "Loading..."}
                        </p>

                        <span className="email">
                            {admin?.email}
                        </span>
                    </div>
                </div>

                <a 
                    href= {import.meta.env.VITE_CLIENT_URL}
                    className="store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Store size={18}/> Về trang cửa hàng
                </a>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18}/> Đăng xuất
                </button>

            </div>

        </div>
    )
}

export default Sidebar