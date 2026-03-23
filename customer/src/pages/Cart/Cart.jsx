import './Cart.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import api from '../../services/api'
import useTitle from '../../hooks/useTitle'

function Cart({cart, setCart}) {
    useTitle('Giỏ hàng          ')

    const navigate = useNavigate()

    // load cart
    useEffect(() => {
        api.get('/cart').then(res =>{if(res.data && res.data.items) {setCart(res.data.items)}}).catch(err => console.log(err))
    }, [setCart])

    const removeProduct = async (itemId) => {
        try {
            const res = await api.delete(`/cart/remove/${itemId}`)
            setCart(res.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    const totalPrice = cart.reduce(
        (sum, item) =>
            item.product
                ? sum + item.product.price * item.quantity
                : sum,
        0
    )

    // tang
    const tang = async (id) => {
        setCart(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )

        try {
            await api.put('/cart', {
                id,
                type: 'increase'
            })
        } catch (error) {
            console.log(error)

            setCart(prev =>
                prev.map(item =>
                    item._id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            )
        }
    }

    const giam = async (id) => {

        const item = cart.find(i => i._id === id)
        if (item.quantity <= 1) return

        setCart(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        )

        try {
            await api.put('/cart', {
                id,
                type: 'decrease'
            })
        } catch (error) {
            console.log(error)

            // rollback nếu lỗi
            setCart(prev =>
                prev.map(item =>
                    item._id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        }
    }

    return (
        <>
            <div className="cart-container">
                <h3>Giỏ hàng</h3>

                {cart.length === 0 ? (
                    <>
                        <div className="empty-cart">
                            <i className="fa-solid fa-cart-shopping empty-icon"></i>
                            <h3>Không có sản phẩm trong giỏ hàng của bạn</h3>
                            <button onClick={() => navigate('/')}> Tiếp tục mua sắm </button>
                        </div>
                    </>
                ) : (
                    <div className="checkout">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                    <th>Xoá</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.map(item => (
                                    <tr key={item._id}>
                                        <td><img src={`http://localhost:5050/products/${item.product.image}`} /></td>
                                        <td>
                                            <div className="cart-product-info">
                                                <div className="cart-product-name">
                                                    {item.product.name}
                                                </div>

                                                {item.size && (
                                                    <div className="cart-product-size">
                                                        Size: {item.size}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="qly-quantity">
                                                <button onClick={() => giam(item._id)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => tang(item._id)}>+</button>
                                            </div>
                                        </td>
                                        <td>{(item.product.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                                        <td className='remove-btn'> <button onClick={() => removeProduct(item._id)}> <i className="fa-regular fa-trash-can" style={{color: "rgb(0, 0, 0)"}}></i> </button> </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-summary">
                            <div className="cart-row">
                                <span>Tổng tiền</span>
                                <span className="total-price">{totalPrice.toLocaleString('vi-VN')}₫</span>
                            </div>

                            <button className='checkout-btn' onClick={() => navigate('/checkout')}>Thanh toán</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Cart;











