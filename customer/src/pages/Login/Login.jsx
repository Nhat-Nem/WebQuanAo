import { useState } from "react";
import api from "../../services/api";
import "./Login.css";
import loginImg from "../../assets/logosmall.jpg";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/login", { username, password, rememberMe });

            alert("Login thành công");
            window.location.replace("/");
        } catch (error) {
            console.error(error.response?.data);
            alert("Login thất bại");
        }
    };

    return (
        <div className="login-container">
            {/* LEFT SIDE */}
            <div className="login-left">
                <div className="left-content">
                    <img src={loginImg} className="left-logo" />

                    <h1>Fashion Store</h1>
                    <p>Be your own style</p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="login-right">
                <div className="form-box">
                    <h2>Welcome Back</h2>
                    <p className="sub">Đăng nhập để tiếp tục</p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="options">
                            <label>
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Nhớ tài khoản
                            </label>

                            <Link to="/forgot-password">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button type="submit">Đăng nhập</button>
                    </form>

                    <p className="register">
                        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
