import { useState } from 'react';
import registerImg from '../../assets/need2.png'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import './Register.css'

function Register() {
    const navigate = useNavigate();
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState({})
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()

        let newErrors = {}

        if (!firstname) newErrors.firstname = "Vui lòng nhập họ"
        if (!lastname) newErrors.lastname = "Vui lòng nhập tên"
        if (!username) newErrors.username = "Vui lòng nhập tên đăng nhập"
        if (!email) newErrors.email = "Vui lòng nhập email"
        if (!password) newErrors.password = "Vui lòng nhập mật khẩu"

        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu"
        }
        else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        try {
            await axios.post("http://localhost:5050/api/auth/register", {
                firstname, lastname, username, email, password
            })

            alert("Đăng ký thành công")
            navigate("/login")

        } catch {
            alert("Đăng ký thất bại")
        }
    }

    return(
        <>
            <div className="register-page">
                <div className="register-box">
                    <img src= {registerImg}/>
                    <h2>Đăng Ký</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="name-group">
                            <div className="form-group">
                                <label>Họ</label>
                                <input
                                    type="text"
                                    placeholder="Họ"
                                    value={firstname}
                                    onChange={(e) => {
                                        setFirstName(e.target.value)

                                        setErrors(prev => ({
                                        ...prev,
                                        firstname: ""
                                        }))
                                    }}
                                    className={errors.firstname ? "error-input" : ""}
                                />
                                <p className="error">{errors.firstname}</p>
                            </div>

                            <div className="form-group">
                                <label>Tên</label>
                                <input
                                    type="text"
                                    placeholder="Tên"
                                    value={lastname}
                                    onChange={(e) => {
                                        setLastName(e.target.value)

                                        setErrors(prev => ({
                                        ...prev,
                                        lastname: ""
                                        }))
                                    }}
                                    className={errors.lastname ? "error-input" : ""}
                                />
                                <p className="error">{errors.lastname}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tên đăng nhập</label> 
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)

                                    setErrors(prev => ({
                                    ...prev,
                                    username: ""
                                    }))
                                }}
                                className={errors.username ? "error-input" : ""}
                            />
                            <p className="error">{errors.username}</p>
                        </div>
                        
                        <div className="form-group">
                            <label >Email</label> 
                            <input 
                                type="email" 
                                placeholder="Email..." 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setErrors(prev => ({
                                        ...prev, 
                                        email: ""
                                    }))
                                }} 
                                className={errors.email ? "error-input" : ""} 
                            />
                            <p className="error">{errors.email}</p>
                        </div>

                        <div className="form-group">
                            <label >Mật khẩu</label> 
                            <input 
                                type="password" 
                                placeholder="Mật khẩu" 
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors(prev => ({
                                        ...prev, 
                                        password: ""
                                    }))
                                }} 
                                className={errors.password ? "error-input" : ""} 
                            />
                            <p className="error">{errors.password}</p>
                        </div>

                        <div className="form-group">
                            <label >Nhập lại mật khẩu</label> 
                            <input 
                                type="password" 
                                placeholder="Nhập lại mật khẩu" 
                                value={confirmPassword} 
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setErrors(prev => ({
                                        ...prev,
                                        confirmPassword: ""
                                    }))
                                }} 
                                className={errors.confirmPassword ? "error-input" : ""} 
                            />
                            <p className="error">{errors.confirmPassword}</p>
                        </div>

                        <button type="submit">Đăng ký</button>
                    </form>
                    <p className="loginpara">Bạn đã có tài khoản? <Link to='/login'>Đăng nhập</Link> </p>
                </div>
            </div>
        </>
    )
}

export default Register;