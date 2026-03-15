import './Profile.css'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_URL } from '../../../../admin/src/services/config'
import useTitle from '../../hooks/useTitle'
import Swal from 'sweetalert2'
import Pagination from "../../components/Panigation/Panigation"
import "../../components/Panigation/Panigation.css"

function Profile() {
    useTitle('Profile')

    const navigate = useNavigate()
    const [order, setOrder] = useState([])
    const [user, setUser] = useState(null)

    const [page, setPage] = useState(1)
    const orderPerPage = 5

    const [statusFilter, setStatusFilter] = useState('all')

    const statusText = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        completed: "Hoàn thành",
        cancelled: "Đã huỷ"
    }

    const filteredOrders = order.filter(
        o => statusFilter === "all" || o.status === statusFilter
    )

    const addressbtn = () => {
        navigate('/address')
    }

    const start = (page - 1) * orderPerPage
    const currentOrders = filteredOrders.slice(start, start + orderPerPage)

    const totalPages = Math.ceil(filteredOrders.length / orderPerPage)

    const logout = async () => {

        const result = await Swal.fire({
            title: "Đăng xuất?",
            text: "Bạn có chắc muốn đăng xuất khỏi tài khoản?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            await api.post('/auth/logout')

            await Swal.fire({
                icon: "success",
                title: "Đã đăng xuất",
                timer: 1200,
                showConfirmButton: false
            })

            window.location.replace('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
            api.get("/auth/me")
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
                <p>Xin chào, <strong> {user.firstname + " " +user.lastname} </strong> </p>
                <div className="content">
                    <div className="order">
                        <p><strong>Danh sách đơn hàng</strong></p>

                        <div className="order-filter">
                            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="shipping">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã huỷ</option>
                            </select>
                        </div>

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
                                        currentOrders.map(orders => (
                                            <tr key={orders._id} onClick={() => navigate(`/order/${orders._id}`)} style={{cursor: 'pointer'}}>
                                                <td>#{orders._id.slice(-6)}</td>
                                                <td>{new Date(orders.createdAt).toLocaleDateString()}</td>
                                                <td>{orders.totalPrice.toLocaleString()}đ</td>
                                                <td>
                                                    {(orders.paymentMethod === 'qr' && orders.status === 'confirmed') ||
                                                    (orders.paymentMethod === 'cod' && orders.status === 'completed')
                                                        ? "Đã thanh toán"
                                                        : "Chưa thanh toán"}
                                                </td>
                                                <td>
                                                    <span className={`status ${orders.status}`}>
                                                        {statusText[orders.status]}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>

                        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                    </div>

                    <div className="account-infor">
                        <p>Tài khoản của tôi</p>
                        <p>Họ tên: {user.firstname + " " + user.lastname}</p>
                        <button onClick={() => addressbtn()}>Địa chỉ</button>
                        {user.isAdmin && (
                            <button onClick={() => {const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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
