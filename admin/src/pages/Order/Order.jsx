import { useEffect } from "react"
import { useState } from "react"
import api from "../../services/api"
import './Order.css'
function Order() {
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [order, setOrder] = useState([])

    useEffect(() => {
        api.get('/order').then(res => setOrder(res.data)).catch(err => console.log(err))
    }, [])

    const updateStatus = async(id, newStatus) => {
        try {
            const res = await api.put(`/order/${id}`, {status: newStatus})
            setOrder(prev => prev.map(o => o._id === id ? res.data : o))
        } catch (error) {
            console.log(error)
            alert("không thể cập nhật đơn này")
        }
    }

    const filter = order.filter(o => filterStatus ? o.status === filterStatus : true).filter(o => o.user?.email?.toLowerCase().includes(search.toLocaleLowerCase()))

    return (
        <>
            <div className="order-page">
                <h3>Quản lý đơn hàng</h3>

                <div className="filter">
                    <select onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value=""> Tất cả </option>
                        <option value="pending"> Đang chờ </option>
                        <option value="confirmed"> Xác nhận </option>
                        <option value="shipping"> Đang giao </option>
                        <option value="completed"> Hoàn thành </option>
                        <option value="cancelled"> Từ chối </option>
                    </select>

                    <input type="text" placeholder="Search email..." onChange={(e) => setSearch(e.target.value)}/>
                </div>

                <div className="order-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                                <th>Cập nhật</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filter.map(order => (
                                <tr key={order._id}>
                                    
                                    <td> {order.user?.email} </td>

                                    <td>
                                        {Object.values(
                                            order.items.reduce((acc, item) => {
                                                const name = item.product?.name

                                                if (!acc[name]) {
                                                    acc[name] = {
                                                        name,
                                                        quantity: 0,
                                                        sizes: []
                                                    }
                                                }

                                                acc[name].quantity += item.quantity

                                                if (item.size) {
                                                    acc[name].sizes.push(item.size)
                                                }

                                                return acc
                                            }, {})
                                        ).map((p, index) => (
                                            <div key={index} className="order-product-item">
                                                {p.name} x {p.quantity} - Size: {p.sizes.join(', ')}
                                            </div>
                                        ))}
                                    </td>

                                    <td> {(order.totalPrice).toLocaleString('vi-VN')} ₫</td>

                                    <td> 
                                        <span className={`badge ${order.status}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>     
                                    </td>

                                    <td> {new Date(order.createdAt).toLocaleDateString()} </td>

                                    <td>
                                        {order.status !== 'completed' &&
                                         order.status !== 'cancelled' ? (
                                            <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
                                                <option value="pending"> Đang chờ </option>
                                                <option value="confirmed"> Xác nhận </option>
                                                <option value="shipping"> Đang giao </option>
                                                <option value="completed"> Hoàn thành </option>
                                                <option value="cancelled"> Từ chối </option>
                                            </select>   
                                        ) : (<span> Locked </span>)}
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

export default Order