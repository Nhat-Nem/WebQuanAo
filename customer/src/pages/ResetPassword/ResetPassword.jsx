import { useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"
import "./ResetPassword.css"

function ResetPassword() {

    const { token } = useParams()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(password !== confirmPassword){
            setMessage("Mật khẩu không khớp")
            setSuccess(false)
            return
        }

        try {

            const res = await api.post(`/auth/reset-password/${token}`, {
                password
            })

            setMessage(res.data.message)
            setSuccess(true)

            setTimeout(() => {
                window.location.href = "/login"
            }, 2000)

        } catch (err) {
            console.log(err)
            setMessage(err.response?.data?.message || "Token không hợp lệ")
            setSuccess(false)
        }
    }

    return (
        <div className="reset-container">

            <form onSubmit={handleSubmit}>

                <h2>Đặt lại mật khẩu</h2>

                <p className="auth-desc">
                    Nhập mật khẩu mới cho tài khoản của bạn
                </p>

                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Đặt lại mật khẩu
                </button>

                {message && (
                    <p className={success ? "success" : "error"}>
                        {message}
                    </p>
                )}

            </form>

        </div>
    )
}

export default ResetPassword