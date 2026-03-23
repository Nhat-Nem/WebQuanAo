import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import registerImg from "../../assets/logosmall.jpg";
import api from "../../services/api";
function Register() {
    const navigate = useNavigate();

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const isValidName = (name) => {
        const trimmed = name.trim()

        // it nhat 2 ky tu
        if (trimmed.length < 2) return false

        // cho chu cai dau hoa + khoang trang
        const regex = /^[a-zA-ZÀ-ỹ\s]+$/
        if (!regex.test(trimmed)) return false

        // k dc spam 'aaa'
        const cleaned = trimmed.toLowerCase().replace(/\s/g, "")
        if (/(.)\1{3,}/.test(cleaned)) return false

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        //validate ho
        if (!firstname) {
            newErrors.firstname = "Nhập họ"
        } else if (!isValidName(firstname)) {
            newErrors.firstname = "Họ không hợp lệ"
        }

        //validate ten
        if (!lastname) {
            newErrors.lastname = "Nhập tên"
        } else if (!isValidName(lastname)) {
            newErrors.lastname = "Tên không hợp lệ"
        }
        
        //validate username
        if (!username) {
            if (!errors.username) {
                newErrors.username = "Nhập username"
            }
        } else if (username.length < 3) {
            newErrors.username = "Username tổi thiểu 3 ký tự"
        }
        
        //validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email) {
            if (!errors.email) {
                newErrors.email = "Nhập email"
            }
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ"
        }

        //validate password
        if (!password) {
            newErrors.password = "Nhập mật khẩu"
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải tối thiểu 6 ký tự"
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Nhập lại mật khẩu";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Không khớp";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await api.post("/auth/register", {
                firstname, lastname, username, email, password
            });

            alert("Đăng ký thành công");
            navigate("/");
        } catch (error) {
            const err = error.response?.data

            console.log(err.response) // debug

            if (err?.errors) {
                setErrors(err.errors)
            } else {
                alert(err?.message || "Đăng kí thất bại")
            }
        }
    };

    return (
        <div className="register-container">
            {/* LEFT */}
            <div className="register-left">
                <div className="register-left-content">
                    <img src={registerImg} className="register-logo" />
                    <h1>Fashion Store</h1>
                    <p>Create your account</p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="register-right">
                <div className="register-form-box">
                    <h2>Register</h2>
                    <p className="register-sub">Tạo tài khoản mới</p>

                    <form onSubmit={handleSubmit}>

                        <div className="register-row">
                            <div className="input-group">
                                <input
                                    className={errors.firstname ? "input-error" : ""}
                                    type="text"
                                    placeholder="Họ"
                                    value={firstname}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setFirstName(value)

                                        if (!value) {
                                            setErrors(prev => ({ ...prev, firstname: "Nhập họ" }))
                                        } else if (!isValidName(value)) {
                                            setErrors(prev => ({ ...prev, firstname: "Họ không hợp lệ" }))
                                        } else {
                                            setErrors(prev => ({ ...prev, firstname: "" }))
                                        }
                                    }}
                                />

                                {errors.firstname && <span className="error">{errors.firstname}</span>}
                            </div>

                            <div className="input-group">
                                <input
                                    className={errors.lastname ? "input-error" : ""}
                                    type="text"
                                    placeholder="Tên"
                                    value={lastname}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setLastName(value)

                                        if (!value) {
                                            setErrors(prev => ({ ...prev, lastname: "Nhập tên" }))
                                        } else if (!isValidName(value)) {
                                            setErrors(prev => ({ ...prev, lastname: "Tên không hợp lệ" }))
                                        } else {
                                            setErrors(prev => ({ ...prev, lastname: "" }))
                                        }
                                    }}
                                />
                                {errors.lastname && <span className="error">{errors.lastname}</span>}
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.username ? "input-error" : ""}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={async (e) => {
                                    const value = e.target.value
                                    setUsername(value)

                                    setErrors(prev => ({ ...prev, username: "" }))

                                    if (!value) {
                                        setErrors(prev => ({ ...prev, username: "Nhập username" }))
                                        return
                                    }

                                    if (value.length >= 3) {
                                        const res = await api.get(`/auth/check?username=${value}`)
                                        if (res.data.username) {
                                            setErrors(prev => ({ ...prev, username: "Username đã tồn tại" }) )
                                        } else {
                                            setErrors(prev => ({...prev, username: ""}))
                                        }
                                    }
                                }}
                            />
                            {errors.username && <span className="error">{errors.username}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.email ? "input-error" : ""}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={async (e) => {
                                    const value = e.target.value
                                    setEmail(value)

                                    setErrors(prev => ({ ...prev, email: "" }))

                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                    // 1. validate cơ bản
                                    if (!value) {
                                        setErrors(prev => ({ ...prev, email: "Nhập email" }))
                                        return
                                    }

                                    if (!emailRegex.test(value)) {
                                        setErrors(prev => ({ ...prev, email: "Email không hợp lệ" }))
                                        return
                                    }

                                    // 2. check tồn tại (gọi API)
                                    const res = await api.get(`/auth/check?email=${value}`)

                                    if (res.data.email) {
                                        setErrors(prev => ({ ...prev, email: "Email đã tồn tại" }))
                                    } else {
                                        setErrors(prev => ({ ...prev, email: "" }))
                                    }
                                }}
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.password ? "input-error" : ""}
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors(prev => ({...prev, password: ""}))
                                }}
                            />
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <div className="input-group">
                            <input
                                className={errors.confirmPassword ? "input-error" : ""}
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setConfirmPassword(value)
                                    
                                    if (value != password) {
                                        setErrors(prev => ({...prev, confirmPassword: "Không khớp"}))
                                    } else {
                                        setErrors(prev => ({...prev, confirmPassword: ""}))
                                    }
                                }}
                            />
                            {errors.confirmPassword && (
                                <span className="error">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit">Đăng ký</button>

                    </form>

                    <p className="register-login">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;