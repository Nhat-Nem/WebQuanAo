import './Profile.css'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_URL } from '../../../../admin/src/services/config'

function Profile({setToken, setCart}) {
    const navigate = useNavigate()
    const [order, setOrder] = useState([])
    const [user, setUser] = useState(null)

    const addressbtn = () => {
        navigate('/address')
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setCart([])
        alert('dang xuat thanh cong')
        navigate('/')
    }

    useEffect(() => {
            api.get("/users/me")
                .then(res => setUser(res.data))
                .catch(err => console.log(err))

            api.get('/order/my')
                .then(res => {console.log(res.data), setOrder(res.data)})
                .catch(err => console.log(err))
    }, [])

    if (!user) return <h3>Loading...</h3>

    return (
        <>
            <div className="profile-page">
                <h3>Thông tin tài khoản</h3>
                <p>Xin chào, {user.firstname + " " +user.lastname}</p>
                <p>Đơn hàng gần nhất</p>
                <div className="content">
                    <div className="order">
                        <table>
                            <thead>
                                <tr>
                                    <th>Đơn hàng #</th>
                                    <th>Đặt ngày</th>
                                    <th>Giá trị đơn hàng</th>
                                    <th>Tình trạng thanh toán</th>
                                    <th>Tình trạng đơn hàng</th>
                                </tr>
                            </thead>

                            <tbody>
                                {order.length === 0 ? (
                                    <tr>
                                        <td colSpan='5'> Chưa có đơn hàng nào </td>
                                    </tr>
                                ) : (
                                    order.map(orders => (
                                        <tr key={orders._id}>
                                            <td>#{orders._id.slice(-6)}</td>
                                            <td>{new Date(orders.createdAt).toLocaleDateString()}</td>
                                            <td>{orders.totalPrice.toLocaleString()}đ</td>
                                            <td>
                                                {(orders.paymentMethod === 'qr' && orders.status === 'confirmed') ||
                                                (orders.paymentMethod === 'cod' && orders.status === 'completed')
                                                    ? "Đã thanh toán"
                                                    : "Chưa thanh toán"}
                                            </td>
                                            <td>{orders.status.charAt(0).toUpperCase() + orders.status.slice(1)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="account-infor">
                        <p>Tài khoản của tôi</p>
                        <p>Họ tên: {user.firstname + " " + user.lastname}</p>
                        <button onClick={() => addressbtn()}>Địa chỉ</button>
                        {user.isAdmin && (
                            <button onClick={() => {const token = localStorage.getItem('token')
                                    window.open(`${ADMIN_URL}?token=${token}`, "_blank")}}>
                                Quản lý sản phẩm
                            </button>
                        )}
                        <button onClick={logout}>Đăng xuất</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
