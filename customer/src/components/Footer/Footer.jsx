import { Link } from "react-router-dom";
import './Footer.css'
function Footer() {
    return (
        <>
            <footer className="footer">
                <hr />
                <div className="footer-container">
                    {/* Ben trai */}
                    <div className="footer-column">
                        <h3>Chăm sóc khánh hàng</h3>
                        <p><i className="fa-solid fa-phone-volume"></i> 0123456789</p> 
                        <h3>Mạng xã hội</h3>
                        <div className="social-icons">
                            <p>
                                <Link to='#'> 
                                    <i className="fa-brands fa-facebook" style={{color: "rgb(0, 0, 0)"}}></i> Facebook
                                </Link>
                            </p>

                            <p>
                                <Link to='#'>
                                    <i className="fa-brands fa-instagram" style={{color: "rgb(0, 0, 0)"}}></i> Instagram
                                </Link>
                            </p>

                            <p>
                                <Link to='#'>
                                    <i className="fa-brands fa-youtube" style={{color: "rgb(0, 0, 0)"}}></i> Youtube
                                </Link>
                            </p>
                            
                            <p>
                                <Link to='#'>
                                    <i className="fa-regular fa-envelope" style={{color: "rgb(0, 0, 0)"}}></i> abcxyz@gmail.com
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* cai o giua */}
                    <div className="footer-column">
                        <h3>Chính sách</h3>
                        <ul>
                            <li><Link to='#'>FAQ</Link></li>
                            <li><Link to='#'>Chính sách bảo mật</Link></li>
                            <li><Link to='#'>Chính sách thẻ thành viên</Link></li>
                            <li><Link to='#'>Chính sách bảo hành & đổi trả</Link></li>
                            <li><Link to='#'>Chính sách giao hàng hoả tốc</Link></li>
                        </ul>
                    </div>

                    {/* Ben phai */}
                    <div className="footer-column">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4031.0448130813934!2d106.69744551072459!3d10.827539589279805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f4a62fce9b%3A0xc99902aa1e26ef02!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBWxINuIExhbmcgLSBDxqEgc-G7nyBjaMOtbmg!5e1!3m2!1svi!2s!4v1771828981955!5m2!1svi!2s"
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 LNK. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer;