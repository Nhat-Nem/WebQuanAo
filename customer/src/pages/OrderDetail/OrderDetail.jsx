import './OrderDetail.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

function OrderDetail() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] = useState(null)

    const statusText = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        completed: "Hoàn thành",
        cancelled: "Đã huỷ"
    }

    useEffect(() => {
        api.get(`/order/${id}`).then(res => setOrder(res.data)).catch(err => console.log(err))
    }, [id])

    useEffect(() => {
        if (order) {
            document.title = `Đơn hàng #${order._id.slice(-6)}`
        }
    }, [order])

    if (!order) return <h3> Loading... </h3>

    return (
        <>
            <div className="order-detail">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>

                <h2> Đơn hàng #{order._id.slice(-6)} </h2>

                <div className="order-info">
                    <p><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleDateString()} </p>
                    <p><b>Trạng thái:</b> <span className={`status ${order.status}`}> {statusText[order.status]} </span> </p>
                    <p><b>Tổng tiền:</b> {order.totalPrice.toLocaleString('vi-VN')}đ </p>
                    <p><b>Thanh toán:</b> {order.paymentMethod.toUpperCase()}</p>
                </div>

                <h3>Sản phẩm</h3>

                <div className="products">
                    {order.items.map(item => (
                        <div key={item._id} className='product'>

                            <img src={`http://localhost:5050/products/${item.product.image}`} alt={item.product.name}/>

                            <div>
                                <p>{item.product.name}</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p> {item.price.toLocaleString('vi-VN')}đ </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default OrderDetail