import React, { useState, useEffect } from "react"
import api from "../../services/api"
import './Order.css'
import Pagination from "../../components/Panigation/Panigation"
import "../../components/Panigation/Panigation.css"
import Swal from "sweetalert2"

function Order() {
    const [page, setPage] = useState(1)
    const orderPerPage = 20

    const [expandedOrder, setExpandedOrder] = useState(null)

    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [order, setOrder] = useState([])

    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    const statusText = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        completed: "Hoàn thành",
        cancelled: "Đã huỷ"
    }

    useEffect(() => {
        api.get('/order').then(res => setOrder(res.data)).catch(err => console.log(err))
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [page])

    useEffect(() => {
        document.title = 'Quản lý đơn hàng - Admin'
    }, [])

    const updateStatus = async (id, newStatus) => {

        const result = await Swal.fire({
            title: "Cập nhật trạng thái?",
            text: `Đơn hàng sẽ chuyển sang "${statusText[newStatus]}"`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ"
        })

        if (!result.isConfirmed) return

        try {
            const res = await api.put(`/order/${id}`, { status: newStatus })

            setOrder(prev =>
                prev.map(o =>
                    o._id === id ? res.data : o
                )
            )

            Swal.fire({
                icon: "success",
                title: "Đã cập nhật!",
                text: `Đơn hàng đã chuyển sang "${statusText[newStatus]}"`,
                timer: 1500,
                showConfirmButton: false
            })

        } catch (error) {
            console.log(error)
            Swal.fire("Lỗi", "Không thể cập nhật đơn này", "error")
        }
    }

    const filter = [...order]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter(o => filterStatus ? o.status === filterStatus : true)
        .filter(o => (o.user?.email || "").toLowerCase().includes(search.toLowerCase()))
        .filter(o => {
            const orderDate = new Date(o.createdAt)

            if (fromDate) {
                const from = new Date(fromDate).setHours(0,0,0,0)
                if (orderDate < from) return false
            }

            if (toDate) {
                const to = new Date(toDate).setHours(23,59,59,999)
                if (orderDate > to) return false
            }

            return true
        })

    const totalPages = Math.ceil(filter.length / orderPerPage)
    const start = (page - 1) * orderPerPage
    const end = start + orderPerPage

    const currentOrders = filter.slice(start, end)

    const toggleOrder = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id)
    }
    return (
        <>
            <div className="order-page">
                <h3>Quản lý đơn hàng</h3>

                <div className="filter">
                    <select value={filterStatus} onChange={(e) => { setPage(1)
                                                 setFilterStatus(e.target.value)} }>
                        <option value=""> Tất cả </option>
                        <option value="pending"> Đang chờ </option>
                        <option value="confirmed"> Xác nhận </option>
                        <option value="shipping"> Đang giao </option>
                        <option value="completed"> Hoàn thành </option>
                        <option value="cancelled"> Từ chối </option>
                    </select>
                    
                    <input type="date" value={fromDate} onChange={(e) => { setPage(1)
                                                             setFromDate(e.target.value) }} />

                    <input type="date" value={toDate} lang="vi" onChange={(e) => { setPage(1)
                                                             setToDate(e.target.value) }} />

                    <button onClick={()=>{
                            setSearch("")
                            setFilterStatus("")
                            setFromDate("")
                            setToDate("")
                        }}>
                        Reset
                    </button>

                    <input type="text" placeholder="Search email..." onChange={(e) => { setPage(1)
                                                                                        setSearch(e.target.value) }}/>
                </div>

                <div className="order-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã đơn</th>
                                <th>Email</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                                <th>Cập nhật</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentOrders.map((order, index) => (
                                <React.Fragment key={order._id}>
                                    <tr key={order._id} onClick={() => toggleOrder(order._id)} className="order-row" >
                                        
                                        <td> {start + index + 1} </td>

                                        <td> #{order._id.slice(-6)} </td>

                                        <td> {order.user?.email || "User đã bị xoá" } </td>

                                        <td> {(order.totalPrice).toLocaleString('vi-VN')} ₫</td>

                                        <td> 
                                            <span className={`badge ${order.status}`}>
                                                {statusText[order.status]}
                                            </span>     
                                        </td>

                                        <td> {new Date(order.createdAt).toLocaleString('vi-VN')} </td>

                                        <td>
                                            {order.status !== 'completed' &&
                                            order.status !== 'cancelled' ? (
                                                <select value={order.status} 
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => {
                                                            e.stopPropagation()
                                                            updateStatus(order._id, e.target.value)}}>
                                                    <option value="pending"> Đang chờ </option>
                                                    <option value="confirmed"> Xác nhận </option>
                                                    <option value="shipping"> Đang giao </option>
                                                    <option value="completed"> Hoàn thành </option>
                                                    <option value="cancelled"> Từ chối </option>
                                                </select>   
                                            ) : (<span> Locked </span>)}
                                        </td>
                                    </tr>

                                    {expandedOrder === order._id && (
                                        <tr className="order-detail">
                                            <td colSpan="8">
                                                <div className="order-detail-row">
                                                    <strong>Chi tiết đơn hàng</strong>
                                                    {order.items.map((item, i) => (
                                                            <div key={i} className="detail-item">

                                                                <img
                                                                    src={`http://localhost:5050/products/${item.product?.image}`}
                                                                    alt={item.product?.name}
                                                                    className="detail-img"
                                                                />

                                                                <div className="detail-info">
                                                                    <div className="detail-name">{item.product?.name}</div>

                                                                    <div className="detail-meta">
                                                                        <span>Size: {item.size || "N/A"}</span>
                                                                        <span>SL: {item.quantity}</span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />

                    <p className="order-count">
                        Showing {start + 1} - {Math.min(end, filter.length)} trong tổng {filter.length} đơn hàng
                    </p>

                </div>
            </div>
        </>
    )
}

export default Order