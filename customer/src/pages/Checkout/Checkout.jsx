import { useEffect } from "react"
import { useState } from "react"
import api from "../../services/api"
import './Checkout.css'
import { useLocation, useNavigate } from "react-router-dom"
import useTitle from "../../hooks/useTitle"
import { toast } from 'react-toastify'
import Swal from "sweetalert2"
import { QRCodeCanvas } from 'qrcode.react'

function Checkout() {
    useTitle('Trang thanh toán')

    const navigate = useNavigate()
    const location = useLocation()
    const buyNowItem = location.state?.buyNowItem
    const [address, setAddress] = useState([])
    const [selectedAddress, setSelectedAddress] = useState('new')
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [showQR, setShowQR] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phone: ""
    })

    const [cart, setCart] = useState(() => {
        if (buyNowItem) {
            return [buyNowItem]
        }
        return []
    })

    useEffect(() => {
        api.get('/address').then(res => setAddress(res.data)).catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (!buyNowItem) {
            api.get('/cart')
                .then(res => {
                    if (res.data && res.data.items) {
                        setCart(res.data.items)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [buyNowItem])

    const subtotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    const shippingfree = 30000
    const total = subtotal + shippingfree

    const selectChange = (e) => {
        const value = e.target.value
        setSelectedAddress(value)

        if (value === 'new') {
            setFormData({
                firstName: "",
                lastName: "",
                address: "",
                city: "",
                phone: ""
            })
        } else {
            const found = address.find(a => a._id === value)
            if (found) {
                setFormData(found)
            }
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }   

    const handleOrder = async () => {
        console.log(paymentMethod)
        if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone) {
            toast.warning("Vui lòng nhập đầy đủ thông tin !")
            return
        }

        const formattedItems = cart.map(item => ({
            product: item.product._id || item.product,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price
        }))

        const orderData = {
            items: formattedItems,
            totalPrice: total,
            address: formData.address,
            paymentMethod: paymentMethod
        }

        // COD 
        if (paymentMethod === 'cod') {
            const confirm = await Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: `Tổng tiền: ${total.toLocaleString('vi-VN')}₫`,
                icon: "question",
                showCancelButton: true
            })

            if (!confirm.isConfirmed) return

            await api.post('/order/', orderData)

            Swal.fire("Thành công!", "Đặt hàng thành công", "success")
            navigate("/profile")
            window.location.reload()
        }

        // QR (demo)
        if (paymentMethod === 'qr') {
            setShowQR(true)
            return
        }

        Swal.fire("Thành công!", "Thanh toán QR thành công", "success")
        navigate("/profile")
        window.location.reload()
    }

    return (
        <>
            <div className="checkout-page">

                {/* ben trai web */}
                <div className="left">
                    <h2>Thông tin nhận hàng</h2>
                    
                    <select value={selectedAddress} onChange={selectChange}>
                        <option value='new'> Địa chỉ khác </option>
                        {address.map(addr => (
                            <option key={addr._id} value={addr._id}>
                                {addr.firstName} {addr.lastName} - {addr.address}
                            </option>
                        ))}
                    </select>

                    <input type="text" placeholder="Họ...." name="firstName" value={formData.firstName} onChange={handleChange} />
                    <input type="text" placeholder="Tên..." name="lastName" value={formData.lastName} onChange={handleChange} />
                    <input type="text" placeholder="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
                    <input type="text" placeholder="Nhập thành phố.." name="city" value={formData.city} onChange={handleChange} />
                    <input type="text" placeholder="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange}  />
                
                    <div className="payment-box">
                        <h2>Phương thức thanh toán</h2>
                        <label className="payment-option"> <input type='radio' name='payment' value='qr' checked={paymentMethod === 'qr'} onChange={(e) => setPaymentMethod(e.target.value)} /> Thanh toán qua QR </label>
                        <label className="payment-option"> <input type="radio" name="payment" value='cod' checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} /> Thanh toán khi nhận hàng (COD) </label>
                    </div>
                </div>

                <div className="right">
                    <h2>Đơn hàng</h2>

                    {cart.map(item => (
                        <div key={item._id || item.product._id} className="order-product">
                            <div className="product-info">
                                <img src={`${import.meta.env.VITE_SERVER_STATIC}/products/${item.product.image}`} />
                                <div>
                                    <p>{item.product.name}</p>

                                    {item.size && (
                                        <small className="checkout-size">
                                            Size: {item.size}
                                        </small>
                                    )}

                                    <small>Số lượng: {item.quantity}</small>
                                </div>
                            </div>

                            <span>{(item.product.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                        </div>
                    ))}

                    <div className="summary">
                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                        </div>

                        <div className="summary-row">
                            <span>Phí vận chuyển</span>
                            <span>{shippingfree.toLocaleString('vi-VN')}₫</span>
                        </div>

                        <div className="summary-row total">
                            <span>Tổng cộng</span>
                            <span>{total.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>

                    <button className="order-btn" onClick={handleOrder}> Đặt hàng </button>
                </div>

            </div>
            
            {showQR && (
                <div className="qr-overlay">
                    <div className="qr-box">
                        <h3>Quét QR để thanh toán</h3>

                        <QRCodeCanvas value={`Thanh toan don hang - ${total}`} size={200} />
                        
                        <p> {total.toLocaleString('vi-VN')}₫ </p>
                        
                        <div className="qr-actions">
                            <button className="qr-confirm" onClick={async () => {
                                const formattedItems = cart.map(item => ({
                                    product: item.product._id || item.product, 
                                    size: item.size,
                                    quantity: item.quantity,
                                    price: item.product.price
                                }))

                                const orderData = {
                                    items: formattedItems,
                                    totalPrice: total, 
                                    address: formData.address,
                                    paymentMethod: paymentMethod
                                }

                                await api.post('/order/', orderData)
                                setShowQR(false)

                                Swal.fire("Thánh công!", "Thanh toán QR thành công", "success")
                                navigate('/profile')
                                window.location.reload()
                            }  } >
                                Tôi đã thanh toán
                            </button>

                            <button onClick={() => setShowQR(false)} className="qr-cancel" > Huỷ </button>
                        </div>

                    </div>
                </div>
            )}
        </> 
    )
}

export default Checkout