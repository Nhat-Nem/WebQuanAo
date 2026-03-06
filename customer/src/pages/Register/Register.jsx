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
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            alert("Mật khẩu không khớp")
            return
        }

        try {
            await axios.post("http://localhost:5050/api/auth/register", {
                firstname, lastname, username, email, password
            })

            alert('Đăng ký thành công')

            navigate("/login")
        } catch (error) {
            alert("Đăng kí thất bại")
            console.log(error)
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
                                <input type="text" placeholder='Họ' value={firstname} onChange={(e) => setFirstName(e.target.value)} required/>
                            </div>

                            <div className="form-group">
                                <label>Tên</label>
                                <input type="text" placeholder='Tên' value={lastname} onChange={(e) => setLastName(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tên đăng nhập</label> 
                            <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => {setUsername(e.target.value)}} required/>
                        </div>
                        
                        <div className="form-group">
                            <label >Email</label> 
                            <input type="email" placeholder="Email..." value={email} onChange={(e) => {setEmail(e.target.value)}} required/>
                        </div>

                        <div className="form-group">
                            <label >Mật khẩu</label> 
                            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => {setPassword(e.target.value)}} required/>
                        </div>

                        <div className="form-group">
                            <label >Nhập lại mật khẩu</label> 
                            <input type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} required/>
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