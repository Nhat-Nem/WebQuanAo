import { useState } from "react"
import api from "../../services/api"
import './ForgotPassword.css'
import { Link } from 'react-router-dom'

function ForgotPassword() {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const res = await api.post("/auth/forgot-password", { email })

            setMessage(res.data.message)

        } catch (err) {
            setMessage(err.response?.data?.message || "Có lỗi xảy ra")
        }
    }

    return (
        <div className="forgot-container">

            <form onSubmit={handleSubmit}>
                <h2>Quên mật khẩu</h2>

                <p className="auth-desc">
                    Nhập email của bạn để nhận link đặt lại mật khẩu
                </p>

                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">
                    Gửi link reset
                </button>

                {message && <p className="auth-message">{message}</p>}

                <Link to='/login' className="back-login">
                    Quay lại đăng nhập
                </Link>
            </form>

        </div>
    )
}

export default ForgotPassword