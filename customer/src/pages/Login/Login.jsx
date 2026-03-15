import { useState } from "react";
import api from "../../services/api"
import './Login.css'
import loginImg from '../../assets/need2.png'
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await api.post("/auth/login", {
                username, password
            })

            alert("Login thành công")

            window.location.replace('/')
        } catch (error) {
            console.error(error.response?.data)
            alert("Login thất bại")
        }
    }

    return (
        <>  
            <div className="login-page">
                <div className="login-box">
                    <img src= {loginImg}/>
                    <h2>Đăng nhập</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên đăng nhập</label> 
                            <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                        </div>
                        
                        <div className="form-group">
                            <label >Mật khẩu</label> 
                            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/> <span>Duy trì đăng nhập</span>
                            </label>

                            <Link to="/forgot-password" className="forgot-password">Quên mật khẩu</Link>
                        </div>

                        <button type="submit">Đăng nhập</button>
                    </form>
                    <p className="registerpara">Bạn chưa có tài khoản? <Link to='/register'>Đăng ký</Link> </p>
                </div>
            </div>
        </>
    )
}

export default Login;