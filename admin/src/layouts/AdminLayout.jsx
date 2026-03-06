import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import './AdminLayout.css'

function AdminLayout() {
    return (
        <>
            <div className="admin-layout">
                <Sidebar />
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default AdminLayout;