import {Link} from 'react-router-dom'
import './sidebar.css'
function Sidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>Admin</h3>
                <ul>
                    <li><Link to='/'>Dashboard</Link></li>
                    <li><Link to='/products'>Sản phẩm</Link></li>
                    <li><Link to='/orders'>Đơn hàng</Link></li>
                    <li><Link to='/user'>Người dùng</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar;