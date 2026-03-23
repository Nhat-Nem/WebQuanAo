import { useEffect } from "react";
import { useState } from "react";
import api from "../../services/api";
import './Dashboard.css'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts"

function Dashboard() {
    const [stats, setStats] = useState({})
    const [chartData, setChartData] = useState([])
    const [recentOrders, setRecentOrders] = useState([])

    const statusText = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        completed: "Hoàn thành",
        cancelled: "Đã huỷ"
    }

    useEffect(() => {
        api.get('/admin/stats').then(res => setStats(res.data))
        api.get('/admin/revenue-by-month').then(res => setChartData(res.data))
        api.get('/admin/recent-orders').then(res => setRecentOrders(res.data))
    }, [])

    useEffect(() => {
        document.title = 'Dashboard - Admin'
    }, [])

    return (
        <>
            <div className="dashboard">
                <h2>Admin Dashboard</h2>

                {/* stat */}
                <div className="stats-grid">
                    <div className="card">
                        <h4>Sản phẩm</h4>
                        <p>{stats.products}</p>
                    </div>

                    <div className="card">
                        <h4>Người dùng</h4>
                        <p>{stats.users}</p>
                    </div>

                    <div className="card">
                        <h4>Đơn hàng</h4>
                        <p>{stats.orders}</p>
                    </div>

                    <div className="card">
                        <h4>Doanh thu</h4>
                        <p>{stats.revenue?.toLocaleString('vi-VN')}₫</p>
                    </div>
                </div>

                {/* chart */}
                <div className="chart-box">
                    <h3>Doanh thu theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => value.toLocaleString('vi-VN')} />
                            <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + "₫"} />
                            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{r:5}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* recent order */}
                <div className="recent-orders">
                    <h3>Đơn hàng gần đây</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-6)}</td>
                                    <td>
                                        {order.user?.firstname 
                                            ? `${order.user.firstname} ${order.user.lastname}` 
                                            : "User đã bị xoá"}
                                    </td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN')}₫ </td>
                                    <td>
                                        <span className={`status ${order.status}`}>
                                            {statusText[order.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Dashboard;